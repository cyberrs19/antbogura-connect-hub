-- Create payment_settings table to store visibility of payment options
CREATE TABLE public.payment_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_type TEXT NOT NULL UNIQUE,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read payment settings (needed for public bill payment page)
CREATE POLICY "Anyone can view payment settings"
ON public.payment_settings
FOR SELECT
USING (true);

-- Only admins/managers can update payment settings
CREATE POLICY "Admins can update payment settings"
ON public.payment_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- Insert default payment options
INSERT INTO public.payment_settings (payment_type, is_visible) VALUES
  ('bkash_merchant', true),
  ('bkash_personal', true),
  ('nagad_merchant', true),
  ('nagad_personal', true);