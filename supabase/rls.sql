alter table public.user_val enable row level security;
alter table public.val_pages enable row level security;

grant select, insert, update, delete on public.user_val to anon, authenticated;
grant select, insert, update, delete on public.val_pages to anon, authenticated;

grant usage on schema public to anon, authenticated;

drop policy if exists "user_val_all" on public.user_val;
create policy "user_val_all" on public.user_val
  for all
  using (true)
  with check (true);

drop policy if exists "val_pages_all" on public.val_pages;
create policy "val_pages_all" on public.val_pages
  for all
  using (true)
  with check (true);
