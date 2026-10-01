-- =====================================================================
-- OPTIONAL — only if you ran an OLDER schema.sql before and now get errors
-- like: column "clinicImage" of relation "VeterinaryClinic" does not exist
--
-- WARNING: this DELETES all BiralBond tables and their data in the public
-- schema (also admin_users). Your Supabase login users (Authentication >
-- Users) and uploaded images are NOT touched.
--
-- Order:  reset.sql  ->  schema.sql  ->  seed.sql  ->  make-admin.sql
-- =====================================================================

-- 1) drop every table in the public schema
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop table if exists public.%I cascade', r.tablename);
  end loop;
end $$;

-- 2) drop the helper functions (cascade also removes the image-upload policies that use them)
drop function if exists public.is_admin() cascade;
drop function if exists public.admin_count() cascade;
drop function if exists public.public_stats() cascade;
drop function if exists public.ensure_admin(text) cascade;
drop function if exists public.bump_comment_count() cascade;
drop function if exists public.set_updated_at() cascade;
