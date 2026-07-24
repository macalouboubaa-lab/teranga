// app/components/MapWithRoute.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import InteractiveMap, { Marker, Popup, NavigationControl } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

//  Lire le token depuis les variables d'environnement
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;


// ⚠️  vérification pour éviter une erreur si la variable est absente
if (!MAPBOX_TOKEN) {
  console.error("❌ Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.");
}
interface Point {
  longitude: number;
  latitude: number;
}

interface MapWithRouteProps {
  onDistanceCalculated?: (distance: number, price: number) => void;
}

export default function MapWithRoute({ onDistanceCalculated }: MapWithRouteProps) {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -17.4677,  // Dakar
    latitude: 14.7167,
    zoom: 12
  });
  const mapRef = useRef<any>(null);

  // Fonction pour calculer la distance entre deux points (Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculer le prix basé sur la distance
  const calculatePrice = (distanceKm: number) => {
    // Tarif: 500 FCFA de base + 350 FCFA par km
    const basePrice = 500;
    const pricePerKm = 350;
    return Math.round(basePrice + (distanceKm * pricePerKm));
  };

  // Gérer le clic sur la carte
  const handleMapClick = (event: any) => {
    const [lng, lat] = event.lngLat;
    const point = { longitude: lng, latitude: lat };

    if (!startPoint) {
      setStartPoint(point);
    } else if (!endPoint) {
      setEndPoint(point);
      
      // Calculer la distance
      const dist = calculateDistance(
        startPoint.latitude, startPoint.longitude,
        lat, lng
      );
      setDistance(dist);
      
      const prix = calculatePrice(dist);
      setPrice(prix);
      
      // Notifier le parent
      if (onDistanceCalculated) {
        onDistanceCalculated(dist, prix);
      }
    } else {
      // Réinitialiser
      setStartPoint(point);
      setEndPoint(null);
      setDistance(null);
      setPrice(null);
    }
  };

  // Réinitialiser les points
  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
    setPrice(null);
  };

  // Ajuster la vue pour montrer les deux points
  useEffect(() => {
    if (startPoint && endPoint && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([startPoint.longitude, startPoint.latitude]);
      bounds.extend([endPoint.longitude, endPoint.latitude]);
      mapRef.current.getMap().fitBounds(bounds, { padding: 50, duration: 1000 });
    }
  }, [startPoint, endPoint]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <InteractiveMap
        ref={mapRef}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        width="100%"
        height="100%"
        {...viewState}
        onViewStateChange={(evt: any) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        className="w-full h-full"
      >
        <div className="absolute top-4 right-4 z-10">
          <NavigationControl showCompass showZoom />
        </div>
        
        {/* Marqueur de départ */}
        {startPoint && (
          <Marker longitude={startPoint.longitude} latitude={startPoint.latitude}>
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Départ
            </div>
          </Marker>
        )}
        
        {/* Marqueur d'arrivée */}
        {endPoint && (
          <Marker longitude={endPoint.longitude} latitude={endPoint.latitude}>
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Arrivée
            </div>
          </Marker>
        )}

        {/* Infos de distance et prix */}
        {distance && price && (
          <Popup
            longitude={endPoint!.longitude}
            latitude={endPoint!.latitude}
            closeOnClick={false}
            className="bg-white p-4 rounded-lg shadow-xl"
          >
            <div className="text-center">
              <p className="text-sm text-gray-600">Distance estimée</p>
              <p className="text-2xl font-bold text-green-600">{distance.toFixed(1)} km</p>
              <p className="text-sm text-gray-600 mt-2">Prix estimé</p>
              <p className="text-2xl font-bold text-blue-600">{price.toLocaleString()} FCFA</p>
              <button
                onClick={resetPoints}
                className="mt-3 bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Réinitialiser
              </button>
            </div>
          </Popup>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg text-center">
          <p className="text-sm text-gray-700">
            {!startPoint && "👆 Cliquez sur la carte pour définir le point de départ"}
            {startPoint && !endPoint && "👆 Cliquez maintenant pour définir le point d'arrivée"}
            {startPoint && endPoint && "✅ Trajet calculé ! Cliquez sur 'Réinitialiser' pour recommencer"}
          </p>
        </div>
      </InteractiveMap>
    </div>
  );
}