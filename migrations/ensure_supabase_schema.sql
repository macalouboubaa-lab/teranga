-- Migration: Ensure required tables, RLS and policies for Teranga
-- Instructions:
-- 1) Ouvrez votre projet Supabase > SQL Editor
-- 2) Collez le contenu de ce fichier et exécutez-le
-- 3) Ensuite exécutez localement: 
--    NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npm run verify:supabase

--commentaire_admin: @KAGEBOT j'ai modifié le script le premier ne correspondait pas a supabase
-- inspire tant pour la prochaine fois
--- 1. EXTENSIONS
create extension if not exists pgcrypto;
-- 1. Supprime l'ancienne table rides et ses dépendances
drop table if exists public.rides cascade;
-- 2. TABLES
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

-- 3. ACTIVATION RLS
alter table public.users enable row level security;
alter table public.rides enable row level security;

-- 4. POLITIQUES RLS - USERS
drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 5. POLITIQUES RLS - RIDES
drop policy if exists "Users can create rides" on public.rides;
create policy "Users can create rides" on public.rides
  for insert with check (auth.uid() = rider_id);

drop policy if exists "Users can view related rides" on public.rides;
create policy "Users can view related rides" on public.rides
  for select using (auth.uid() = rider_id or auth.uid() = driver_id);

drop policy if exists "Drivers can update accepted rides" on public.rides;
create policy "Drivers can update accepted rides" on public.rides
  for update using (auth.uid() = driver_id or auth.uid() = rider_id)
  with check (auth.uid() = driver_id or auth.uid() = rider_id);