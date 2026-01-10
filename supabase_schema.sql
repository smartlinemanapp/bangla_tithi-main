-- Create the table for storing Tithi events
create table tithi_events (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  type text,
  data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Separate index for date filtering (though Unique constraint creates one, explicit index is good practice for ranges)
create index idx_tithi_events_date on tithi_events (date);

-- Enable Row Level Security (RLS)
alter table tithi_events enable row level security;

-- Policy: Allow anonymous access (public) to READ all data
create policy "Allow public read access"
  on tithi_events
  for select
  to anon
  using (true);

-- Policy: Allow only service_role (backend/admin) to INSERT/UPDATE/DELETE
-- (No specific policy needed for service_role as it bypasses RLS by default, 
-- but this ensures anon cannot write)
