alter table public.pages enable row level security;

drop policy if exists "pages_select_public" on public.pages;
drop policy if exists "pages_insert_owner" on public.pages;
drop policy if exists "pages_update_owner" on public.pages;
drop policy if exists "pages_update_public" on public.pages;

-- Allow public reads (required for shareable /p/[id] pages)
create policy "pages_select_public" on public.pages
  for select using (true);

-- Only the authenticated owner can create pages
create policy "pages_insert_owner" on public.pages
  for insert with check (auth.uid() is not null and auth.uid() = creator_id);

-- Owner can update their own rows
create policy "pages_update_owner" on public.pages
  for update
  using (auth.uid() is not null and auth.uid() = creator_id)
  with check (auth.uid() is not null and auth.uid() = creator_id);

-- Public can update response/visits fields (restricted by column privileges below)
create policy "pages_update_public" on public.pages
  for update using (true) with check (true);

-- Column-level update protection
revoke update on public.pages from anon, authenticated;
grant update (responded, response, response_at, visits) on public.pages to anon, authenticated;

-- Ensure table privileges exist
grant select, insert on public.pages to anon, authenticated;
