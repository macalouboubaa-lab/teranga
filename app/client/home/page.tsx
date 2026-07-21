/*Sections à garder pour le client
Garder :
✅
La carte Mapbox plein écran
✅
Les champs départ + destination
✅
L'affichage du prix estimé
✅
Les boutons de paiement (Wave/OM/Cash)
✅
Le bouton "Commander" → INSERT dans rides
✅
L'écran de recherche de chauffeur
Ne pas mettre sur cette page :
❌
Le toggle En ligne/Hors ligne → page chauffeur uniquement
❌
Les stats de revenus → page chauffeur uniquement
❌
La notification de nouvelle course → page chauffeur uniquement*/

"use client" import { useState, useEffect } from "react" import { useRouter } from "next/navigation" import dynamic from "next/dynamic" 
// ← UNIQUEMENT ici
import { supabase } from "@/lib/supabaseClient" import { calculatePrice, formatFCFA } from "@/lib/pricing"
// ← UNIQUEMENT ici // 
Mapbox = import dynamique obligatoire (évite erreur SSR) const MapComponent = dynamic( () => import("@/components/Map"), { ssr: false } )
