"use client";

import { useEffect, useState } from "react";
import { calculatePrice, formatFCFA } from "@/lib/pricing";

export default function ClientHomePage() {
  const [distance, setDistance] = useState(6);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setPrice(calculatePrice(distance));
  }, [distance]);

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-green-400">Accueil client</h1>
        <p className="mt-2 text-gray-400">Préparez votre trajet et estimez le prix.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <label className="mb-2 block text-sm text-gray-400">Distance estimée (km)</label>
            <input
              type="range"
              min="1"
              max="20"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-3 text-lg font-semibold">{distance} km</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Prix estimé</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{formatFCFA(price)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
