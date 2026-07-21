/*Sections à garder pour le chauffeur
Garder :
✅
Le toggle En ligne / Hors ligne
UPDATE users SET is_online = true/false
✅
Les stats du jour (revenus, courses)
SELECT depuis rides WHERE driver_id = user.id
✅
La notification de nouvelle course + timer 30s
Supabase Realtime → écoute les rides "pending"
✅
Les boutons Accepter / Refuser
UPDATE rides SET driver_id, status = "accepted"
✅
L'historique des courses
Ne pas mettre sur cette page :
❌
Le champ destination → page client uniquement
❌
Le calcul du prix → fait côté client
❌
Le bouton "Commander" → page client uniquement*/

"use client" import { useState, useEffect } from "react" 
import { useRouter } from "next/navigation" import { supabase } from "@/lib/supabaseClient" 
import { formatFCFA } from "@/lib/pricing" 
// PAS de Mapbox ici → carte optionnelle uniquement 
// PAS de calculatePrice → le chauffeur voit juste le prix
