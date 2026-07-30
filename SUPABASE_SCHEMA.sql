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
