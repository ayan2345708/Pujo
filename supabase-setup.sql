-- =====================================================================
--  চট্টলার পুজো — community photos  |  Supabase one-time setup
--  Supabase dashboard → SQL Editor → New query → paste ALL of this → Run
-- =====================================================================

-- 1) the table that holds every submitted photo's details --------------
create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  caption     text not null check (char_length(caption)  between 1 and 300),
  location    text not null check (char_length(location) between 1 and 80),
  credit      text not null check (char_length(credit)   between 1 and 60),   -- photographer's name, shown as "© name"
  image_path  text not null check (image_path ~ '^[A-Za-z0-9_./-]+$'),
  width       int,
  height      int,
  status      text not null default 'pending' check (status in ('pending','approved','rejected'))
);
-- NOTE: email / social links are deliberately NOT stored here. They only
-- reach you through the FormSubmit email, so they can never leak publicly.

alter table public.photos enable row level security;

-- visitors may ONLY read photos you approved
drop policy if exists "public reads approved" on public.photos;
create policy "public reads approved" on public.photos
  for select to anon, authenticated
  using (status = 'approved');

-- visitors may add a photo, but only as "pending" (they can never approve their own)
drop policy if exists "public submits pending" on public.photos;
create policy "public submits pending" on public.photos
  for insert to anon, authenticated
  with check (status = 'pending');

-- 2) the storage bucket for the image files ----------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "public uploads photos" on storage.objects;
create policy "public uploads photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'photos');

-- =====================================================================
--  HOW YOU APPROVE A PHOTO
--  Dashboard → Table Editor → photos → open the row → change
--  status from  pending  to  approved   (use  rejected  to hide it).
--  It appears on the website within seconds, for everybody, permanently.
--
--  Want photos to show INSTANTLY without approval? (not recommended —
--  anyone can then publish anything on your site.) Run instead:
--    alter table public.photos alter column status set default 'approved';
--    drop policy "public submits pending" on public.photos;
--    create policy "public submits" on public.photos for insert to anon, authenticated
--      with check (status = 'approved');
-- =====================================================================
