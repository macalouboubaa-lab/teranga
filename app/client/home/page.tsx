// app/client/home/page.tsx
"use client";
import { useState } from "react";
import MapWithRoute from "../../components/MapWithRoute";

export default function ClientHomePage() {
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const handleDistanceCalculated = (dist: number, prix: number) => {
    setDistance(dist);
    setPrice(prix);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              🚗 Préparez votre trajet
            </h1>
            <p className="text-gray-600">
              Cliquez sur la carte pour sélectionner votre point de départ et d'arrivée
            </p>
          </div>

          {/* Carte */}
          <MapWithRoute onDistanceCalculated={handleDistanceCalculated} />

          {/* Résumé du trajet */}
          {distance && price && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Distance estimée</p>
                <p className="text-2xl font-bold text-green-600">
                  {distance.toFixed(1)} km
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Prix estimé</p>
                <p className="text-2xl font-bold text-blue-600">
                  {price.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}