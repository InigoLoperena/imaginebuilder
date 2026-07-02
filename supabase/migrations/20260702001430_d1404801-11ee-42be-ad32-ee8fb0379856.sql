ALTER TABLE public.vb_time_entries ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'tracked' CHECK (source IN ('tracked','edited','manual'));

DROP POLICY IF EXISTS "vb_time_entries_update_own" ON public.vb_time_entries;
CREATE POLICY "vb_time_entries_update_own" ON public.vb_time_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);