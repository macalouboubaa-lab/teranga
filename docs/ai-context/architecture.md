# Architecture du projet

## Stack

- Next.js 16.2.4 App Router, TypeScript et React 19.
- Tailwind CSS 4, Supabase Auth/PostgreSQL.
- Mapbox GL et `react-map-gl`.
- ESLint 9 et déploiement Vercel.

## Structure et flux

- `app/` : routes, layout, authentification, client et chauffeur.
- `app/components/` : composants dont `AuthGate` et `Navbar`.
- `lib/` : client Supabase, types et tarification.
- `migrations/` : schéma SQL ; `scripts/` : vérification Supabase.

Supabase Auth gère les sessions et `AuthGate` protège les pages. Tables, politiques RLS et flux livraison : **[À REMPLIR]**.

Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`. Ne jamais commiter `.env.local`.
