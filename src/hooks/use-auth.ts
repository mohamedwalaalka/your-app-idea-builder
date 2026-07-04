import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const PUBLIC_PATHS = new Set([
  "/",
  "/onboarding",
  "/login",
  "/signup",
  "/sms-permission",
]);

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listener FIRST, then getSession — recommended order
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, ready };
}

/** Redirects to /login if the user is not signed-in after auth is resolved. */
export function useRequireAuth() {
  const { session, ready } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!ready) return;
    if (!session && !PUBLIC_PATHS.has(pathname)) {
      navigate({ to: "/login" });
    }
  }, [ready, session, pathname, navigate]);

  return { session, ready };
}
