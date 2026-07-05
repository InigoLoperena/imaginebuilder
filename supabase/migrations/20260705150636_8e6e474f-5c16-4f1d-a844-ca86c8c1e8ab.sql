
ALTER TABLE public.vb_projects
  ADD COLUMN IF NOT EXISTS visible_landing boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS visible_internal boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.vb_app_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  landing_projects_section_visible boolean NOT NULL DEFAULT true,
  internal_projects_section_visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.vb_app_settings TO anon, authenticated;
GRANT UPDATE, INSERT ON public.vb_app_settings TO authenticated;
GRANT ALL ON public.vb_app_settings TO service_role;

ALTER TABLE public.vb_app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings read all" ON public.vb_app_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "app_settings admin write" ON public.vb_app_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.vb_app_settings (id) VALUES (true) ON CONFLICT DO NOTHING;
