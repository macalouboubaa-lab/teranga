// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Accueil */}
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            🇸🇳 TERANGA
          </Link>

          {/* Liens de navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-green-200 transition">
              Accueil
            </Link>
            
            {user ? (
              <>
                <Link href="/client/home" className="hover:text-green-200 transition">
                  Client
                </Link>
                <Link href="/driver/home" className="hover:text-green-200 transition">
                  Chauffeur
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-green-200 transition">
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
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