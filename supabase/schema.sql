-- =====================================================================
-- BiralBond — Supabase schema (tables, security rules, image storage)
-- Run this ONCE in: Supabase Dashboard > SQL Editor > New query > Run
-- Then run seed.sql (site data), and finally make-admin.sql (see DEPLOY.md).
-- =====================================================================

create extension if not exists pgcrypto;

create table if not exists public."Article" (
  "id" text primary key default gen_random_uuid()::text,
  "title" text not null,
  "category" text not null,
  "excerpt" text not null,
  "content" text not null,
  "author" text not null,
  "readTime" integer not null default 5,
  "image" text,
  "tags" text,
  "featured" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Breed" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "bnName" text,
  "origin" text,
  "temperament" text,
  "lifespan" text,
  "weight" text,
  "rarity" text not null default 'Common',
  "category" text not null default 'Pedigree',
  "description" text not null,
  "careLevel" text not null default 'Moderate',
  "goodWithKids" boolean not null default true,
  "hypoallergenic" boolean not null default false,
  "image" text,
  "accent" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "price" text
);

create table if not exists public."CareTip" (
  "id" text primary key default gen_random_uuid()::text,
  "title" text not null,
  "body" text not null,
  "icon" text not null default '🐾',
  "category" text not null default 'Daily',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."CatFoodShop" (
  "id" text primary key default gen_random_uuid()::text,
  "shopName" text not null,
  "ownerName" text,
  "shopImage" text,
  "address" text not null,
  "division" text not null,
  "district" text not null,
  "area" text not null,
  "phone" text not null,
  "whatsapp" text,
  "facebook" text,
  "website" text,
  "mapUrl" text,
  "openingHours" text,
  "homeDelivery" boolean not null default false,
  "availableBrands" text,
  "foodTypes" text,
  "packSizes" text,
  "priceInfo" text,
  "description" text,
  "verified" text not null default 'Not Verified',
  "rating" double precision not null default 0,
  "reviewCount" integer not null default 0,
  "lastUpdated" timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."CatShop" (
  "id" text primary key default gen_random_uuid()::text,
  "shopName" text not null,
  "ownerName" text,
  "shopImage" text,
  "catImage" text,
  "address" text not null,
  "division" text not null,
  "district" text not null,
  "upazila" text,
  "area" text not null,
  "phone" text not null,
  "whatsapp" text,
  "facebook" text,
  "website" text,
  "mapUrl" text,
  "openingHours" text,
  "availableBreeds" text,
  "description" text,
  "verified" text not null default 'Not Verified',
  "rating" double precision not null default 0,
  "reviewCount" integer not null default 0,
  "lastUpdated" timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Comment" (
  "id" text primary key default gen_random_uuid()::text,
  "postId" text not null,
  "author" text not null,
  "avatar" text,
  "body" text not null,
  "createdAt" timestamptz not null default now()
);

create index if not exists "Comment_postId_idx" on public."Comment"("postId");

create table if not exists public."CommunityPost" (
  "id" text primary key default gen_random_uuid()::text,
  "author" text not null,
  "avatar" text,
  "title" text not null,
  "body" text not null,
  "category" text not null default 'Discussion',
  "city" text,
  "likes" integer not null default 0,
  "comments" integer not null default 0,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Contact" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "email" text not null,
  "subject" text not null,
  "message" text not null,
  "createdAt" timestamptz not null default now()
);

create table if not exists public."Event" (
  "id" text primary key default gen_random_uuid()::text,
  "title" text not null,
  "type" text not null,
  "date" text not null,
  "time" text not null,
  "venue" text not null,
  "city" text not null,
  "description" text not null,
  "capacity" integer not null default 50,
  "registered" integer not null default 0,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."FeatureToggle" (
  "id" text primary key default gen_random_uuid()::text,
  "feature" text not null,
  "enabled" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create unique index if not exists "FeatureToggle_feature_key" on public."FeatureToggle"("feature");

create table if not exists public."Gallery" (
  "id" text primary key default gen_random_uuid()::text,
  "title" text not null,
  "cat" text,
  "owner" text not null,
  "city" text not null,
  "image" text not null,
  "likes" integer not null default 0,
  "caption" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."LostFound" (
  "id" text primary key default gen_random_uuid()::text,
  "type" text not null,
  "catName" text,
  "breed" text,
  "color" text,
  "location" text not null,
  "city" text not null,
  "date" text not null,
  "contact" text not null,
  "phone" text not null,
  "description" text not null,
  "reward" text,
  "image" text,
  "status" text not null default 'Active',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Member" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "email" text not null,
  "phone" text,
  "city" text not null,
  "plan" text not null default 'Free',
  "cats" integer not null default 0,
  "joinedAt" timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."Newsletter" (
  "id" text primary key default gen_random_uuid()::text,
  "email" text not null,
  "createdAt" timestamptz not null default now()
);

create unique index if not exists "Newsletter_email_key" on public."Newsletter"("email");

create table if not exists public."ServiceProvider" (
  "id" text primary key default gen_random_uuid()::text,
  "providerName" text not null,
  "businessName" text,
  "type" text not null,
  "image" text,
  "address" text not null,
  "division" text not null,
  "district" text not null,
  "area" text not null,
  "phone" text not null,
  "whatsapp" text,
  "facebook" text,
  "website" text,
  "mapUrl" text,
  "openingHours" text,
  "homeService" boolean not null default false,
  "description" text,
  "verified" text not null default 'Not Verified',
  "rating" double precision not null default 0,
  "reviewCount" integer not null default 0,
  "lastUpdated" timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."SiteContent" (
  "id" text primary key default gen_random_uuid()::text,
  "section" text not null,
  "eyebrow" text,
  "title" text,
  "titleAccent" text,
  "titleEnd" text,
  "description" text,
  "buttonText" text,
  "buttonLink" text,
  "buttonText2" text,
  "buttonLink2" text,
  "image" text,
  "updatedAt" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

create unique index if not exists "SiteContent_section_key" on public."SiteContent"("section");

create table if not exists public."Testimonial" (
  "id" text primary key default gen_random_uuid()::text,
  "name" text not null,
  "role" text not null,
  "city" text not null,
  "avatar" text,
  "rating" integer not null default 5,
  "quote" text not null,
  "catName" text,
  "featured" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public."VeterinaryClinic" (
  "id" text primary key default gen_random_uuid()::text,
  "clinicName" text not null,
  "doctorName" text,
  "specialization" text,
  "address" text not null,
  "division" text not null,
  "district" text not null,
  "area" text not null,
  "phone" text not null,
  "emergencyPhone" text,
  "whatsapp" text,
  "openingHours" text,
  "emergencyService" boolean not null default false,
  "mapUrl" text,
  "website" text,
  "facebook" text,
  "services" text,
  "description" text,
  "verified" text not null default 'Not Verified',
  "rating" double precision not null default 0,
  "reviewCount" integer not null default 0,
  "lastUpdated" timestamptz not null default now(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "clinicImage" text
);


-- auto-update "updatedAt" on every UPDATE
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new."updatedAt" = now(); return new; end $$;

drop trigger if exists trg_Article_updated on public."Article";
create trigger trg_Article_updated before update on public."Article" for each row execute function public.set_updated_at();
drop trigger if exists trg_Breed_updated on public."Breed";
create trigger trg_Breed_updated before update on public."Breed" for each row execute function public.set_updated_at();
drop trigger if exists trg_CareTip_updated on public."CareTip";
create trigger trg_CareTip_updated before update on public."CareTip" for each row execute function public.set_updated_at();
drop trigger if exists trg_CatFoodShop_updated on public."CatFoodShop";
create trigger trg_CatFoodShop_updated before update on public."CatFoodShop" for each row execute function public.set_updated_at();
drop trigger if exists trg_CatShop_updated on public."CatShop";
create trigger trg_CatShop_updated before update on public."CatShop" for each row execute function public.set_updated_at();
drop trigger if exists trg_CommunityPost_updated on public."CommunityPost";
create trigger trg_CommunityPost_updated before update on public."CommunityPost" for each row execute function public.set_updated_at();
drop trigger if exists trg_Event_updated on public."Event";
create trigger trg_Event_updated before update on public."Event" for each row execute function public.set_updated_at();
drop trigger if exists trg_FeatureToggle_updated on public."FeatureToggle";
create trigger trg_FeatureToggle_updated before update on public."FeatureToggle" for each row execute function public.set_updated_at();
drop trigger if exists trg_Gallery_updated on public."Gallery";
create trigger trg_Gallery_updated before update on public."Gallery" for each row execute function public.set_updated_at();
drop trigger if exists trg_LostFound_updated on public."LostFound";
create trigger trg_LostFound_updated before update on public."LostFound" for each row execute function public.set_updated_at();
drop trigger if exists trg_Member_updated on public."Member";
create trigger trg_Member_updated before update on public."Member" for each row execute function public.set_updated_at();
drop trigger if exists trg_ServiceProvider_updated on public."ServiceProvider";
create trigger trg_ServiceProvider_updated before update on public."ServiceProvider" for each row execute function public.set_updated_at();
drop trigger if exists trg_SiteContent_updated on public."SiteContent";
create trigger trg_SiteContent_updated before update on public."SiteContent" for each row execute function public.set_updated_at();
drop trigger if exists trg_Testimonial_updated on public."Testimonial";
create trigger trg_Testimonial_updated before update on public."Testimonial" for each row execute function public.set_updated_at();
drop trigger if exists trg_VeterinaryClinic_updated on public."VeterinaryClinic";
create trigger trg_VeterinaryClinic_updated before update on public."VeterinaryClinic" for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Admins: Supabase Auth users listed in admin_users (see make-admin.sql).
-- Passwords are stored (hashed) by Supabase Auth, never in your tables.
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null default 'Admin',
  role text not null default 'admin',
  "createdAt" timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid())
$$;

-- The login page uses this to decide between "login" and "first-time setup" mode.
create or replace function public.admin_count() returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from public.admin_users
$$;

-- Public counters for the website's stats section (works for visitors,
-- without exposing the private tables).
create or replace function public.public_stats() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'breeds', (select count(*) from public."Breed"),
    'catShops', (select count(*) from public."CatShop"),
    'catFoodShops', (select count(*) from public."CatFoodShop"),
    'vetClinics', (select count(*) from public."VeterinaryClinic"),
    'serviceProviders', (select count(*) from public."ServiceProvider"),
    'articles', (select count(*) from public."Article"),
    'communityPosts', (select count(*) from public."CommunityPost"),
    'events', (select count(*) from public."Event"),
    'gallery', (select count(*) from public."Gallery"),
    'members', (select count(*) from public."Member"),
    'testimonials', (select count(*) from public."Testimonial"),
    'lostFound', (select count(*) from public."LostFound")
  )
$$;

-- Comment counter on community posts (visitors can't UPDATE posts directly)
create or replace function public.bump_comment_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public."CommunityPost" set comments = comments + 1 where id = new."postId";
  return new;
end $$;
drop trigger if exists trg_comment_bump on public."Comment";
create trigger trg_comment_bump after insert on public."Comment" for each row execute function public.bump_comment_count();

-- ---------------------------------------------------------------------
-- Row Level Security: visitors can read public content and submit forms;
-- only admins can edit or delete anything.
-- ---------------------------------------------------------------------
alter table public.admin_users enable row level security;
drop policy if exists "admin_users read self" on public.admin_users;
create policy "admin_users read self" on public.admin_users for select to authenticated using (id = auth.uid());

alter table public."Article" enable row level security;
drop policy if exists "Article admin all" on public."Article";
create policy "Article admin all" on public."Article" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Article public read" on public."Article";
create policy "Article public read" on public."Article" for select to anon, authenticated using (true);
alter table public."Breed" enable row level security;
drop policy if exists "Breed admin all" on public."Breed";
create policy "Breed admin all" on public."Breed" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Breed public read" on public."Breed";
create policy "Breed public read" on public."Breed" for select to anon, authenticated using (true);
alter table public."CareTip" enable row level security;
drop policy if exists "CareTip admin all" on public."CareTip";
create policy "CareTip admin all" on public."CareTip" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "CareTip public read" on public."CareTip";
create policy "CareTip public read" on public."CareTip" for select to anon, authenticated using (true);
alter table public."CatFoodShop" enable row level security;
drop policy if exists "CatFoodShop admin all" on public."CatFoodShop";
create policy "CatFoodShop admin all" on public."CatFoodShop" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "CatFoodShop public read" on public."CatFoodShop";
create policy "CatFoodShop public read" on public."CatFoodShop" for select to anon, authenticated using (true);
alter table public."CatShop" enable row level security;
drop policy if exists "CatShop admin all" on public."CatShop";
create policy "CatShop admin all" on public."CatShop" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "CatShop public read" on public."CatShop";
create policy "CatShop public read" on public."CatShop" for select to anon, authenticated using (true);
alter table public."Comment" enable row level security;
drop policy if exists "Comment admin all" on public."Comment";
create policy "Comment admin all" on public."Comment" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Comment public read" on public."Comment";
create policy "Comment public read" on public."Comment" for select to anon, authenticated using (true);
alter table public."CommunityPost" enable row level security;
drop policy if exists "CommunityPost admin all" on public."CommunityPost";
create policy "CommunityPost admin all" on public."CommunityPost" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "CommunityPost public read" on public."CommunityPost";
create policy "CommunityPost public read" on public."CommunityPost" for select to anon, authenticated using (true);
alter table public."Contact" enable row level security;
drop policy if exists "Contact admin all" on public."Contact";
create policy "Contact admin all" on public."Contact" for all to authenticated using (public.is_admin()) with check (public.is_admin());
alter table public."Event" enable row level security;
drop policy if exists "Event admin all" on public."Event";
create policy "Event admin all" on public."Event" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Event public read" on public."Event";
create policy "Event public read" on public."Event" for select to anon, authenticated using (true);
alter table public."FeatureToggle" enable row level security;
drop policy if exists "FeatureToggle admin all" on public."FeatureToggle";
create policy "FeatureToggle admin all" on public."FeatureToggle" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "FeatureToggle public read" on public."FeatureToggle";
create policy "FeatureToggle public read" on public."FeatureToggle" for select to anon, authenticated using (true);
alter table public."Gallery" enable row level security;
drop policy if exists "Gallery admin all" on public."Gallery";
create policy "Gallery admin all" on public."Gallery" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Gallery public read" on public."Gallery";
create policy "Gallery public read" on public."Gallery" for select to anon, authenticated using (true);
alter table public."LostFound" enable row level security;
drop policy if exists "LostFound admin all" on public."LostFound";
create policy "LostFound admin all" on public."LostFound" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "LostFound public read" on public."LostFound";
create policy "LostFound public read" on public."LostFound" for select to anon, authenticated using (true);
alter table public."Member" enable row level security;
drop policy if exists "Member admin all" on public."Member";
create policy "Member admin all" on public."Member" for all to authenticated using (public.is_admin()) with check (public.is_admin());
alter table public."Newsletter" enable row level security;
drop policy if exists "Newsletter admin all" on public."Newsletter";
create policy "Newsletter admin all" on public."Newsletter" for all to authenticated using (public.is_admin()) with check (public.is_admin());
alter table public."ServiceProvider" enable row level security;
drop policy if exists "ServiceProvider admin all" on public."ServiceProvider";
create policy "ServiceProvider admin all" on public."ServiceProvider" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "ServiceProvider public read" on public."ServiceProvider";
create policy "ServiceProvider public read" on public."ServiceProvider" for select to anon, authenticated using (true);
alter table public."SiteContent" enable row level security;
drop policy if exists "SiteContent admin all" on public."SiteContent";
create policy "SiteContent admin all" on public."SiteContent" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "SiteContent public read" on public."SiteContent";
create policy "SiteContent public read" on public."SiteContent" for select to anon, authenticated using (true);
alter table public."Testimonial" enable row level security;
drop policy if exists "Testimonial admin all" on public."Testimonial";
create policy "Testimonial admin all" on public."Testimonial" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Testimonial public read" on public."Testimonial";
create policy "Testimonial public read" on public."Testimonial" for select to anon, authenticated using (true);
alter table public."VeterinaryClinic" enable row level security;
drop policy if exists "VeterinaryClinic admin all" on public."VeterinaryClinic";
create policy "VeterinaryClinic admin all" on public."VeterinaryClinic" for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "VeterinaryClinic public read" on public."VeterinaryClinic";
create policy "VeterinaryClinic public read" on public."VeterinaryClinic" for select to anon, authenticated using (true);

-- Visitor submissions (with basic anti-abuse limits)
drop policy if exists "CommunityPost public insert" on public."CommunityPost";
create policy "CommunityPost public insert" on public."CommunityPost" for insert to anon, authenticated
  with check (likes = 0 and comments = 0 and char_length(title) <= 300 and char_length(body) <= 5000);

drop policy if exists "LostFound public insert" on public."LostFound";
create policy "LostFound public insert" on public."LostFound" for insert to anon, authenticated
  with check (status = 'Active' and char_length(description) <= 3000);

drop policy if exists "Comment public insert" on public."Comment";
create policy "Comment public insert" on public."Comment" for insert to anon, authenticated
  with check (char_length(body) <= 2000 and char_length(author) <= 100);

drop policy if exists "Member public insert" on public."Member";
create policy "Member public insert" on public."Member" for insert to anon, authenticated
  with check (plan in ('Free','Silver','Gold') and char_length(name) <= 200 and char_length(email) <= 320);

drop policy if exists "Newsletter public insert" on public."Newsletter";
create policy "Newsletter public insert" on public."Newsletter" for insert to anon, authenticated
  with check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and char_length(email) <= 320);

drop policy if exists "Contact public insert" on public."Contact";
create policy "Contact public insert" on public."Contact" for insert to anon, authenticated
  with check (char_length(message) <= 5000 and char_length(name) <= 200 and char_length(email) <= 320);

-- Function permissions
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_count() to anon, authenticated;
grant execute on function public.public_stats() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Image uploads (admin panel): public bucket, only admins can write
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uploads', 'uploads', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

drop policy if exists "uploads admin insert" on storage.objects;
create policy "uploads admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'uploads' and public.is_admin());
drop policy if exists "uploads admin update" on storage.objects;
create policy "uploads admin update" on storage.objects for update to authenticated
  using (bucket_id = 'uploads' and public.is_admin());
drop policy if exists "uploads admin delete" on storage.objects;
create policy "uploads admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'uploads' and public.is_admin());

