-- Fix promo_codes table to ensure proper primary key

-- Drop the existing table if it has issues
DROP TABLE IF EXISTS promo_codes CASCADE;

-- Recreate with proper primary key
CREATE TABLE promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  usage_count BIGINT DEFAULT 0,
  max_usage_count BIGINT DEFAULT NULL, -- NULL means unlimited usage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON promo_codes FOR SELECT TO anon USING (true);

-- Insert starter codes
INSERT INTO promo_codes (code) VALUES 
  ('BANGLA_PRO'),
  ('BANGLA2026'),
  ('PROMO100');

-- Recreate the increment function with max usage check
CREATE OR REPLACE FUNCTION increment_promo_usage(code_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promo_codes
  SET usage_count = usage_count + 1
  WHERE code = code_text 
    AND is_active = true
    AND (max_usage_count IS NULL OR usage_count < max_usage_count);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_promo_usage(text) TO anon;
GRANT EXECUTE ON FUNCTION increment_promo_usage(text) TO authenticated;
