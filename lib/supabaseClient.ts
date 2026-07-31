import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfigIssue() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "NEXT_PUBLIC_SUPABASE_URL est manquant.";
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY est manquant.";
  }

  return null;
}

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

export function getSupabaseErrorHint(error: { message?: string } | null | undefined) {
  const message = error?.message ?? "";

  if (message.includes("relation") && message.includes("does not exist")) {
    return "La table public.users n’existe pas encore dans votre projet Supabase. Exécutez le SQL de SUPABASE_SCHEMA.sql dans l’éditeur SQL de Supabase.";
  }

  if (message.includes("row-level security") || message.includes("policy")) {
    return "Les politiques RLS empêchent l’opération. Vérifiez les politiques sur public.users et public.rides.";
  }

  if (message.includes("JWT") || message.includes("token")) {
    return "Le jeton d’authentification est invalide ou expiré. Reconnectez-vous puis réessayez.";
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

export async function checkSupabaseSchema() {
  try {
    const supabase = getSupabaseClient();
    const res: any = { users: null, rides: null, ok: false, errors: [] };

    const { data: udata, error: uerr } = await supabase.from("users").select("id").limit(1);
    if (uerr) {
      res.users = { ok: false, error: uerr.message, hint: getSupabaseErrorHint(uerr) };
      res.errors.push({ table: "users", error: uerr.message });
    } else {
      res.users = { ok: true, count: (udata ?? []).length };
    }

    const { data: rdata, error: rerr } = await supabase.from("rides").select("id").limit(1);
    if (rerr) {
      res.rides = { ok: false, error: rerr.message, hint: getSupabaseErrorHint(rerr) };
      res.errors.push({ table: "rides", error: rerr.message });
    } else {
      res.rides = { ok: true, count: (rdata ?? []).length };
    }

    res.ok = res.errors.length === 0;
    return res;
  } catch (err: any) {
    return { ok: false, errors: [{ error: err?.message ?? String(err) }], hint: getSupabaseConfigIssue?.() ?? null };
  }
}
