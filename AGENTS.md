# Agent: KAGEBOT
# AGENTS.md - Instructions pour les agents IA

Ce fichier contient les instructions pour les agents IA qui travaillent sur le projet **TERANGA**.

## 📋 Vue d'ensemble du projet

**TERANGA** est une application de VTC et de livraison pour le Sénégal, construite avec :
- **Framework** : Next.js 16.2.4 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Authentification** : Supabase Auth
- **Base de données** : Supabase PostgreSQL
- **Cartographie** : Mapbox GL
- **Déploiement** : Vercel

---

## 🗂️ Structure du projet (à jour)

Voici l'organisation des dossiers pour que vous sachiez où trouver et où ajouter du code :
 
app/
├── (auth)/ # Dossier pour l'authentification
│ ├── login/
│ │ └── page.tsx # Page de connexion
│ └── register/
│ └── page.tsx # Page d'inscription
├── client/
│ └── home/
│ └── page.tsx # Page d'accueil client (avec la carte)
├── components/ # Composants réutilisables
│ ├── Navbar.tsx # Menu de navigation fixe
│ └── MapWithRoute.tsx# Carte interactive Mapbox
├── driver/
│ └── home/
│ └── page.tsx # Page d'accueil chauffeur
├── lib/
│ └── supabaseClient.ts # Client Supabase
├── layout.tsx # Layout principal (intègre le Navbar)
├── page.tsx # Page d'accueil (redirige vers login)
└── globals.css # Styles globaux Tailwind
 

---

## 🎯 **Conventions de code**

### 1. Composants
- Utiliser **"use client"** pour les composants interactifs (ceux qui utilisent des hooks ou du state).
- Exporter par défaut (`export default function`).
- Nommer les fichiers en `PascalCase` (ex: `MapWithRoute.tsx`).

### 2. Styles
- Utiliser **Tailwind CSS** pour le styling.
- Classes de base : `flex`, `gap`, `p-`, `bg-`, `text-`.
- Design system : vert (`green-600`, `green-700`) comme couleur principale.

### 3. Authentification
- Utiliser **Supabase Auth** pour l'authentification.
- Vérifier la session avec `supabase.auth.getSession()`.
- Rediriger vers `/client/home` si connecté, `/auth/login` sinon.

### 4. Base de données
- Utiliser **Supabase** avec le client `@/lib/supabaseClient`.
- Requêtes typées avec TypeScript.

### 5. Variables d'environnement
- **Ne JAMAIS commiter** `.env.local`.
- Utiliser `process.env.NEXT_PUBLIC_*` pour les variables exposées.
- Variables requises :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## 🚨 **Règles importantes**

### ❌ À NE PAS FAIRE
1. **Ne pas commiter** de secrets (tokens, clés API) dans le code.
2. **Ne pas modifier** directement la branche `main` sans PR (utiliser des branches `feature/`).
3. **Ne pas utiliser** `any` dans TypeScript (utiliser des types précis).
4. **Ne pas ignorer** les erreurs de linting.

### ✅ À FAIRE
1. **Tester** localement avant de pousser (`npm run build`).
2. **Documenter** les nouvelles fonctionnalités.
3. **Utiliser** des composants réutilisables.
4. **Suivre** le design system existant.

---

## 🔧 **Commandes utiles**

```bash
# Développement
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour production
npm run lint         # Vérifier le code
npm run start        # Démarrer en production

# Git
git add .            # Ajouter les fichiers
git commit -m "msg"  # Commiter
git push origin main # Pousser sur main