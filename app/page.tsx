// ============================================================
// app/page.tsx - Page d'accueil
// Cette page vérifie l'authentification et redirige
// ============================================================

// "use client" : Composant rendu côté client (nécessaire pour les hooks)
// Sans cela, les hooks (useEffect, useState) ne fonctionnent pas
"use client";

// Import des hooks React
import { useEffect, useState } from "react";
// useRouter : Hook Next.js pour la navigation programmatique
import { useRouter } from "next/navigation";
// Client Supabase pour interagir avec la base de données
import { supabase } from "@/lib/supabaseClient";

// ============================================================
// COMPOSANT PRINCIPAL - PAGE D'ACCUEIL
// ============================================================

export default function Home() {
  // ============================================================
  // ÉTAT DU COMPOSANT
  // ============================================================

  // router : Permet de naviguer vers d'autres pages
  // replace() : Remplace l'URL, pas de retour en arrière
  const router = useRouter();

  // status : Message de progression affiché à l'utilisateur
  const [status, setStatus] = useState("Initialisation...");

  // error : Message d'erreur (null = pas d'erreur)
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // EFFET SECONDAIRE - S'EXÉCUTE AU CHARGEMENT DE LA PAGE
  // ============================================================

  useEffect(() => {
    // Fonction asynchrone qui contient toute la logique
    async function test() {
      try {
        // -------------------------------------------------------
        // ÉTAPE 1 : Vérification de la session utilisateur
        // -------------------------------------------------------
        setStatus("Vérification de la session...");

        // getSession() : Récupère la session actuelle
        // Si l'utilisateur est connecté, session contient ses données
        const { data: { session } } = await supabase.auth.getSession();

        // Mise à jour du message de statut
        setStatus(`Session: ${session ? "Connecté" : "Non connecté"}`);

        // -------------------------------------------------------
        // ÉTAPE 2 : Si l'utilisateur est déjà connecté
        // -------------------------------------------------------
        if (session) {
          // Redirige vers la page client
          setStatus("Redirection vers /client/home...");
          router.replace("/client/home");
          return; // Sortie de la fonction
        }

        // -------------------------------------------------------
        // ÉTAPE 3 : Vérification de la connexion à Supabase
        // -------------------------------------------------------
        setStatus("Vérification de la base de données...");

        // Requête de test sur la table "users"
        // head: true : Ne récupère pas les données complètes
        // count: "exact" : Compte le nombre d'enregistrements
        const { error } = await supabase
          .from("users") // Table "users" dans Supabase
          .select("id", { // On sélectionne juste l'ID
            count: "exact", // On compte le nombre total
            head: true // On ne récupère pas les données
          });

        // -------------------------------------------------------
        // ÉTAPE 4 : Gestion des erreurs de base de données
        // -------------------------------------------------------
        if (error) {
          // En cas d'erreur, on redirige quand même vers login
          setStatus("Erreur DB, redirection vers login...");
          router.replace("/auth/login");
          return;
        }

        // -------------------------------------------------------
        // ÉTAPE 5 : Redirection finale vers la page de connexion
        // -------------------------------------------------------
        // Tout est ok, on redirige l'utilisateur vers login
        setStatus("Redirection vers /auth/login...");
        router.replace("/auth/login");

      } catch (err: any) {
        // -------------------------------------------------------
        // GESTION DES ERREURS IMPRÉVUES
        // -------------------------------------------------------
        // Erreur réseau, serveur, ou autre
        setError(err.message || "Erreur inconnue");
        setStatus("Erreur");
      }
    }

    // Exécution de la fonction de vérification
    test();

    // [] : Le useEffect s'exécute une seule fois au chargement
    // [router] : Dépendance (router ne change jamais)
  }, [router]);

  // ============================================================
  // RENDU DU COMPOSANT
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm p-10 shadow-2xl text-center">
        {error ? (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-3">Erreur de connexion</h1>
            <p className="text-gray-700 mb-2">{error}</p>
            <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">Statut : {status}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🔄 Réessayer
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🇸🇳</div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">TERANGA</h1>
            <p className="text-gray-600 mb-4">Application VTC et Livraison - Sénégal</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-700">{status}</p>
            </div>
            <p className="text-xs text-gray-400 mt-4">Veuillez patienter...</p>
          </>
        )}
      </div>
    </div>
  );
}