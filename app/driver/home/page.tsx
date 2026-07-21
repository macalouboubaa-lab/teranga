"use client";

import { useEffect, useState } from "react";
import { formatFCFA } from "@/lib/pricing";

export default function DriverHomePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(125000);

  useEffect(() => {
    setEarnings(125000);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Accueil chauffeur</h1>
            <p className="mt-2 text-gray-400">Gérez votre disponibilité et vos revenus.</p>
          </div>
          <button
            onClick={() => setIsOnline((value) => !value)}
            className={`rounded-full px-4 py-2 font-semibold ${isOnline ? "bg-green-500 text-black" : "bg-gray-800 text-white"}`}
          >
            {isOnline ? "En ligne" : "Hors ligne"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Revenus du jour</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{formatFCFA(earnings)}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Courses en attente</p>
            <p className="mt-2 text-3xl font-bold">3</p>
          </div>
        </div>
      </div>
    </main>
  );
}
