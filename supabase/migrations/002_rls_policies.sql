-- ============================================================
-- Happy Hub — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles        enable row level security;
alter table public.blog_posts      enable row level security;
alter table public.talks           enable row level security;
alter table public.comments        enable row level security;
alter table public.reactions       enable row level security;
alter table public.contact_messages enable row level security;

-- ============================================================
-- profiles
-- ============================================================
-- Anyone can read profiles
create policy "profiles_public_read" on public.profiles
  for select using (true);

-- Users can update their own profile
create policy "profiles_own_update" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================
-- blog_posts
-- ============================================================
-- Public can read published posts
create policy "posts_public_read" on public.blog_posts
  for select using (is_published = true);

-- Admins can do everything
create policy "posts_admin_all" on public.blog_posts
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- talks
-- ============================================================
create policy "talks_public_read" on public.talks
  for select using (is_published = true);

create policy "talks_admin_all" on public.talks
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- comments
-- ============================================================
-- Anyone can read comments
create policy "comments_public_read" on public.comments
  for select using (true);

-- Authenticated users can insert
create policy "comments_auth_insert" on public.comments
  for insert with check (auth.uid() = author_id);

-- Users can delete their own comments; admins can delete any
create policy "comments_own_delete" on public.comments
  for delete using (
    auth.uid() = author_id or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- reactions
-- ============================================================
create policy "reactions_public_read" on public.reactions
  for select using (true);

create policy "reactions_auth_insert" on public.reactions
  for insert with check (auth.uid() = author_id);

create policy "reactions_own_delete" on public.reactions
  for delete using (auth.uid() = author_id);

-- ============================================================
-- contact_messages
-- ============================================================
-- Anyone can submit (insert)
create policy "contacts_public_insert" on public.contact_messages
  for insert with check (true);

-- Only admins can read/update
create policy "contacts_admin_read" on public.contact_messages
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "contacts_admin_update" on public.contact_messages
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
