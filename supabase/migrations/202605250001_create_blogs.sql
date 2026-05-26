create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  thumbnail text,
  date date not null default current_date,
  category text not null default 'general',
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "Allow public read blogs"
on public.blogs for select
using (true);

create policy "Allow authenticated insert blogs"
on public.blogs for insert
with check (true);

create policy "Allow authenticated update blogs"
on public.blogs for update
using (true);

create policy "Allow authenticated delete blogs"
on public.blogs for delete
using (true);

create index if not exists blogs_public_order_idx
  on public.blogs (is_active, date desc);

drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at
before update on public.blogs
for each row
execute function public.set_updated_at();
