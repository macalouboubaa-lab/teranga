/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
};

export default nextConfig;
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force le chargement des variables d'environnement
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
