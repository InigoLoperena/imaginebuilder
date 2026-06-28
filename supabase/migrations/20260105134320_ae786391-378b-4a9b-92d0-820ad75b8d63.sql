-- Create beta_testers table
CREATE TABLE public.beta_testers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beta_testers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for the signup form)
CREATE POLICY "Anyone can insert to beta_testers"
ON public.beta_testers
FOR INSERT
WITH CHECK (true);

-- Migrate existing waitlist data
INSERT INTO public.beta_testers (email, created_at)
SELECT email, created_at FROM public.waitlist
ON CONFLICT (email) DO NOTHING;