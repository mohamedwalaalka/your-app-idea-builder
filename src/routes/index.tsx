import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { RaadLogo } from "@/components/raad-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raad Income Tracker — Private mobile money finance" },
      { name: "description", content: "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style." },
      { property: "og:title", content: "Raad Income Tracker — Private mobile money finance" },
      { property: "og:description", content: "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style." },
      { property: "og:url", content: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/" },
      { name: "twitter:title", content: "Raad Income Tracker" },
      { name: "twitter:description", content: "Private, automatic mobile money tracking with a WhatsApp-style interface." },
    ],
    links: [{ rel: "canonical", href: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/" }],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    supabase.auth.getSession().then(({ data }) => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 1200 - elapsed);
      setTimeout(() => {
        if (cancelled) return;
        navigate({ to: data.session ? "/home" : "/onboarding", replace: true });
      }, wait);
    });
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="relative flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center gap-5">
          <div className="rounded-[28px] gradient-primary p-6 shadow-elegant">
            <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-primary-foreground" aria-hidden>
              <path d="M4 20V6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M8 13h6M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground">Raad</h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Smart money, effortlessly tracked</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5" aria-label="Loading">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
        </div>
      </div>

      <RaadLogo className="sr-only" />
    </div>
  );
}
