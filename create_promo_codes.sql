-- Create a table for Promo Codes
create table promo_codes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table promo_codes enable row level security;

-- Allow public read access (so the app can check if a code exists)
create policy "Allow public read access"
  on promo_codes for select to anon using (true);

-- Insert some starter codes (You can delete these later)
insert into promo_codes (code) values ('BANGLA2026'), ('PROMO100');
