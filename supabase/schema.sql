create extension if not exists "pgcrypto";

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  valentine_name text not null,
  creator_id uuid not null references auth.users (id) on delete cascade,
  responded boolean not null default false,
  response boolean,
  response_at timestamptz,
  visits integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pages_creator_id_idx on public.pages (creator_id);
create index if not exists pages_created_at_idx on public.pages (created_at desc);
create unique index if not exists pages_slug_idx on public.pages (slug);
