"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        // 1. Vérifier d'abord si l'utilisateur est déjà connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Si connecté, rediriger vers la page client
          router.replace("/client/home");
          return;
        }

        // 2. Si non connecté, vérifier la connexion à la base de données
        const { error } = await supabase
          .from("users")
          .select("id", { count: "exact", head: true });

        if (error) {
          throw error;
        }

        // 3. Si tout est ok, rediriger vers login
        router.replace("/auth/login");
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de se connecter à la base de données. Vérifiez votre configuration."
        );
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, [router]);

  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">
            Vérification de la connexion...
          </h1>
          <p className="text-gray-600 mt-2">
            Connexion à la base de données en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">
        {!error ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Vérification de la connexion...
            </h1>
            <p className="text-gray-600">
              Connexion à la base de données en cours. Vous serez redirigé vers la page de connexion dès que la vérification sera terminée.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">Erreur de connexion</h1>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}