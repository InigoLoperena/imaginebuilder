
CREATE OR REPLACE FUNCTION public.vb_add_member_with_dilution(_project_id uuid, _new_user_id uuid, _percentage numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  factor numeric;
  before_json jsonb;
  after_json jsonb;
  history_id uuid;
  had_participations boolean;
  total_fixed numeric;
  pool numeric;
  total_hours numeric;
  rec record;
  effective numeric;
  new_fixed numeric;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _percentage <= 0 OR _percentage >= 100 THEN
    RAISE EXCEPTION 'percentage must be > 0 and < 100';
  END IF;

  factor := 1 - (_percentage / 100.0);

  SELECT EXISTS (SELECT 1 FROM public.vb_participations WHERE project_id = _project_id AND user_id <> _new_user_id)
    INTO had_participations;

  SELECT COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'percentage', percentage) ORDER BY percentage DESC), '[]'::jsonb)
    INTO before_json FROM public.vb_participations WHERE project_id = _project_id;

  -- Dilute participation ledger (secondary tracking)
  UPDATE public.vb_participations
    SET percentage = ROUND((percentage * factor)::numeric, 6)
    WHERE project_id = _project_id AND user_id <> _new_user_id;

  INSERT INTO public.vb_participations(project_id, user_id, percentage)
    VALUES (_project_id, _new_user_id, ROUND(_percentage::numeric, 6))
    ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;

  IF had_participations THEN
    DECLARE
      total_after numeric;
      diff numeric;
      last_user uuid;
    BEGIN
      SELECT COALESCE(SUM(percentage), 0) INTO total_after FROM public.vb_participations WHERE project_id = _project_id;
      diff := 100 - total_after;
      IF diff <> 0 THEN
        SELECT user_id INTO last_user FROM public.vb_participations
          WHERE project_id = _project_id AND user_id <> _new_user_id
          ORDER BY percentage DESC LIMIT 1;
        IF last_user IS NOT NULL THEN
          UPDATE public.vb_participations SET percentage = percentage + diff
            WHERE project_id = _project_id AND user_id = last_user;
        END IF;
      END IF;
    END;
  END IF;

  -- === SNAPSHOT-BASED DILUTION OF EFFECTIVE OWNERSHIP ===
  -- Compute each existing member's current effective % (fixed + variable-by-hours),
  -- apply the dilution factor, and write it back to vb_fixed_ownership.
  -- This prevents the freed slice from being auto-redistributed via the hours pool.

  SELECT COALESCE(SUM(percentage), 0) INTO total_fixed
    FROM public.vb_fixed_ownership
   WHERE project_id = _project_id AND user_id <> _new_user_id;
  pool := GREATEST(0, 100 - total_fixed);

  SELECT COALESCE(SUM(hours), 0) INTO total_hours
    FROM public.vb_time_entries
   WHERE project_id = _project_id;

  -- Clear existing fixed rows (except new member) so we can rewrite as snapshot
  FOR rec IN
    SELECT uid FROM (
      SELECT user_id AS uid FROM public.vb_fixed_ownership WHERE project_id = _project_id
      UNION
      SELECT user_id AS uid FROM public.vb_time_entries WHERE project_id = _project_id
      UNION
      SELECT user_id AS uid FROM public.vb_participations WHERE project_id = _project_id
    ) u
    WHERE uid <> _new_user_id
  LOOP
    DECLARE
      fx numeric := 0;
      hrs numeric := 0;
    BEGIN
      SELECT COALESCE(percentage, 0) INTO fx FROM public.vb_fixed_ownership
        WHERE project_id = _project_id AND user_id = rec.uid;
      SELECT COALESCE(SUM(hours), 0) INTO hrs FROM public.vb_time_entries
        WHERE project_id = _project_id AND user_id = rec.uid;

      effective := COALESCE(fx, 0);
      IF total_hours > 0 THEN
        effective := effective + (pool * hrs / total_hours);
      END IF;

      new_fixed := ROUND((effective * factor)::numeric, 4);

      IF new_fixed > 0 THEN
        INSERT INTO public.vb_fixed_ownership(project_id, user_id, percentage)
          VALUES (_project_id, rec.uid, new_fixed)
          ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;
      ELSE
        DELETE FROM public.vb_fixed_ownership
          WHERE project_id = _project_id AND user_id = rec.uid;
      END IF;
    END;
  END LOOP;

  -- Insert / update the new member at exactly _percentage
  INSERT INTO public.vb_fixed_ownership(project_id, user_id, percentage)
    VALUES (_project_id, _new_user_id, ROUND(_percentage::numeric, 4))
    ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;

  DELETE FROM public.vb_fixed_ownership
    WHERE project_id = _project_id AND percentage <= 0;

  SELECT COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'percentage', percentage) ORDER BY percentage DESC), '[]'::jsonb)
    INTO after_json FROM public.vb_participations WHERE project_id = _project_id;

  INSERT INTO public.vb_participation_history(project_id, added_user_id, percentage_added, before_state, after_state, performed_by)
    VALUES (_project_id, _new_user_id, _percentage, before_json, after_json, auth.uid())
    RETURNING id INTO history_id;

  RETURN jsonb_build_object('history_id', history_id, 'before', before_json, 'after', after_json);
END;
$function$;

-- Fix the current Greenroute state: re-snapshot effective ownership for existing members
-- so the previous 12% dilution (Yessica) applies to everyone's effective %, not only fixed.
-- We compute effective as fixed + (pool * hours / totalHours) BEFORE the last dilution,
-- then apply factor 0.88. Since fixed is already diluted, we reverse-engineer:
--   pre_fixed = current_fixed / 0.88
--   effective_pre = pre_fixed + pool_pre * hrs / totalHours
--   new_fixed = effective_pre * 0.88
-- Simpler: use CURRENT fixed (already diluted) + variable pool computed with CURRENT fixed
-- and re-apply the snapshot. This produces the correct end state directly.
DO $$
DECLARE
  proj uuid := 'c8998a5c-cfcb-4433-9182-5247d49419f5';
  total_fixed numeric;
  pool numeric;
  total_hours numeric;
  rec record;
  fx numeric; hrs numeric; effective numeric; new_fixed numeric;
BEGIN
  SELECT COALESCE(SUM(percentage), 0) INTO total_fixed
    FROM public.vb_fixed_ownership WHERE project_id = proj;
  pool := GREATEST(0, 100 - total_fixed);
  SELECT COALESCE(SUM(hours), 0) INTO total_hours
    FROM public.vb_time_entries WHERE project_id = proj;

  IF pool > 0 AND total_hours > 0 THEN
    FOR rec IN
      SELECT DISTINCT user_id AS uid FROM public.vb_time_entries WHERE project_id = proj
    LOOP
      SELECT COALESCE(percentage, 0) INTO fx FROM public.vb_fixed_ownership
        WHERE project_id = proj AND user_id = rec.uid;
      SELECT COALESCE(SUM(hours), 0) INTO hrs FROM public.vb_time_entries
        WHERE project_id = proj AND user_id = rec.uid;
      effective := fx + (pool * hrs / total_hours);
      new_fixed := ROUND(effective::numeric, 4);
      INSERT INTO public.vb_fixed_ownership(project_id, user_id, percentage)
        VALUES (proj, rec.uid, new_fixed)
        ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;
    END LOOP;
  END IF;
END $$;
