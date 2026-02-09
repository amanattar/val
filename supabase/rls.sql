alter table public.user_val disable row level security;
alter table public.val_pages disable row level security;

grant select, insert, update, delete on public.user_val to anon, authenticated;
grant select, insert, update, delete on public.val_pages to anon, authenticated;

grant usage on schema public to anon, authenticated;
