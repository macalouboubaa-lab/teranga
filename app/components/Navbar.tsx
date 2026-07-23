// ============================================================
// app/components/Navbar.tsx - Menu de navigation
// Ce composant s'affiche en haut de TOUTES les pages
// ============================================================

// "use client" : Composant côté client
// Nécessaire pour les interactions (connexion/déconnexion)
"use client";

// Import des composants Next.js
import Link from "next/link"; // Navigation entre les pages

// Import des hooks React
import { useState, useEffect } from "react";

// Client Supabase pour l'authentification
import { supabase } from "@/lib/supabaseClient";

// ============================================================
// COMPOSANT PRINCIPAL - NAVBAR
// ============================================================

export default function Navbar() {
  // ============================================================
  // ÉTAT DU COMPOSANT
  // ============================================================

  // user : Stocke les informations de l'utilisateur connecté
  // null = aucun utilisateur connecté
  const [user, setUser] = useState<any>(null);

  // ============================================================
  // EFFET SECONDAIRE - VÉRIFICATION DE LA SESSION
  // ============================================================

  useEffect(() => {
    // -------------------------------------------------------
    // ÉTAPE 1 : Récupération de la session au chargement
    // -------------------------------------------------------
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Si session existe, on stocke l'utilisateur
      // Sinon, on met null
      setUser(session?.user || null);
    });

    // -------------------------------------------------------
    // ÉTAPE 2 : Écouter les changements d'authentification
    // -------------------------------------------------------
    // onAuthStateChange : S'exécute à chaque connexion/déconnexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Mise à jour automatique de l'état
        setUser(session?.user || null);
      }
    );

    // -------------------------------------------------------
    // NETTOYAGE : Se désabonner à la destruction du composant
    // -------------------------------------------------------
    return () => subscription.unsubscribe();
  }, []); // [] : S'exécute une seule fois

  // ============================================================
  // FONCTION : DÉCONNEXION
  // ============================================================

  const handleLogout = async () => {
    // Déconnexion de Supabase
    await supabase.auth.signOut();
    // Redirection vers la page de connexion
    window.location.href = "/auth/login";
  };

  // ============================================================
  // RENDU DU COMPOSANT
  // ============================================================

  return (
    // Barre de navigation fixe en haut de la page
    // fixed : Reste en place même en défilant
    // z-50 : Priorité d'affichage (au-dessus du contenu)
    <nav className="bg-gradient-to-r from-green-700 to-green-500 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      
      {/* Conteneur avec marges automatiques */}
      <div className="container mx-auto px-4">
        
        {/* Disposition horizontale avec espace entre les éléments */}
        <div className="flex justify-between items-center h-16">
          
          // ==========================================
          // SECTION GAUCHE : LOGO / NOM DU SITE
          // ==========================================
          <Link 
            href="/" 
            className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-2xl">🇸🇳</span>
            TERANGA
          </Link>

          // ==========================================
          // SECTION DROITE : LIENS DE NAVIGATION
          // ==========================================
          <div className="flex items-center gap-6">
            
            // ---- Lien vers l'accueil ----
            <Link 
              href="/" 
              className="hover:text-green-200 transition duration-200"
            >
              Accueil
            </Link>
            
            // ==========================================
            // AFFICHAGE SELON L'ÉTAT DE CONNEXION
            // ==========================================
            
            {user ? (
              // ---- UTILISATEUR CONNECTÉ ----
              <>
                // Lien vers la page client
                <Link 
                  href="/client/home" 
                  className="hover:text-green-200 transition duration-200"
                >
                  🚗 Client
                </Link>
                
                // Lien vers la page chauffeur
                <Link 
                  href="/driver/home" 
                  className="hover:text-green-200 transition duration-200"
                >
                  🚕 Chauffeur
                </Link>
                
                // Bouton de déconnexion (rouge)
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              // ---- UTILISATEUR NON CONNECTÉ ----
              <>
                // Lien vers la page de connexion
                <Link 
                  href="/auth/login" 
                  className="hover:text-green-200 transition duration-200"
                >
                  Connexion
                </Link>
                
                // Lien vers la page d'inscription (bouton blanc)
                <Link
                  href="/auth/register"
                  className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}