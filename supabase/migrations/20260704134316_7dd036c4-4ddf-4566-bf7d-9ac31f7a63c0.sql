
ALTER TABLE public.vb_projects
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS pitch_deck_url text,
  ADD COLUMN IF NOT EXISTS description text;

-- Allow anon (public landing) to read projects
GRANT SELECT ON public.vb_projects TO anon;
DROP POLICY IF EXISTS "projects read public" ON public.vb_projects;
CREATE POLICY "projects read public" ON public.vb_projects FOR SELECT TO anon USING (true);

-- Ownership overrides table
CREATE TABLE IF NOT EXISTS public.vb_ownership_override (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vb_ownership_override TO authenticated;
GRANT ALL ON public.vb_ownership_override TO service_role;

ALTER TABLE public.vb_ownership_override ENABLE ROW LEVEL SECURITY;

CREATE POLICY "override read authed" ON public.vb_ownership_override
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "override admin all" ON public.vb_ownership_override
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER vb_ownership_override_updated_at
  BEFORE UPDATE ON public.vb_ownership_override
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
