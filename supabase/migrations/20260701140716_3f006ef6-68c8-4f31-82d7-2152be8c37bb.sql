-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles read authed" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles admin all" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Projects
CREATE TABLE public.vb_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vb_projects TO authenticated;
GRANT ALL ON public.vb_projects TO service_role;
ALTER TABLE public.vb_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects read authed" ON public.vb_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects admin all" ON public.vb_projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Time entries
CREATE TABLE public.vb_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hours NUMERIC(6,2) NOT NULL CHECK (hours > 0),
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_vb_time_entries_project ON public.vb_time_entries(project_id);
CREATE INDEX idx_vb_time_entries_user ON public.vb_time_entries(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vb_time_entries TO authenticated;
GRANT ALL ON public.vb_time_entries TO service_role;
ALTER TABLE public.vb_time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries read authed" ON public.vb_time_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "entries insert own" ON public.vb_time_entries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "entries update own" ON public.vb_time_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "entries delete own or admin" ON public.vb_time_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- Fixed ownership
CREATE TABLE public.vb_fixed_ownership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
GRANT SELECT ON public.vb_fixed_ownership TO authenticated;
GRANT ALL ON public.vb_fixed_ownership TO service_role;
ALTER TABLE public.vb_fixed_ownership ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fixed read authed" ON public.vb_fixed_ownership FOR SELECT TO authenticated USING (true);
CREATE POLICY "fixed admin all" ON public.vb_fixed_ownership FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_vb_projects_updated BEFORE UPDATE ON public.vb_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_vb_fixed_ownership_updated BEFORE UPDATE ON public.vb_fixed_ownership
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_vb_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'inigoloperena@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin'::public.app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_vb ON auth.users;
CREATE TRIGGER on_auth_user_created_vb
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_vb_user();

-- Storage policies for project-logos bucket
DROP POLICY IF EXISTS "project-logos public read" ON storage.objects;
CREATE POLICY "project-logos public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-logos');
DROP POLICY IF EXISTS "project-logos admin write" ON storage.objects;
CREATE POLICY "project-logos admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'project-logos' AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id = 'project-logos' AND public.has_role(auth.uid(),'admin'));
