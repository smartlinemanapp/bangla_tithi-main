-- 1. Add usage_count column
alter table promo_codes add column if not exists usage_count bigint default 0;

-- 2. Create a secure function to increment the count
create or replace function increment_promo_usage(code_text text)
returns void
language plpgsql
security definer -- Runs with admin privileges to allow update
as $$
begin
  update promo_codes
  set usage_count = usage_count + 1
  where code = code_text;
end;
$$;

-- 3. Allow public to call this function
grant execute on function increment_promo_usage(text) to anon;
grant execute on function increment_promo_usage(text) to authenticated;
