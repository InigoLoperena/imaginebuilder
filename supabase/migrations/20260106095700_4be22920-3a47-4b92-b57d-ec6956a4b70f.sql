-- Allow admins to view all bank accounts for payment processing
CREATE POLICY "Admins can view all bank accounts"
ON public.bank_accounts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));