-- ============================================================
-- 003_service_orders_and_invoices.sql
-- Run this in Supabase SQL Editor to create tables for orders & invoices
-- ============================================================

-- service_orders
create table if not exists public.service_orders (
  id                uuid primary key default uuid_generate_v4(),
  company_name      text not null,
  billing_address   text not null,
  email             text not null,
  package           text not null,
  package_fee       text,
  target_date       text,
  scope_notes       text,
  terms_accepted    boolean not null default false,
  status            text not null default 'pending' check (status in ('pending', 'invoiced', 'paid', 'completed', 'cancelled')),
  created_at        timestamptz not null default now()
);

-- invoices
create table if not exists public.invoices (
  id                uuid primary key default uuid_generate_v4(),
  invoice_number    text unique not null,
  invoice_date      date not null default current_date,
  service_date      text not null,
  client_name       text not null,
  client_company    text,
  client_address    text not null,
  client_tax_id     text,
  client_email      text,
  line_items        jsonb not null default '[]'::jsonb,
  total_amount      numeric(10, 2) not null,
  revolut_link      text,
  bank_holder       text,
  bank_iban         text,
  bank_bic          text,
  notes             text,
  status            text not null default 'issued' check (status in ('draft', 'issued', 'paid', 'cancelled')),
  created_at        timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.service_orders enable row level security;
alter table public.invoices enable row level security;

-- Public can submit service_orders
create policy "Allow anonymous service_orders insert"
  on public.service_orders for insert
  with check (true);

-- Admins can view and manage service_orders
create policy "Admins can view and manage service_orders"
  on public.service_orders for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Admins can view and manage invoices
create policy "Admins can view and manage invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
