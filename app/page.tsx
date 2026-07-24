"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  // Vérification de la session au chargement
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    }
    checkAuth();
  }, []);

  // Estimation fictive de course
  const handleCalculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      // Prix de base fictif pour la démonstration (ex: 2500 FCFA)
      setEstimatedPrice(2500);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col justify-between">
      
      {/* ============================================================ */}
      // NAVIGATION BAR
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-wider text-yellow-400">
              TERANGA <span className="text-red-600">VTC</span>
            </span>
          </Link>

          {/* Menu principal */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              ACCUEIL
            </Link>
            <Link href="#services" className="hover:text-yellow-400 transition-colors">
              SERVICES
            </Link>
            <Link href="#tarifs" className="hover:text-yellow-400 transition-colors">
              TARIFS
            </Link>
            <Link href="#contact" className="hover:text-yellow-400 transition-colors">
              CONTACT
            </Link>
          </nav>

          {/* Boutons Connexion / Espace Client */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => router.push("/client/home")}
                className="bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/10"
              >
                Mon Espace Client
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-block text-zinc-300 hover:text-white font-medium px-4 py-2"
                >
                  SE CONNECTER
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-600/20"
                >
                  S'INSCRIRE
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      // HERO SECTION + FORMULAIRE DE RÉSERVATION
      {/* ============================================================ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Colonne Gauche : Formulaire de Réservation */}
        <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-10">
          <div className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4 border border-yellow-400/20">
            🇸🇳 Transport Urbain au Sénégal
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
            VOTRE COURSE SÛRE, <br />
            <span className="text-yellow-400">RAPIDE</span> ET <span className="text-red-600">CONFORTABLE</span>
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            Commandez votre VTC à Dakar en quelques clics. Tarifs transparents et chauffeurs professionnels.
          </p>

          <form onSubmit={handleCalculatePrice} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Lieu de Prise en charge
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-yellow-400">📍</span>
                <input
                  type="text"
                  placeholder="Ex: Nord Foire, Colobane, Plateau..."
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Destination
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-red-500">🏁</span>
                <input
                  type="text"
                  placeholder="Ex: Aéroport AIBD, Almadies..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Estimation du tarif */}
            {estimatedPrice !== null && (
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 flex items-center justify-between text-yellow-400">
                <span className="text-sm font-medium">Prix estimé :</span>
                <span className="text-xl font-bold">{estimatedPrice} FCFA</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-yellow-400 font-semibold py-3.5 px-4 rounded-xl border border-yellow-400/30 transition-all text-sm"
              >
                Calculer le prix
              </button>
              
              <button
                type="button"
                onClick={() => router.push(user ? "/client/booking" : "/auth/login")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/30 transition-all text-sm"
              >
                RÉSERVER MAINTENANT
              </button>
            </div>
          </form>
        </div>

        {/* Colonne Droite : Visuel / Illustration */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/10 to-red-600/10 rounded-full blur-3xl -z-10" />
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-sm text-center max-w-md w-full">
            <div className="text-7xl mb-4">🚘</div>
            <h3 className="text-xl font-bold text-white mb-2">Des véhicules récents & climatisés</h3>
            <p className="text-zinc-400 text-sm">
              Profitez d'un trajet en toute sérénité avec nos chauffeurs certifiés sur tout Dakar.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      // SECTION AVANTAGES / POURQUOI CHOISIR TERANGA VTC
      {/* ============================================================ */}
      <section id="services" className="py-16 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              POURQUOI CHOISIR <span className="text-yellow-400">TERANGA VTC</span> ?
            </h2>
            <p className="text-zinc-400 text-sm mt-2">La meilleure solution de déplacement urbain au Sénégal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500 text-2xl mb-4">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Fiabilité & Sécurité</h3>
              <p className="text-zinc-400 text-sm">
                Chauffeurs identifiés, véhicules contrôlés et suivi GPS en temps réel pour tous vos trajets.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 text-2xl mb-4">
                🚗
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Véhicules Confort</h3>
              <p className="text-zinc-400 text-sm">
                Une flotte moderne, propre et entièrement climatisée pour garantir un confort maximal.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 text-2xl mb-4">
                🏷️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Prix Clairs</h3>
              <p className="text-zinc-400 text-sm">
                Aucune mauvaise surprise à l'arrivée : le tarif de votre course est fixé dès la réservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      // FOOTER
      {/* ============================================================ */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Teranga VTC Sénégal. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-300">Mentions Légales</Link>
            <Link href="#" className="hover:text-zinc-300">Confidentialité</Link>
            <Link href="#" className="hover:text-zinc-300">Devenir Chauffeur</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}