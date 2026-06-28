CREATE TABLE public.employee_time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  total_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view time entries"
ON public.employee_time_entries FOR SELECT
USING (true);

CREATE POLICY "Public can insert time entries"
ON public.employee_time_entries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update time entries"
ON public.employee_time_entries FOR UPDATE
USING (true);

CREATE POLICY "Public can delete time entries"
ON public.employee_time_entries FOR DELETE
USING (true);

CREATE INDEX idx_employee_time_entries_employee_name ON public.employee_time_entries(employee_name);
CREATE INDEX idx_employee_time_entries_start_time ON public.employee_time_entries(start_time DESC);

CREATE TRIGGER update_employee_time_entries_updated_at
BEFORE UPDATE ON public.employee_time_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();