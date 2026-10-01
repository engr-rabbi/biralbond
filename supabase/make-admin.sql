-- Run this AFTER you created your admin user in Supabase
-- (Authentication > Users > Add user, tick "Auto Confirm User").
-- Replace the email and name below, then press Run.
-- Only users listed in admin_users can edit/delete website data.
insert into public.admin_users (id, email, name, role)
select id, email, 'Tusher', 'superadmin' from auth.users where email = 'tusher.ce@gmail.com'
on conflict (id) do nothing;

-- Check: this must return exactly 1 row.
select * from public.admin_users;
