#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('Erreur: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant.');
  console.error('Exportez-les puis relancez:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node ./scripts/verifySupabase.mjs');
  process.exit(2);
}

const supabase = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });

function hintFromMessage(message) {
  if (!message) return null;
  if (message.includes('does not exist') || message.includes('relation')) {
    return "La table n'existe pas. Exécutez SUPABASE_SCHEMA.sql depuis l'éditeur SQL du projet Supabase.";
  }
  if (message.includes('row-level security') || message.includes('policy')) {
    return "Les politiques RLS bloquent l'opération. Vérifiez et ajustez les policies sur public.users et public.rides.";
  }
  if (message.includes('JWT') || message.includes('token')) {
    return "Problème de jeton. Assurez-vous d'utiliser la clé publique (anon) et que l'auth est valide.";
  }
  return null;
}

async function checkTable(name) {
  try {
    const { data, error } = await supabase.from(name).select('id').limit(1);
    if (error) {
      console.error(`${name}: ERREUR -> ${error.message}`);
      const hint = hintFromMessage(error.message);
      if (hint) console.error(`  Conseil: ${hint}`);
      return { ok: false, error: error.message, hint };
    }
    console.log(`${name}: OK (ligne(s) retournée(s): ${Array.isArray(data) ? data.length : 0})`);
    return { ok: true, count: data?.length ?? 0 };
  } catch (e) {
    console.error(`${name}: Exception -> ${String(e)}`);
    return { ok: false, error: String(e) };
  }
}

(async () => {
  console.log('Vérification Supabase en cours...');
  const users = await checkTable('users');
  const rides = await checkTable('rides');
  if (users.ok && rides.ok) {
    console.log('Vérification terminée: schéma accessible et permissions OK pour les opérations de lecture.');
    process.exit(0);
  } else {
    console.error('Vérification terminée: problèmes détectés. Voir les messages ci-dessus.');
    process.exit(1);
  }
})();
