alter table public.pages
  add column if not exists slug text;

update public.pages
set slug = concat('p-', replace(id::text, '-', ''))
where slug is null or slug = '';

alter table public.pages
  alter column slug set not null;

create unique index if not exists pages_slug_idx on public.pages (slug);
