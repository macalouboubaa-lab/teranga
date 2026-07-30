create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  phone text,
  full_name text,
  role text not null default 'client',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references public.users(id) on delete cascade,
  driver_id uuid references public.users(id) on delete set null,
  status text not null default 'requested',
  pickup_address text,
  dropoff_address text,
  distance_km numeric,
  price_cfa integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.users enable row level security;
alter table public.rides enable row level security;

create policy if not exists "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy if not exists "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

create policy if not exists "Users can update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists "Users can create rides" on public.rides
  for insert with check (auth.uid() = rider_id);

create policy if not exists "Users can view related rides" on public.rides
  for select using (auth.uid() = rider_id or auth.uid() = driver_id);

create policy if not exists "Drivers can update accepted rides" on public.rides
  for update using (auth.uid() = driver_id or auth.uid() = rider_id)
  with check (auth.uid() = driver_id or auth.uid() = rider_id);
