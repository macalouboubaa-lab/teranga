"use client";

import { useMemo, useState } from "react";
import { formatFCFA } from "@/lib/pricing";

type RideRequest = {
  id: number;
  pickup: string;
  destination: string;
  fare: number;
  eta: string;
};

const initialRequests: RideRequest[] = [
  { id: 1, pickup: "Mermoz", destination: "Plateau", fare: 6800, eta: "4 min" },
  { id: 2, pickup: "Hann", destination: "Fass", fare: 5400, eta: "8 min" },
  { id: 3, pickup: "Liberté 6", destination: "Médina", fare: 7600, eta: "12 min" },
];

export default function DriverHomePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [requests, setRequests] = useState(initialRequests);
  const [acceptedRide, setAcceptedRide] = useState<RideRequest | null>(null);

  const earnings = useMemo(() => 125000 + (acceptedRide ? acceptedRide.fare : 0), [acceptedRide]);

  function acceptRequest(request: RideRequest) {
    setAcceptedRide(request);
    setRequests((current) => current.filter((item) => item.id !== request.id));
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Accueil chauffeur</h1>
            <p className="mt-2 text-gray-400">Gérez votre disponibilité, les courses à accepter et vos revenus.</p>
          </div>
          <button
            onClick={() => setIsOnline((value) => !value)}
            className={`rounded-full px-4 py-2 font-semibold ${isOnline ? "bg-green-500 text-black" : "bg-gray-800 text-white"}`}
          >
            {isOnline ? "En ligne" : "Hors ligne"}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Revenus du jour</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{formatFCFA(earnings)}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Courses en attente</p>
            <p className="mt-2 text-3xl font-bold">{requests.length}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Statut</p>
            <p className="mt-2 text-xl font-semibold text-white">{isOnline ? "Prêt à recevoir des courses" : "Vous êtes actuellement hors ligne"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <h2 className="text-lg font-semibold text-green-400">Courses disponibles</h2>
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{request.pickup} → {request.destination}</p>
                      <p className="mt-1 text-sm text-gray-400">Arrivée estimée : {request.eta}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Gain estimé</p>
                      <p className="font-semibold text-green-400">{formatFCFA(request.fare)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => acceptRequest(request)}
                    className="mt-3 rounded-full bg-green-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-green-400"
                  >
                    Accepter
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <h2 className="text-lg font-semibold text-green-400">Course active</h2>
            {acceptedRide ? (
              <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-sm text-green-300">Course acceptée</p>
                <p className="mt-2 text-xl font-semibold text-white">{acceptedRide.pickup} → {acceptedRide.destination}</p>
                <p className="mt-2 text-sm text-gray-300">Montant estimé : {formatFCFA(acceptedRide.fare)}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">Aucune course acceptée pour le moment. Activez votre statut pour commencer à recevoir des demandes.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
