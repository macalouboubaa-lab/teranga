
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient, getSupabaseConfigIssue } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Veuillez saisir votre email et votre mot de passe.");
      setLoading(false);
      return;
    }

    try {
      const configIssue = getSupabaseConfigIssue();
      if (configIssue) {
        setError(`Configuration Supabase manquante : ${configIssue}`);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        const message = authError.message || "Erreur d’authentification inconnue";
        setError(`Connexion impossible : ${message}`);
        setLoading(false);
        return;
      }

      const role = data.user?.user_metadata?.role;
      router.replace(role === "driver" ? "/driver/home" : "/client/home");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Erreur réseau ou configuration : ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email pour réinitialiser votre mot de passe.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const configIssue = getSupabaseConfigIssue();
      if (configIssue) {
        setError(`Configuration Supabase manquante : ${configIssue}`);
        setLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/login`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess("Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(`Impossible d’envoyer l’email de réinitialisation : ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-green-400 mb-6">🚗 TERANGA</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-800 rounded-xl p-3 text-white mb-3 outline-none border border-gray-700 focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full bg-gray-800 rounded-xl p-3 text-white mb-4 outline-none border border-gray-700 focus:border-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={loading}
          className="mt-3 w-full text-sm text-green-400 underline hover:text-green-300"
        >
          Mot de passe oublié ?
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Pas de compte ?{" "}
          <a href="/auth/register" className="text-green-400">
            S&apos;inscrire
          </a>
        </p>
      </div>
    </div>
  );
}
