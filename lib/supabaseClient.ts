import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase n'est pas configuré. Vérifie NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans l'environnement ou Vercel."
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseConfigIssue() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "NEXT_PUBLIC_SUPABASE_URL est manquant.";
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY est manquant.";
  }

  return null;
}

export async function ensureUserProfile(supabase: ReturnType<typeof getSupabaseClient>, userId: string, profile: { email: string; phone?: string; full_name?: string; role?: string }) {
  const { error } = await supabase.from("users").upsert(
    {
      id: userId,
      email: profile.email,
      phone: profile.phone ?? null,
      full_name: profile.full_name ?? null,
      role: profile.role ?? "client",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  return { error };
}

export async function createRide(supabase: ReturnType<typeof getSupabaseClient>, ride: {
  rider_id: string;
  pickup_address: string;
  dropoff_address: string;
  distance_km: number;
  price_cfa: number;
}) {
  const { data, error } = await supabase.from("rides").insert(ride).select().single();

  return { data, error };
}

export async function listPendingRides(supabase: ReturnType<typeof getSupabaseClient>) {
  const { data, error } = await supabase
    .from("rides")
    .select("id, rider_id, pickup_address, dropoff_address, distance_km, price_cfa, created_at")
    .eq("status", "requested")
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function acceptRide(supabase: ReturnType<typeof getSupabaseClient>, rideId: string, driverId: string) {
  const { data, error } = await supabase
    .from("rides")
    .update({ status: "accepted", driver_id: driverId, updated_at: new Date().toISOString() })
    .eq("id", rideId)
    .select()
    .single();

  return { data, error };
}
