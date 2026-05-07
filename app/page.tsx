/*
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🇸🇳 TERANGA
        </h1>
        <p className="text-lg text-gray-700">
          Application VTC et Livraison - Sénégal
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Carte Mapbox, Supabase, Paiement Wave/Orange Money
        </p>
      </div>
    </div>
  )
}
*/
/*Connexion a SUPABASE */
"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Connexion...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase
          .from("users")
          .select("count", { count: "exact", head: true });
        if (error) throw error;
        setStatus("✅ Connecté à Supabase !");
      } catch (error) {
        setStatus("❌ Erreur de connexion");
        console.error(error);
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🇸🇳 TERANGA
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Application VTC et Livraison - Sénégal
        </p>
        <p className="text-sm text-gray-500">Status : {status}</p>
      </div>
    </div>
  );
}