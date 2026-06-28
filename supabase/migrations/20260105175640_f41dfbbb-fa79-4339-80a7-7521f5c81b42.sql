-- Add iban column to bank_accounts table for EUR accounts
ALTER TABLE public.bank_accounts 
ADD COLUMN iban text;

-- Update account_type constraint to allow USD/EUR
-- Make account_number and routing_number nullable for EUR accounts
ALTER TABLE public.bank_accounts 
ALTER COLUMN account_number DROP NOT NULL,
ALTER COLUMN routing_number DROP NOT NULL;

-- Set default account_type to 'USD'
ALTER TABLE public.bank_accounts 
ALTER COLUMN account_type SET DEFAULT 'USD';