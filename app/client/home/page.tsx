"use client";

import { useState } from "react";
import { calculatePrice, formatFCFA, type RideType } from "@/lib/pricing";

export default function ClientHomePage() {
  const [pickup, setPickup] = useState("Mermoz");
  const [destination, setDestination] = useState("Hann Mariste");
  const [distance, setDistance] = useState(6);
  const [rideType, setRideType] = useState<RideType>("standard");
  const [passengers, setPassengers] = useState(1);

  const price = calculatePrice(distance, rideType);

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="mx-auto max-w-6xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Demande de course</h1>
            <p className="mt-2 text-gray-400">Planifiez votre trajet en quelques secondes avec une estimation instantanée.</p>
          </div>
          <button className="rounded-full bg-green-500 px-4 py-2 font-semibold text-black transition hover:bg-green-400">
            Réserver maintenant
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                <span className="mb-2 block">Adresse de départ</span>
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-green-500"
                />
              </label>

              <label className="text-sm text-gray-400">
                <span className="mb-2 block">Destination</span>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-green-500"
                />
              </label>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-400">Type de course</p>
              <div className="flex flex-wrap gap-2">
                {(["standard", "premium"] as RideType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRideType(type)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold ${rideType === type ? "bg-green-500 text-black" : "bg-gray-800 text-white"}`}
                  >
                    {type === "standard" ? "Standard" : "Premium"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-400">
                <span className="mb-2 block">Distance estimée</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-lg font-semibold text-white">{distance} km</p>
              </label>

              <label className="text-sm text-gray-400">
                <span className="mb-2 block">Passagers</span>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-green-500"
                >
                  {[1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
            <p className="text-sm text-gray-400">Prix estimé</p>
            <p className="mt-2 text-4xl font-bold text-green-400">{formatFCFA(price)}</p>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                <p className="text-gray-400">Trajet</p>
                <p className="mt-1 font-semibold text-white">{pickup} → {destination}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                <p className="text-gray-400">Véhicule</p>
                <p className="mt-1 font-semibold text-white">{rideType === "premium" ? "Berline premium" : "Berline standard"}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                <p className="text-gray-400">Passagers</p>
                <p className="mt-1 font-semibold text-white">{passengers} personne{passengers > 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
