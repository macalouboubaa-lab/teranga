import { createClient } from "@supabase/supabase-js";
/*
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
---------------------------------------------------------------------------------------
Clé : NEXT_PUBLIC_SUPABASE_URL
Valeur : sb_publishable_sIYhg5wCPde7Gg-dHxAkpA_U3oug3O9
Note (Optionnel) : Laissez vide ou mettez "URL Supabase"
----------------------------------------------------------------------------------------
Pour NEXT_PUBLIC_SUPABASE_ANON_KEY :
Clé : NEXT_PUBLIC_SUPABASE_ANON_KEY
Valeur : *************************
Note (Optionnel) : Laissez vide ou mettez "Clé Anon Supabase"
----------------------------------------------------------------------------------------
*/

const supabaseUrl = "https://mcistfdbrlbbkzjvsreb.supabase.co"!;
const supabaseAnonKey = "sb_publishable_sIYhg5wCPde7Gg-dHxAkpA_U3oug3O9"!;	

/*   ANCIEN LIENS 

const supabaseUrl = "https://mcistfdbrlbbkzjvsreb.supabase.co"!;
const supabaseAnonKey = "sb_publishable_p3qAAaIIBNQpCxBgy-RGnA_J-sOMxPd"!;	
*/
//j'enleve ma verification pour le moment 
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseKey is required. Vérifie ton fichier .env.local");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
