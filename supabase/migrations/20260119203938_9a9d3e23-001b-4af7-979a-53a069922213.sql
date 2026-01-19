-- Create table for moisture threshold settings
CREATE TABLE public.moisture_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_moisture NUMERIC NOT NULL DEFAULT 4.5,
  max_moisture NUMERIC NOT NULL DEFAULT 7.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.moisture_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a monitoring system)
CREATE POLICY "Anyone can read moisture settings" 
ON public.moisture_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update moisture settings" 
ON public.moisture_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert moisture settings" 
ON public.moisture_settings 
FOR INSERT 
WITH CHECK (true);

-- Insert default values
INSERT INTO public.moisture_settings (min_moisture, max_moisture) VALUES (4.5, 7.0);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_moisture_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_moisture_settings_updated_at
BEFORE UPDATE ON public.moisture_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_moisture_settings_updated_at();