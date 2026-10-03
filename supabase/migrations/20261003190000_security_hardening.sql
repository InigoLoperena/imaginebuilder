-- Security hardening for Venture Builder / Imagine Builder.
-- Generated after auditing SECURITY DEFINER functions and admin flows.

CREATE OR REPLACE FUNCTION public.handle_new_vb_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        updated_at = now();

  -- Never grant admin based on a hard-coded email address.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.vb_build_project_snapshot(_project_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT jsonb_build_object(
    'time_entries', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM public.vb_time_entries t WHERE t.project_id = _project_id), '[]'::jsonb),
    'equity_transactions', COALESCE((SELECT jsonb_agg(to_jsonb(e)) FROM public.equity_transactions e WHERE e.project_id = _project_id), '[]'::jsonb),
    'participations', COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM public.vb_participations p WHERE p.project_id = _project_id), '[]'::jsonb),
    'participation_history', COALESCE((SELECT jsonb_agg(to_jsonb(h)) FROM public.vb_participation_history h WHERE h.project_id = _project_id), '[]'::jsonb),
    'fixed_ownership', COALESCE((SELECT jsonb_agg(to_jsonb(f)) FROM public.vb_fixed_ownership f WHERE f.project_id = _project_id), '[]'::jsonb),
    'ownership_override', COALESCE((SELECT jsonb_agg(to_jsonb(o)) FROM public.vb_ownership_override o WHERE o.project_id = _project_id), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.vb_reset_project(_project_id uuid, _note text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  snap_id uuid;
  snap jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  snap := public.vb_build_project_snapshot(_project_id);
  INSERT INTO public.vb_project_snapshots(project_id, snapshot, note, created_by)
  VALUES (_project_id, snap, NULLIF(_note, ''), auth.uid())
  RETURNING id INTO snap_id;

  DELETE FROM public.equity_transactions WHERE project_id = _project_id;
  DELETE FROM public.vb_time_entries WHERE project_id = _project_id;
  DELETE FROM public.vb_participation_history WHERE project_id = _project_id;
  DELETE FROM public.vb_participations WHERE project_id = _project_id;
  DELETE FROM public.vb_ownership_override WHERE project_id = _project_id;
  DELETE FROM public.vb_fixed_ownership WHERE project_id = _project_id;

  RETURN snap_id;
END;
$$;

-- Trigger-only / internal functions must not be callable over the API.
REVOKE ALL ON FUNCTION public.handle_new_vb_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.equity_on_entry_approved() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.equity_apply_entry(uuid) FROM PUBLIC, anon, authenticated;

-- Role checks are useful to authenticated RLS policies but should not be public.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Administrative RPCs: authenticated callers only; each function also checks admin role.
REVOKE ALL ON FUNCTION public.vb_build_project_snapshot(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.vb_reset_project(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.vb_restore_project_snapshot(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.vb_add_member_with_dilution(uuid, uuid, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.equity_activate_policy(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.equity_post_correction(uuid, uuid, numeric, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.equity_simulate_fixed(uuid, numeric, numeric, public.equity_rounding) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.vb_build_project_snapshot(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vb_reset_project(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vb_restore_project_snapshot(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vb_add_member_with_dilution(uuid, uuid, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.equity_activate_policy(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.equity_post_correction(uuid, uuid, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.equity_simulate_fixed(uuid, numeric, numeric, public.equity_rounding) TO authenticated;
