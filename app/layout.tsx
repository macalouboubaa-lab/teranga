// ============================================================
// app/layout.tsx - Layout principal de l'application
// Ce fichier définit la structure globale de toutes les pages
// ============================================================

// Import des types TypeScript pour Next.js
import type { Metadata } from "next";

// Import des polices Google Fonts (Geist et Geist Mono)
import { Geist, Geist_Mono } from "next/font/google";

// Import des styles CSS globaux (Tailwind)
import "./globals.css";

// Import du composant Navbar (menu de navigation fixe)
import Navbar from "@/components/Navbar";

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Mapbox Token:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

// ============================================================
// CONFIGURATION DES POLICES
// ============================================================

// Configuration de la police Geist (police principale)
const geistSans = Geist({
  variable: "--font-geist-sans", // Nom de la variable CSS
  subsets: ["latin"],           // Uniquement les caractères latins
});

// Configuration de la police Geist Mono (pour le code)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// MÉTADONNÉES DE LA PAGE (SEO)
// ============================================================

export const metadata: Metadata = {
  title: "TERANGA - VTC et Livraison Sénégal",
  description: "Application de VTC et livraison au Sénégal",
};

// ============================================================
// COMPOSANT LAYOUT PRINCIPAL
// ============================================================

export default function RootLayout({
  children, // Les pages enfants seront injectées ici
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Balise HTML principale avec les polices et classes
    <html
      lang="fr" // Langue française
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // h-full : hauteur 100% de l'écran
      // antialiased : lissage des polices
    >
      {/* Corps de la page */}
      <body className="min-h-full flex flex-col">
        
        {/* ========================================== */}
        // SECTION 1 : MENU DE NAVIGATION FIXE
        // S'affiche sur TOUTES les pages
        // fixed : reste en haut même en défilant
        // z-50 : priorité d'affichage au-dessus du contenu
        {/* ========================================== */}
        <Navbar />
        
        {/* ========================================== */}
        // SECTION 2 : CONTENU PRINCIPAL
        // flex-1 : prend tout l'espace disponible
        // pt-16 : padding-top de 4rem (64px) pour ne pas
        //        être caché sous le menu fixe
        {/* ========================================== */}
        <main className="flex-1 pt-16">
          {children} {/* Les pages s'affichent ici */}
        </main>
      </body>
    </html>
  );
}