"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function AuthGate({
  children,
  expectedRole,
}: {
  children: React.ReactNode;
  expectedRole?: "client" | "driver";
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      const role = data.user?.user_metadata?.role as string | undefined;

      if (!data.user) {
        router.replace("/auth/login");
        return;
      }

      if (expectedRole && role !== expectedRole) {
        router.replace(role === "driver" ? "/driver/home" : "/client/home");
        return;
      }

      setReady(true);
    }

    void verifySession();
  }, [expectedRole, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-sm text-gray-400">Vérification de session...</p>
      </main>
    );
  }

  return <>{children}</>;
}
