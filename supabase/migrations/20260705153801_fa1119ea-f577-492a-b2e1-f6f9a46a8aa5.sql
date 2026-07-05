
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
  total_after numeric;
  diff numeric;
  last_user uuid;
  history_id uuid;
  had_participations boolean;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _percentage <= 0 OR _percentage >= 100 THEN
    RAISE EXCEPTION 'percentage must be > 0 and < 100';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.vb_participations WHERE project_id = _project_id AND user_id <> _new_user_id)
    INTO had_participations;

  SELECT COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'percentage', percentage) ORDER BY percentage DESC), '[]'::jsonb)
    INTO before_json FROM public.vb_participations WHERE project_id = _project_id;

  factor := 1 - (_percentage / 100.0);

  -- 1) Dilute existing participation ledger proportionally (excluding the new member)
  UPDATE public.vb_participations
    SET percentage = ROUND((percentage * factor)::numeric, 6)
    WHERE project_id = _project_id AND user_id <> _new_user_id;

  INSERT INTO public.vb_participations(project_id, user_id, percentage)
    VALUES (_project_id, _new_user_id, ROUND(_percentage::numeric, 6))
    ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;

  -- 2) Rounding fix: only rebalance to 100 when the project actually had prior participations.
  --    Otherwise leave the new member at exactly _percentage (do NOT inflate them to 100).
  IF had_participations THEN
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
  END IF;

  -- 3) Mirror the dilution into vb_fixed_ownership so the project equity table reflects it.
  --    Existing fixed owners are diluted by the same factor; the new member is assigned _percentage.
  UPDATE public.vb_fixed_ownership
    SET percentage = ROUND((percentage * factor)::numeric, 4)
    WHERE project_id = _project_id AND user_id <> _new_user_id;

  INSERT INTO public.vb_fixed_ownership(project_id, user_id, percentage)
    VALUES (_project_id, _new_user_id, ROUND(_percentage::numeric, 4))
    ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;

  -- Remove any zeroed-out rows
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
