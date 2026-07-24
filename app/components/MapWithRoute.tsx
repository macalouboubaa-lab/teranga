// ============================================================
// app/components/MapWithRoute.tsx - Carte interactive Mapbox
// Ce composant permet de sélectionner un point de départ et d'arrivée
// sur une carte, puis calcule automatiquement la distance et le prix
// ============================================================

// "use client" : Composant rendu côté client (nécessaire pour Mapbox)
"use client";

// ============================================================
// IMPORTS
// ============================================================

// Import des hooks React pour la gestion d'état et des références
import { useState, useRef, useEffect } from "react";

// Import des composants Mapbox
// Map : Composant principal de la carte
// Marker : Marqueur pour afficher des points
// Popup : Fenêtre d'information qui s'affiche au-dessus des marqueurs
// NavigationControl : Boutons de zoom et de rotation
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";

// Import des styles CSS de Mapbox (obligatoire pour l'affichage)
import "mapbox-gl/dist/mapbox-gl.css";

// ============================================================
// CONFIGURATION
// ============================================================

// Récupération du token Mapbox depuis les variables d'environnement
// Ce token est public et permet d'utiliser les services Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// ============================================================
// TYPES TYPESCRIPT
// ============================================================

// Interface définissant la structure d'un point sur la carte
// longitude : Coordonnée horizontale (est-ouest)
// latitude : Coordonnée verticale (nord-sud)
interface Point {
  longitude: number;
  latitude: number;
}

// Interface définissant les props (propriétés) du composant
// onDistanceCalculated : Fonction callback appelée lorsque la distance est calculée
// Permet au composant parent (client/home) de recevoir les informations du trajet
interface MapWithRouteProps {
  onDistanceCalculated?: (distance: number, price: number) => void;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function MapWithRoute({ onDistanceCalculated }: MapWithRouteProps) {
  
  // ============================================================
  // ÉTATS DU COMPOSANT
  // ============================================================

  // startPoint : Point de départ (null si non défini)
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  
  // endPoint : Point d'arrivée (null si non défini)
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  
  // distance : Distance calculée entre les deux points (en km)
  const [distance, setDistance] = useState<number | null>(null);
  
  // price : Prix estimé calculé à partir de la distance
  const [price, setPrice] = useState<number | null>(null);
  
  // viewState : Position et zoom de la carte
  // Coordonnées par défaut : Dakar, Sénégal
  const [viewState, setViewState] = useState({
    longitude: -17.4677,  // Longitude de Dakar
    latitude: 14.7167,     // Latitude de Dakar
    zoom: 12,              // Niveau de zoom (plus élevé = plus proche)
  });

  const handleMove = (evt: any) => {
    setViewState(evt.viewState);
  };
  
  // mapRef : Référence vers l'instance de la carte Mapbox
  // Permet d'appeler des méthodes directement sur la carte (fitBounds, etc.)
  const mapRef = useRef<any>(null);

  // ============================================================
  // FONCTIONS UTILITAIRES
  // ============================================================

  /**
   * Calcule la distance entre deux points géographiques
   * Utilise la formule de Haversine pour calculer la distance à vol d'oiseau
   * 
   * @param lat1 - Latitude du point 1
   * @param lon1 - Longitude du point 1
   * @param lat2 - Latitude du point 2
   * @param lon2 - Longitude du point 2
   * @returns Distance en kilomètres
   */
  const calculateDistance = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ) => {
    // Rayon de la Terre en kilomètres
    const R = 6371;
    
    // Conversion des degrés en radians pour les calculs trigonométriques
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    // Formule de Haversine
    // a = carré de la moitié de la distance angulaire
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    // c = distance angulaire en radians
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Distance = rayon × distance angulaire
    return R * c;
  };

  /**
   * Calcule le prix estimé en fonction de la distance
   * Tarif : 500 FCFA de prise en charge + 350 FCFA par kilomètre
   * 
   * @param distanceKm - Distance en kilomètres
   * @returns Prix total en FCFA (arrondi à l'entier le plus proche)
   */
  const calculatePrice = (distanceKm: number) => {
    const basePrice = 500;    // Prix de base (prise en charge)
    const pricePerKm = 350;   // Prix par kilomètre
    return Math.round(basePrice + distanceKm * pricePerKm);
  };

  // ============================================================
  // GESTION DES CLICS SUR LA CARTE
  // ============================================================

  /**
   * Gère le clic sur la carte
   * Logique en 3 étapes :
   * 1. Premier clic → Définit le point de départ
   * 2. Deuxième clic → Définit le point d'arrivée et calcule la distance/prix
   * 3. Troisième clic → Réinitialise et redéfinit le point de départ
   */
  const handleMapClick = (event: any) => {
    // Récupère les coordonnées du clic
    const { lng, lat } = event.lngLat;
    const point: Point = { longitude: lng, latitude: lat };

    // Cas 1 : Aucun point de départ → Définir le départ
    if (!startPoint) {
      setStartPoint(point);
    } 
    // Cas 2 : Départ défini mais pas d'arrivée → Définir l'arrivée et calculer
    else if (!endPoint) {
      setEndPoint(point);
      
      // Calcul de la distance entre le départ et l'arrivée
      const dist = calculateDistance(
        startPoint.latitude, startPoint.longitude,
        lat, lng
      );
      
      // Calcul du prix à partir de la distance
      const prix = calculatePrice(dist);
      
      // Mise à jour des états
      setDistance(dist);
      setPrice(prix);
      
      // Notification du composant parent (si la prop est fournie)
      if (onDistanceCalculated) {
        onDistanceCalculated(dist, prix);
      }
    } 
    // Cas 3 : Les deux points sont définis → Réinitialiser et recommencer
    else {
      setStartPoint(point);
      setEndPoint(null);
      setDistance(null);
      setPrice(null);
    }
  };

  // ============================================================
  // FONCTION DE RÉINITIALISATION
  // ============================================================

  /**
   * Réinitialise tous les points et les calculs
   * Permet à l'utilisateur de recommencer un nouveau trajet
   */
  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
    setPrice(null);
  };

  // ============================================================
  // EFFET SECONDAIRE : AJUSTEMENT DE LA VUE
  // ============================================================

  /**
   * Effet qui s'exécute lorsque startPoint ou endPoint change
   * Ajuste automatiquement le zoom et la vue pour montrer les deux points
   */
  useEffect(() => {
    // Vérifie que les deux points existent et que la carte est chargée
    if (startPoint && endPoint && mapRef.current) {
      // Récupère l'instance de la carte Mapbox
      const map = mapRef.current.getMap();
      
      // fitBounds : Ajuste la vue pour inclure les deux points
      // avec un padding de 60px pour une meilleure lisibilité
      map.fitBounds(
        [
          [
            Math.min(startPoint.longitude, endPoint.longitude),
            Math.min(startPoint.latitude, endPoint.latitude),
          ],
          [
            Math.max(startPoint.longitude, endPoint.longitude),
            Math.max(startPoint.latitude, endPoint.latitude),
          ],
        ],
        { 
          padding: 60,       // Marge autour des points
          duration: 1000     // Durée de l'animation en millisecondes
        }
      );
    }
  }, [startPoint, endPoint]);

  // ============================================================
  // RENDU DU COMPOSANT
  // ============================================================

  return (
    // Conteneur principal de la carte
    // relative : Pour positionner les éléments enfants (Popup, instructions)
    // w-full h-[500px] : Largeur 100%, hauteur fixe de 500px
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      
      {/* ========================================================== */}
      {/* COMPOSANT MAPBOX */}
      {/* ========================================================== */}
      <Map
        // Référence pour interagir avec la carte
        ref={mapRef}
        
        // Token d'authentification Mapbox
        mapboxAccessToken={MAPBOX_TOKEN}
        
        // Position et zoom actuels
        {...viewState}
        
        // Gestionnaire de mouvement (zoom, déplacement)
        onMove={handleMove}
        
        // Gestionnaire de clic sur la carte
        onClick={handleMapClick}
        
        // Style de la carte (carte sombre)
        mapStyle="mapbox://styles/mapbox/dark-v11"
        
        // Dimensions de la carte
        style={{ width: "100%", height: "100%" }}
      >
        
        {/* ========================================================== */}
        {/* CONTROLES DE NAVIGATION */}
        {/* ========================================================== */}
        {/* Ajoute les boutons de zoom et de rotation en haut à droite */}
        <NavigationControl />

        {/* ========================================================== */}
        {/* MARQUEUR DE DÉPART */}
        {/* ========================================================== */}
        {/* S'affiche uniquement si startPoint est défini */}
        {startPoint && (
          <Marker 
            longitude={startPoint.longitude} 
            latitude={startPoint.latitude}
          >
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Départ
            </div>
          </Marker>
        )}

        {/* ========================================================== */}
        {/* MARQUEUR D'ARRIVÉE */}
        {/* ========================================================== */}
        {/* S'affiche uniquement si endPoint est défini */}
        {endPoint && (
          <Marker 
            longitude={endPoint.longitude} 
            latitude={endPoint.latitude}
          >
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Arrivée
            </div>
          </Marker>
        )}

        {/* ========================================================== */}
        {/* POPUP D'INFORMATIONS */}
        {/* ========================================================== */}
        {/* Affiche la distance et le prix lorsque les deux points sont définis */}
        {distance && price && endPoint && (
          <Popup
            longitude={endPoint.longitude}
            latitude={endPoint.latitude}
            closeOnClick={false} // Ne se ferme pas au clic sur la carte
          >
            <div className="text-center p-2">
              {/* Distance */}
              <p className="text-sm text-gray-600">Distance estimée</p>
              <p className="text-xl font-bold text-green-600">
                {distance.toFixed(1)} km
              </p>
              
              {/* Prix */}
              <p className="text-sm text-gray-600 mt-1">Prix estimé</p>
              <p className="text-xl font-bold text-blue-600">
                {price.toLocaleString()} FCFA
              </p>
              
              {/* Bouton de réinitialisation */}
              <button
                onClick={resetPoints}
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Réinitialiser
              </button>
            </div>
          </Popup>
        )}

        {/* ========================================================== */}
        {/* INSTRUCTIONS EN BAS DE LA CARTE */}
        {/* ========================================================== */}
        {/* Affiche des messages contextuels guidant l'utilisateur */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg text-center">
          <p className="text-sm text-gray-700">
            {/* Message selon l'état des points */}
            {!startPoint && "👆 Cliquez pour définir le départ"}
            {startPoint && !endPoint && "👆 Cliquez pour définir l'arrivée"}
            {startPoint && endPoint && "✅ Trajet calculé !"}
          </p>
        </div>
        
      </Map>
    </div>
  );
}