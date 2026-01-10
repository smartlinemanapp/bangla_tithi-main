-- Enable Realtime for the tithi_events table
-- This allows the app to "listen" for changes instantly

begin;
  -- Add the table to the publication that Supabase Realtime listens to
  alter publication supabase_realtime add table tithi_events;
commit;
