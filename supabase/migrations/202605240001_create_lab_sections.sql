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

create table if not exists public.lab_categories (
  id text primary key,
  label text not null,
  icon_key text not null default 'star',
  kind text not null default 'category',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_categories_kind_check check (kind in ('system', 'type', 'category'))
);

create table if not exists public.lab_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type_id text not null references public.lab_categories(id),
  category_id text not null references public.lab_categories(id),
  description text not null,
  long_description text,
  image_path text not null,
  screenshots text[] not null default '{}',
  tech_stack text[] not null default '{}',
  features text[] not null default '{}',
  github_url text,
  website_url text,
  status text not null default 'development',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_projects_title_unique unique (title),
  constraint lab_projects_status_check check (status in ('draft', 'development', 'published', 'archived'))
);

create index if not exists lab_categories_public_order_idx
  on public.lab_categories (is_active, kind, sort_order);

create index if not exists lab_projects_public_order_idx
  on public.lab_projects (is_active, status, sort_order, created_at);

create index if not exists lab_projects_filter_idx
  on public.lab_projects (type_id, category_id, status, is_active);

drop trigger if exists set_lab_categories_updated_at on public.lab_categories;
create trigger set_lab_categories_updated_at
before update on public.lab_categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_lab_projects_updated_at on public.lab_projects;
create trigger set_lab_projects_updated_at
before update on public.lab_projects
for each row
execute function public.set_updated_at();

alter table public.lab_categories enable row level security;
alter table public.lab_projects enable row level security;

drop policy if exists "Public can read active lab categories" on public.lab_categories;
create policy "Public can read active lab categories"
on public.lab_categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated can manage lab categories" on public.lab_categories;
create policy "Authenticated can manage lab categories"
on public.lab_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published lab projects" on public.lab_projects;
create policy "Public can read published lab projects"
on public.lab_projects
for select
to anon, authenticated
using (is_active = true and status = 'published');

drop policy if exists "Authenticated can manage lab projects" on public.lab_projects;
create policy "Authenticated can manage lab projects"
on public.lab_projects
for all
to authenticated
using (true)
with check (true);

insert into public.lab_categories (id, label, icon_key, kind, sort_order)
values
  ('all', 'Semua Proyek', 'star', 'system', 0),
  ('mobile', 'Aplikasi Mobile', 'smartphone', 'type', 1),
  ('web', 'Aplikasi Web', 'globe', 'type', 2),
  ('desktop', 'Aplikasi Desktop', 'computer', 'type', 3),
  ('ecommerce', 'E-Commerce', 'users', 'category', 4),
  ('communication', 'Komunikasi', 'users', 'category', 5),
  ('productivity', 'Produktivitas', 'star', 'category', 6),
  ('business', 'Bisnis', 'globe', 'category', 7)
on conflict (id) do update
set
  label = excluded.label,
  icon_key = excluded.icon_key,
  kind = excluded.kind,
  sort_order = excluded.sort_order,
  is_active = true;

insert into public.lab_projects (
  title,
  type_id,
  category_id,
  description,
  long_description,
  image_path,
  screenshots,
  tech_stack,
  features,
  github_url,
  website_url,
  status,
  sort_order
)
values
  (
    'Titu Laundry',
    'mobile',
    'ecommerce',
    'Titu Laundry adalah aplikasi berbasis mobile yang digunakan untuk pemesanan dan pemantauan laundry yang sedang dikerjakan oleh toko.',
    'Titu Laundry merupakan aplikasi berbasis mobile yang dirancang untuk memberikan kemudahan dalam layanan laundry modern. Pengguna dapat memilih jenis layanan laundry yang diinginkan, melihat daftar produk atau paket laundry yang tersedia, serta melakukan pemesanan secara langsung dari aplikasi. Fitur pemantauan status memungkinkan pengguna untuk mengetahui tahap pengerjaan laundry secara real-time, mulai dari penjemputan, pencucian, hingga pengantaran kembali.',
    '/projects/app1/main.jpg',
    array['/projects/app1/main.jpg', '/projects/app1/home.jpg'],
    array['Java', 'MySQL', 'PHP', 'REST API'],
    array['Product Laundry', 'Pemantauan Status', 'Profil', 'Pembayaran', 'Informasi Biaya'],
    'https://github.com/Daffaaditya2807/Project-Laundry',
    null,
    'published',
    1
  ),
  (
    'eSidokare',
    'mobile',
    'communication',
    'Aplikasi ini dirancang untuk menyampaikan aspirasi, keluhan, dan permintaan informasi oleh masyarakat kepada instansi desa.',
    'eSidokare merupakan aplikasi mobile berbasis Flutter yang dirancang untuk memperkuat komunikasi antara masyarakat dan pemerintah desa. Melalui platform ini, warga dapat menyampaikan aspirasi, keluhan, hingga permintaan informasi sesuai regulasi PPID tanpa harus datang langsung ke kantor desa.',
    '/projects/app2/main.png',
    array['/projects/app2/main.png', '/projects/app2/home.png'],
    array['Flutter', 'Dart', 'SQLite', 'REST API'],
    array['Pengajuan Surat', 'Download Surat', 'Berita & Komen', 'Informasi Warga', 'Notifikasi'],
    'https://github.com/Daffaaditya2807/sidokare_mobile_app',
    null,
    'published',
    2
  ),
  (
    'Antriqu',
    'mobile',
    'productivity',
    'Antriqu adalah aplikasi modern untuk pemesanan atau booking yang terintegrasi dengan mobile app.',
    'Antriqu adalah aplikasi mobile berbasis Flutter yang dirancang untuk menyederhanakan proses pemesanan layanan secara digital. Aplikasi ini memungkinkan pengguna melakukan booking, melihat status pesanan secara real-time, menerima notifikasi otomatis, dan melihat riwayat booking.',
    '/projects/app3/main.png',
    array['/projects/app3/main.png', '/projects/app3/login.png', '/projects/app3/status.png', '/projects/app3/dashboard.png', '/projects/app3/booking.png'],
    array['Flutter', 'Dart', 'Laravel', 'REST API', 'Firebase Cloud Messaging', 'MySQL', 'SQLite'],
    array['Real-time Status Pesanan', 'Notifikasi Status Pesanan', 'Booking Pesanan', 'Chart Kepadatan Booking', 'History Booking'],
    'https://github.com/Daffaaditya2807/booking-apps-mobile',
    null,
    'development',
    3
  ),
  (
    'eBendungan',
    'mobile',
    'communication',
    'Aplikasi untuk pengajuan surat, informasi, pengaduan aspirasi, dan keluhan warga Desa Bendungan.',
    'eBendungan adalah aplikasi mobile berbasis Flutter yang dikembangkan untuk mendukung keterbukaan informasi dan layanan publik di Desa Bendungan. Aplikasi ini menyediakan layanan pengajuan surat, penyampaian aspirasi, keluhan, informasi desa, tracking pengajuan, dan notifikasi.',
    '/projects/app4/splash.png',
    array['/projects/app4/splash.png', '/projects/app4/login.png', '/projects/app4/dashboard.png', '/projects/app4/detail.png'],
    array['Flutter', 'Dart', 'REST API', 'Laravel', 'MySQL', 'Firebase', 'Google ML Kit', 'Firebase Cloud Messaging'],
    array['Real-time Tracking', 'Payment Gateway', 'Rating System', 'Order History', 'Live Chat Support'],
    null,
    null,
    'development',
    4
  ),
  (
    'Lumintu Energi Persada',
    'web',
    'business',
    'Website company profile modern untuk agensi digital dengan sistem manajemen konten.',
    'Website ini dikembangkan sebagai company profile modern untuk Lumintu Energi Persada. Situs ini menampilkan portofolio, layanan utama, informasi kontak, serta sistem CMS untuk memudahkan pengelolaan konten.',
    '/projects/app5/main.png',
    array['/projects/app5/main.png', '/projects/app5/login.png', '/projects/app5/dashboard.png', '/projects/app5/laporan.png', '/projects/app5/produk.png'],
    array['Laravel', 'Bootstrap', 'MySQL'],
    array['Company Profile', 'Manajemen Sistem CMS', 'Laporan', 'Pencatatan', 'Administrasi Surat Jalan & Tugas'],
    null,
    'https://lumintuenergipersada.my.id/',
    'published',
    5
  ),
  (
    'Piscis AI',
    'web',
    'productivity',
    'Aplikasi web untuk mendeteksi jenis ikan menggunakan teknologi Artificial Intelligence.',
    'Piscis AI adalah aplikasi web berbasis kecerdasan buatan yang dirancang untuk mendeteksi jenis ikan secara otomatis melalui gambar. Aplikasi ini menggunakan model AI untuk mengenali ciri visual dari berbagai jenis ikan.',
    '/projects/app6/main.png',
    array['/projects/app6/main.png', '/projects/app6/fitur.png', '/projects/app6/ai.png'],
    array['Vue3', 'Typescript', 'Tailwind CSS', 'Teachable Machine'],
    array['Deteksi jenis ikan dengan AI'],
    'https://github.com/Daffaaditya2807/piscisAI',
    'https://piscis-ai.vercel.app/',
    'published',
    6
  ),
  (
    'Primadona Apps - Background Remover',
    'desktop',
    'productivity',
    'Aplikasi desktop untuk menghapus latar belakang gambar secara otomatis menggunakan teknologi AI.',
    'Primadona Apps Background Remover adalah aplikasi desktop yang dirancang untuk kebutuhan percetakan foto formal. Aplikasi ini dapat menghapus latar belakang gambar, mengganti warna background, dan melakukan crop otomatis untuk ukuran foto formal.',
    '/projects/app7/main.png',
    array['/projects/app7/main.png', '/projects/app7/bgremover.png', '/projects/app7/colorbg.png', '/projects/app7/crop.png'],
    array['Python', 'rembg', 'PyQT5', 'PyInstaller'],
    array['Hapus latar belakang gambar dengan AI', 'Ubah warna background', 'Simpan dalam format PNG/JPG', 'Ubah ukuran gambar rasio 2x3, 3x4, dan 4x6'],
    'https://github.com/Daffaaditya2807/Primadona-Apps-Remove-Background---Desktop',
    null,
    'published',
    7
  )
on conflict (title) do update
set
  type_id = excluded.type_id,
  category_id = excluded.category_id,
  description = excluded.description,
  long_description = excluded.long_description,
  image_path = excluded.image_path,
  screenshots = excluded.screenshots,
  tech_stack = excluded.tech_stack,
  features = excluded.features,
  github_url = excluded.github_url,
  website_url = excluded.website_url,
  status = excluded.status,
  sort_order = excluded.sort_order,
  is_active = true;
