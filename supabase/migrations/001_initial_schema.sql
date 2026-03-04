-- ============================================================
-- Happy Hub — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique,
  display_name text,
  avatar_url   text,
  bio          text,
  role         text not null default 'member' check (role in ('admin', 'member')),
  created_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- blog_posts
-- ============================================================
create table public.blog_posts (
  id                 uuid primary key default uuid_generate_v4(),
  slug               text unique not null,
  title              text not null,
  excerpt            text,
  content            text,
  cover_image_url    text,
  tags               text[] default '{}',
  is_published       boolean not null default false,
  published_at       timestamptz,
  read_time_minutes  int,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- talks
-- ============================================================
create table public.talks (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  event_name       text,
  event_date       date,
  location         text,
  talk_url         text,
  video_embed_url  text,
  description      text,
  is_published     boolean not null default false,
  created_at       timestamptz not null default now()
);

-- Seed talks from MkDocs home page
insert into public.talks (title, event_name, event_date, location, talk_url, video_embed_url, description, is_published) values
(
  'Android Accessibility: Complexity, Challenges, and Solutions',
  'GDG Berlin Android',
  '2024-09-01',
  'Berlin, Germany',
  'https://youtu.be/av673I4GsLA?si=1jkYCuyEUowyFNnP',
  'https://www.youtube.com/embed/av673I4GsLA',
  'A deep dive into the complexities and real-world challenges of Android accessibility, with practical solutions for engineers.',
  true
),
(
  'AI for Accessibility: The Challenge and The Promise',
  'GDG Berlin Android',
  '2025-08-01',
  'Berlin, Germany',
  'https://youtu.be/_4Flq6hnx8E?si=j-PE5htgtsRO0cw9',
  'https://www.youtube.com/embed/_4Flq6hnx8E',
  'Exploring how AI can be leveraged ethically and effectively to create more inclusive digital experiences.',
  true
);

-- ============================================================
-- comments
-- ============================================================
create table public.comments (
  id                uuid primary key default uuid_generate_v4(),
  post_id           uuid not null references public.blog_posts(id) on delete cascade,
  author_id         uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.comments(id) on delete cascade,
  content           text not null,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- reactions
-- ============================================================
create table public.reactions (
  id        uuid primary key default uuid_generate_v4(),
  post_id   uuid not null references public.blog_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  type      text not null check (type in ('heart', 'insightful', 'clap')),
  created_at timestamptz not null default now(),
  unique (post_id, author_id, type)
);

-- ============================================================
-- contact_messages
-- ============================================================
create table public.contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
