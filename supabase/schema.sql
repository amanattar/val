create extension if not exists "pgcrypto";

create table if not exists public.user_val (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  session_token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.val_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  user_id uuid not null references public.user_val (id) on delete cascade,
  valentine_name text not null,
  responded boolean not null default false,
  response boolean,
  response_at timestamptz,
  visits integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists user_val_session_token_idx on public.user_val (session_token);
create index if not exists val_pages_user_id_idx on public.val_pages (user_id);
create index if not exists val_pages_created_at_idx on public.val_pages (created_at desc);
create unique index if not exists val_pages_slug_idx on public.val_pages (slug);
