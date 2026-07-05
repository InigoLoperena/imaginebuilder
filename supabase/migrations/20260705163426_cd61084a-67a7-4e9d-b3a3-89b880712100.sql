
CREATE TABLE public.vb_project_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  note text,
  restored boolean NOT NULL DEFAULT false,
  restored_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vb_project_snapshots TO authenticated;
GRANT ALL ON public.vb_project_snapshots TO service_role;

ALTER TABLE public.vb_project_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view snapshots"
  ON public.vb_project_snapshots FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage snapshots"
  ON public.vb_project_snapshots FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX vb_project_snapshots_project_idx ON public.vb_project_snapshots(project_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.vb_build_project_snapshot(_project_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT jsonb_build_object(
    'time_entries', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM public.vb_time_entries t WHERE t.project_id = _project_id), '[]'::jsonb),
    'equity_transactions', COALESCE((SELECT jsonb_agg(to_jsonb(e)) FROM public.equity_transactions e WHERE e.project_id = _project_id), '[]'::jsonb),
    'participations', COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM public.vb_participations p WHERE p.project_id = _project_id), '[]'::jsonb),
    'participation_history', COALESCE((SELECT jsonb_agg(to_jsonb(h)) FROM public.vb_participation_history h WHERE h.project_id = _project_id), '[]'::jsonb),
    'fixed_ownership', COALESCE((SELECT jsonb_agg(to_jsonb(f)) FROM public.vb_fixed_ownership f WHERE f.project_id = _project_id), '[]'::jsonb),
    'ownership_override', COALESCE((SELECT jsonb_agg(to_jsonb(o)) FROM public.vb_ownership_override o WHERE o.project_id = _project_id), '[]'::jsonb)
  )
$$;

CREATE OR REPLACE FUNCTION public.vb_reset_project(_project_id uuid, _note text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE snap_id uuid; snap jsonb;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  snap := public.vb_build_project_snapshot(_project_id);
  INSERT INTO public.vb_project_snapshots(project_id, snapshot, note, created_by)
    VALUES (_project_id, snap, _note, auth.uid()) RETURNING id INTO snap_id;
  DELETE FROM public.equity_transactions WHERE project_id = _project_id;
  DELETE FROM public.vb_time_entries WHERE project_id = _project_id;
  DELETE FROM public.vb_participation_history WHERE project_id = _project_id;
  DELETE FROM public.vb_participations WHERE project_id = _project_id;
  DELETE FROM public.vb_ownership_override WHERE project_id = _project_id;
  DELETE FROM public.vb_fixed_ownership WHERE project_id = _project_id;
  RETURN snap_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.vb_restore_project_snapshot(_snapshot_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE proj uuid; snap jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT project_id, snapshot INTO proj, snap FROM public.vb_project_snapshots WHERE id = _snapshot_id;
  IF proj IS NULL THEN RAISE EXCEPTION 'snapshot not found'; END IF;
  DELETE FROM public.equity_transactions WHERE project_id = proj;
  DELETE FROM public.vb_time_entries WHERE project_id = proj;
  DELETE FROM public.vb_participation_history WHERE project_id = proj;
  DELETE FROM public.vb_participations WHERE project_id = proj;
  DELETE FROM public.vb_ownership_override WHERE project_id = proj;
  DELETE FROM public.vb_fixed_ownership WHERE project_id = proj;
  INSERT INTO public.vb_time_entries SELECT * FROM jsonb_populate_recordset(NULL::public.vb_time_entries, snap->'time_entries');
  INSERT INTO public.equity_transactions SELECT * FROM jsonb_populate_recordset(NULL::public.equity_transactions, snap->'equity_transactions');
  INSERT INTO public.vb_participations SELECT * FROM jsonb_populate_recordset(NULL::public.vb_participations, snap->'participations');
  INSERT INTO public.vb_participation_history SELECT * FROM jsonb_populate_recordset(NULL::public.vb_participation_history, snap->'participation_history');
  INSERT INTO public.vb_fixed_ownership SELECT * FROM jsonb_populate_recordset(NULL::public.vb_fixed_ownership, snap->'fixed_ownership');
  INSERT INTO public.vb_ownership_override SELECT * FROM jsonb_populate_recordset(NULL::public.vb_ownership_override, snap->'ownership_override');
  UPDATE public.vb_project_snapshots SET restored = true, restored_at = now() WHERE id = _snapshot_id;
END;
$$;

-- Reset Greenroute now (auth.uid() is NULL in migration; function allows it)
SELECT public.vb_reset_project('c8998a5c-cfcb-4433-9182-5247d49419f5'::uuid, 'Reset inicial de testing');
