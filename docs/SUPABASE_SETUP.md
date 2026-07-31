# Configuration Supabase pour Teranga

Étapes pour vérifier et appliquer le schéma Supabase, et configurer les variables d'environnement.

1) Appliquer le schéma
- Ouvrez votre projet Supabase → SQL Editor
- Collez le contenu de `migrations/ensure_supabase_schema.sql` et exécutez-le.

2) Obtenir la clé publique (anon)
- Dans Supabase → Settings → API → Project API keys → copiez `anon` (Publishable key).

3) Vérifier localement
- Exécutez :

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://mcistfdbrlbbkzjvsreb.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key"
npm run verify:supabase
```

4) Configurer Vercel
- Dans les Settings du projet Vercel → Environment Variables, ajoutez :
  - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = clé anon
- Redeployez le projet.

5) Si des erreurs persistent
- Copiez la sortie de `npm run verify:supabase` et partagez-la.
- Si vous souhaitez que l'assistant applique automatiquement le SQL, fournissez une clé `service_role` sécurisée (à ne jamais commiter) ou laissez-moi vous guider pour l'exécuter via l'éditeur SQL.
