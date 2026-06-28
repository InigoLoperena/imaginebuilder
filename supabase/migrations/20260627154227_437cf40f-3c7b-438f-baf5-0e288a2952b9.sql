
CREATE TABLE public.venture_time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  total_minutes INTEGER,
  description TEXT,
  entry_source TEXT DEFAULT 'auto',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.venture_time_entries TO anon, authenticated;
GRANT ALL ON public.venture_time_entries TO service_role;

ALTER TABLE public.venture_time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view venture time entries" ON public.venture_time_entries FOR SELECT USING (true);
CREATE POLICY "Public can insert venture time entries" ON public.venture_time_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update venture time entries" ON public.venture_time_entries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete venture time entries" ON public.venture_time_entries FOR DELETE USING (true);

CREATE TRIGGER update_venture_time_entries_updated_at
BEFORE UPDATE ON public.venture_time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_venture_time_entries_project ON public.venture_time_entries(project_name);
CREATE INDEX idx_venture_time_entries_employee ON public.venture_time_entries(employee_name);
