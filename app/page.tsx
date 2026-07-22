"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error } = await supabase
          .from("users")
          .select("id", { count: "exact", head: true });

        if (error) {
          throw error;
        }

        router.replace("/auth/login");
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de se connecter à la base de données. Vérifiez votre configuration." 
        );
      }
    }

    checkConnection();
  }, [router]);

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
          </>
        )}
      </div>
    </div>
  );
}
