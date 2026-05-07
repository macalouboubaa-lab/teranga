import { createClient } from "@supabase/supabase-js";
/*
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
*/

const supabaseUrl = "https://mcistfdbrlbbkzjvsreb.supabase.co"!;
const supabaseAnonKey = "sb_publishable_p3qAAaIIBNQpCxBgy-RGnA_J-sOMxPd"!;


// MES CLES 
//NEXT_PUBLIC_SUPABASE_URL=https://mcistfdbrlbbkzjvsreb.supabase.co
//NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_p3qAAaIIBNQpCxBgy-RGnA_J-sOMxPd
	


//j'enleve ma verification pour le moment 
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseKey is required. Vérifie ton fichier .env.local");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);