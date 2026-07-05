-- Participaciones vigentes por proyecto (siempre suman 100)
CREATE TABLE public.vb_participations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  percentage numeric(9,6) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vb_participations TO authenticated;
GRANT ALL ON public.vb_participations TO service_role;
ALTER TABLE public.vb_participations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participations read authed" ON public.vb_participations FOR SELECT TO authenticated USING (true);
CREATE POLICY "participations admin all" ON public.vb_participations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER trg_vb_participations_updated
  BEFORE UPDATE ON public.vb_participations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Historial auditable de diluciones
CREATE TABLE public.vb_participation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  added_user_id uuid NOT NULL,
  percentage_added numeric(9,6) NOT NULL,
  before_state jsonb NOT NULL,
  after_state jsonb NOT NULL,
  performed_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.vb_participation_history TO authenticated;
GRANT ALL ON public.vb_participation_history TO service_role;
ALTER TABLE public.vb_participation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "history read authed" ON public.vb_participation_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history insert admin" ON public.vb_participation_history FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role) AND performed_by = auth.uid());

-- Función atómica de dilución
CREATE OR REPLACE FUNCTION public.vb_add_member_with_dilution(
  _project_id uuid,
  _new_user_id uuid,
  _percentage numeric
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  factor numeric;
  before_json jsonb;
  after_json jsonb;
  total_after numeric;
  diff numeric;
  last_user uuid;
  r record;
  history_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _percentage <= 0 OR _percentage >= 100 THEN
    RAISE EXCEPTION 'percentage must be > 0 and < 100';
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'percentage', percentage) ORDER BY percentage DESC), '[]'::jsonb)
    INTO before_json FROM public.vb_participations WHERE project_id = _project_id;

  factor := 1 - (_percentage / 100.0);

  -- Diluir existentes (excepto el nuevo por si ya existe)
  UPDATE public.vb_participations
    SET percentage = ROUND((percentage * factor)::numeric, 6)
    WHERE project_id = _project_id AND user_id <> _new_user_id;

  -- Insertar/actualizar nuevo miembro
  INSERT INTO public.vb_participations(project_id, user_id, percentage)
    VALUES (_project_id, _new_user_id, ROUND(_percentage::numeric, 6))
    ON CONFLICT (project_id, user_id) DO UPDATE SET percentage = EXCLUDED.percentage;

  -- Ajuste de redondeo: dejar total = 100 aplicando la diferencia al mayor propietario (que no sea el nuevo)
  SELECT COALESCE(SUM(percentage), 0) INTO total_after FROM public.vb_participations WHERE project_id = _project_id;
  diff := 100 - total_after;
  IF diff <> 0 THEN
    SELECT user_id INTO last_user FROM public.vb_participations
      WHERE project_id = _project_id AND user_id <> _new_user_id
      ORDER BY percentage DESC LIMIT 1;
    IF last_user IS NULL THEN
      last_user := _new_user_id;
    END IF;
    UPDATE public.vb_participations SET percentage = percentage + diff
      WHERE project_id = _project_id AND user_id = last_user;
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'percentage', percentage) ORDER BY percentage DESC), '[]'::jsonb)
    INTO after_json FROM public.vb_participations WHERE project_id = _project_id;

  INSERT INTO public.vb_participation_history(project_id, added_user_id, percentage_added, before_state, after_state, performed_by)
    VALUES (_project_id, _new_user_id, _percentage, before_json, after_json, auth.uid())
    RETURNING id INTO history_id;

  RETURN jsonb_build_object('history_id', history_id, 'before', before_json, 'after', after_json);
END;
$$;

GRANT EXECUTE ON FUNCTION public.vb_add_member_with_dilution(uuid, uuid, numeric) TO authenticated;