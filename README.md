# TERANGA

Application VTC et livraison pensée pour le Sénégal, avec une interface moderne et une intégration Supabase.

## Prérequis

- Node.js 20+
- npm
- un projet Supabase avec les variables d’environnement suivantes :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Installation

```bash
npm install
cp .env.example .env.local
```

Puis renseigner les variables dans [.env.local](.env.local).

## Développement

```bash
npm run dev
```

## Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel.
2. Ajouter les variables d’environnement dans les settings Vercel.
3. Déployer la branche principale.

## Variables attendues

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
