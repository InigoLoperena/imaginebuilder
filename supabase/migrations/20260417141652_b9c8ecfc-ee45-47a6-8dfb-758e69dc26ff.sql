CREATE TABLE public.employee_payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name TEXT NOT NULL UNIQUE,
  global_username TEXT,
  bank_ars TEXT,
  bank_usd TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view payment methods"
ON public.employee_payment_methods FOR SELECT USING (true);

CREATE POLICY "Public can insert payment methods"
ON public.employee_payment_methods FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update payment methods"
ON public.employee_payment_methods FOR UPDATE USING (true);

CREATE POLICY "Public can delete payment methods"
ON public.employee_payment_methods FOR DELETE USING (true);

CREATE TRIGGER update_employee_payment_methods_updated_at
BEFORE UPDATE ON public.employee_payment_methods
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();