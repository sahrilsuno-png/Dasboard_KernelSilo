-- Create table for logsheet data
CREATE TABLE public.logsheet_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  silo1_moisture DECIMAL(5,2) NOT NULL,
  silo1_temp DECIMAL(5,1) NOT NULL,
  silo2_moisture DECIMAL(5,2) NOT NULL,
  silo2_temp DECIMAL(5,1) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.logsheet_entries ENABLE ROW LEVEL SECURITY;

-- Allow public read access for now (can be restricted later with auth)
CREATE POLICY "Anyone can read logsheet entries"
ON public.logsheet_entries
FOR SELECT
USING (true);

-- Allow public insert for now (will be from ESP32 or system)
CREATE POLICY "Anyone can insert logsheet entries"
ON public.logsheet_entries
FOR INSERT
WITH CHECK (true);

-- Create index for faster date range queries
CREATE INDEX idx_logsheet_timestamp ON public.logsheet_entries(timestamp DESC);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.logsheet_entries;