# Agent: KAGEBOT
# AGENTS.md - Instructions pour les agents IA

Ce fichier contient les instructions pour les agents IA qui travaillent sur le projet **TERANGA**.

## ðŸ“‹ Vue d'ensemble du projet

**TERANGA** est une application de VTC et de livraison pour le SÃ©nÃ©gal, construite avec :
- **Framework** : Next.js 16.2.4 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Authentification** : Supabase Auth
- **Base de donnÃ©es** : Supabase PostgreSQL
- **Cartographie** : Mapbox GL
- **DÃ©ploiement** : Vercel

---

## ðŸ—‚ï¸ Structure du projet (Ã  jour)

Voici l'organisation des dossiers pour que vous sachiez oÃ¹ trouver et oÃ¹ ajouter du code :
 
app/
â”œâ”€â”€ (auth)/ # Dossier pour l'authentification
â”‚ â”œâ”€â”€ login/
â”‚ â”‚ â””â”€â”€ page.tsx # Page de connexion
â”‚ â””â”€â”€ register/
â”‚ â””â”€â”€ page.tsx # Page d'inscription
â”œâ”€â”€ client/
â”‚ â””â”€â”€ home/
â”‚ â””â”€â”€ page.tsx # Page d'accueil client (avec la carte)
â”œâ”€â”€ components/ # Composants rÃ©utilisables
â”‚ â”œâ”€â”€ Navbar.tsx # Menu de navigation fixe
â”‚ â””â”€â”€ MapWithRoute.tsx# Carte interactive Mapbox
â”œâ”€â”€ driver/
â”‚ â””â”€â”€ home/
â”‚ â””â”€â”€ page.tsx # Page d'accueil chauffeur
â”œâ”€â”€ lib/
â”‚ â””â”€â”€ supabaseClient.ts # Client Supabase
â”œâ”€â”€ layout.tsx # Layout principal (intÃ¨gre le Navbar)
â”œâ”€â”€ page.tsx # Page d'accueil (redirige vers login)
â””â”€â”€ globals.css # Styles globaux Tailwind
 

---

## ðŸŽ¯ **Conventions de code**

### 1. Composants
- Utiliser **"use client"** pour les composants interactifs (ceux qui utilisent des hooks ou du state).
- Exporter par dÃ©faut (`export default function`).
- Nommer les fichiers en `PascalCase` (ex: `MapWithRoute.tsx`).

### 2. Styles
- Utiliser **Tailwind CSS** pour le styling.
- Classes de base : `flex`, `gap`, `p-`, `bg-`, `text-`.
- Design system : vert (`green-600`, `green-700`) comme couleur principale.

### 3. Authentification
- Utiliser **Supabase Auth** pour l'authentification.
- VÃ©rifier la session avec `supabase.auth.getSession()`.
- Rediriger vers `/client/home` si connectÃ©, `/auth/login` sinon.

### 4. Base de donnÃ©es
- Utiliser **Supabase** avec le client `@/lib/supabaseClient`.
- RequÃªtes typÃ©es avec TypeScript.

### 5. Variables d'environnement
- **Ne JAMAIS commiter** `.env.local`.
- Utiliser `process.env.NEXT_PUBLIC_*` pour les variables exposÃ©es.
- Variables requises :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## ðŸš¨ **RÃ¨gles importantes**

### âŒ Ã€ NE PAS FAIRE
1. **Ne pas commiter** de secrets (tokens, clÃ©s API) dans le code.
2. **Ne pas modifier** directement la branche `main` sans PR (utiliser des branches `feature/`).
3. **Ne pas utiliser** `any` dans TypeScript (utiliser des types prÃ©cis).
4. **Ne pas ignorer** les erreurs de linting.

### âœ… Ã€ FAIRE
1. **Tester** localement avant de pousser (`npm run build`).
2. **Documenter** les nouvelles fonctionnalitÃ©s.
3. **Utiliser** des composants rÃ©utilisables.
4. **Suivre** le design system existant.

---

## ðŸ”§ **Commandes utiles**

```bash
# DÃ©veloppement
npm run dev          # DÃ©marrer le serveur de dÃ©veloppement
npm run build        # Build pour production
npm run lint         # VÃ©rifier le code
npm run start        # DÃ©marrer en production

# Git
git add .            # Ajouter les fichiers
git commit -m "msg"  # Commiter
git push origin main # Pousser sur main

## Contexte Vibe Coding obligatoire

Avant toute génération de code, lire et respecter :
- `docs/ai-context/prd.md`
- `docs/ai-context/architecture.md`
- `docs/ai-context/règles.md`
- `docs/ai-context/design.md`
- `docs/ai-context/tasks.md`
- `docs/ai-context/memory.md`

### Comportement attendu
1. Toujours charger ce contexte avant de répondre.
2. Respecter les règles de codage définies dans `règles.md`.
3. Mettre à jour `tasks.md` et `memory.md` après chaque session importante.
4. Ne jamais introduire de dépendance sans vérifier `architecture.md`.
5. Signaler tout conflit entre la demande et les fichiers de contexte.
