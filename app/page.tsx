"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("Initialisation...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function test() {
      try {
        setStatus("Vérification de la session...");
        
        const { data: { session } } = await supabase.auth.getSession();
        setStatus(`Session: ${session ? "Connecté" : "Non connecté"}`);

        if (session) {
          setStatus("Redirection vers /client/home...");
          router.replace("/client/home");
          return;
        }

        setStatus("Vérification de la base de données...");
        const { error } = await supabase
          .from("users")
          .select("id", { count: "exact", head: true });

        if (error) {
          setStatus("Erreur DB, redirection vers login...");
          router.replace("/auth/login");
          return;
        }

        setStatus("Redirection vers /auth/login...");
        router.replace("/auth/login");
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setStatus("Erreur");
      }
    }

    test();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl rounded-3xl border border-gray-200 bg-white p-10 shadow-xl text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">❌ Erreur</h1>
            <p className="text-gray-700">{error}</p>
            <p className="text-sm text-gray-500 mt-2">{status}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Réessayer
            </button>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900">{status}</h1>
          </>
        )}
      </div>
    </div>
  );
}