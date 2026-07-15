create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profile (
  id smallint primary key default 1,
  name text not null,
  text_hero_1 text,
  text_hero_2 text,
  link_porto text,
  header_text text,
  description text,
  hero_image_bw text,
  hero_image_rgb text,
  about_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_single_row check (id = 1)
);

create table if not exists public.typing_texts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint typing_texts_text_unique unique (text)
);

create table if not exists public.tech_stacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_key text not null,
  color text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tech_stacks_icon_key_unique unique (icon_key)
);

create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  date_start date,
  date_end date,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journeys_date_range_check check (
    date_end is null
    or date_start is null
    or date_end >= date_start
  )
);

create index if not exists typing_texts_public_order_idx
  on public.typing_texts (is_active, sort_order, created_at);

create index if not exists tech_stacks_public_order_idx
  on public.tech_stacks (is_active, created_at);

create index if not exists journeys_public_order_idx
  on public.journeys (is_active, sort_order, date_start desc);

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
before update on public.profile
for each row
execute function public.set_updated_at();

drop trigger if exists set_typing_texts_updated_at on public.typing_texts;
create trigger set_typing_texts_updated_at
before update on public.typing_texts
for each row
execute function public.set_updated_at();

drop trigger if exists set_tech_stacks_updated_at on public.tech_stacks;
create trigger set_tech_stacks_updated_at
before update on public.tech_stacks
for each row
execute function public.set_updated_at();

drop trigger if exists set_journeys_updated_at on public.journeys;
create trigger set_journeys_updated_at
before update on public.journeys
for each row
execute function public.set_updated_at();

alter table public.profile enable row level security;
alter table public.typing_texts enable row level security;
alter table public.tech_stacks enable row level security;
alter table public.journeys enable row level security;

drop policy if exists "Public can read profile" on public.profile;
create policy "Public can read profile"
on public.profile
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can manage profile" on public.profile;
create policy "Authenticated can manage profile"
on public.profile
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active typing texts" on public.typing_texts;
create policy "Public can read active typing texts"
on public.typing_texts
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated can manage typing texts" on public.typing_texts;
create policy "Authenticated can manage typing texts"
on public.typing_texts
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active tech stacks" on public.tech_stacks;
create policy "Public can read active tech stacks"
on public.tech_stacks
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated can manage tech stacks" on public.tech_stacks;
create policy "Authenticated can manage tech stacks"
on public.tech_stacks
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active journeys" on public.journeys;
create policy "Public can read active journeys"
on public.journeys
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated can manage journeys" on public.journeys;
create policy "Authenticated can manage journeys"
on public.journeys
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio assets" on storage.objects;
create policy "Public can read portfolio assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated can upload portfolio assets" on storage.objects;
create policy "Authenticated can upload portfolio assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated can update portfolio assets" on storage.objects;
create policy "Authenticated can update portfolio assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated can delete portfolio assets" on storage.objects;
create policy "Authenticated can delete portfolio assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-assets');

insert into public.typing_texts (text, sort_order)
values
  ('Software Engineer', 1),
  ('Frontend Developer', 2),
  ('Mobile Developer', 3),
  ('Flutter Enthusiast', 4),
  ('Problem Solver', 5),
  ('Creative Coder', 6)
on conflict (text) do update
set
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.tech_stacks (name, icon_key, color)
values
  ('Flutter', 'flutter', '#02569B'),
  ('Dart', 'dart', '#0175C2'),
  ('Laravel', 'laravel', '#FF2D20'),
  ('PHP', 'php', '#777BB4'),
  ('MySQL', 'mysql', '#4479A1'),
  ('Firebase', 'firebase', '#FFCA28'),
  ('Vue', 'vue', '#4FC08D'),
  ('Postman', 'postman', '#FF6C37')
on conflict (icon_key) do update
set
  name = excluded.name,
  color = excluded.color,
  is_active = true;
