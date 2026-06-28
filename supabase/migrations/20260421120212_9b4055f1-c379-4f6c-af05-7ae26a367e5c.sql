ALTER TABLE public.employee_time_entries 
ADD COLUMN entry_source text NOT NULL DEFAULT 'automatic';

COMMENT ON COLUMN public.employee_time_entries.entry_source IS 'automatic = registered via start/stop timer; manual = edited or created manually';