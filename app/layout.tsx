// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TERANGA - VTC et Livraison Sénégal",
  description: "Application de VTC et livraison au Sénégal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Menu fixe en haut */}
        <Navbar />
        
        {/* Le contenu principal avec un padding-top pour éviter d'être caché sous le menu */}
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}