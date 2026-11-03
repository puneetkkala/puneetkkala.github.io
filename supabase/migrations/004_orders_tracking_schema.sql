-- ============================================================
-- 004_orders_tracking_schema.sql
-- Run this in Supabase SQL Editor to create the `orders` table
-- for consulting engagement & state tracking
-- ============================================================

create table if not exists public.orders (
  id                    uuid primary key default uuid_generate_v4(),
  created_at            timestamptz not null default now(),
  client_name           text not null,
  client_email          text not null,
  company_name          text,
  billing_address       text not null,
  track_type            text not null default 'track_b_fixed' check (track_type in ('track_a_advisory', 'track_b_fixed')),
  package_or_scope      text not null,
  total_amount_eur      numeric(10, 2),
  revolut_payment_link  text,
  status                text not null default 'inquiry_received' check (
    status in (
      'inquiry_received',
      'invoiced',
      'payment_settled',
      'in_progress',
      'review_handoff',
      'completed',
      'cancelled'
    )
  ),
  notes                 text
);

-- Index for ordering & status filtering
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

-- Enable Row Level Security
alter table public.orders enable row level security;

-- Public can submit order requests
create policy "Allow anonymous order request insert"
  on public.orders for insert
  with check (true);

-- Admins have full access to view, update, and manage orders
create policy "Admins can view and manage orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
