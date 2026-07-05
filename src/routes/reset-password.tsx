import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RaadLogo } from "@/components/raad-logo";
import { MobileShell } from "@/components/mobile-shell";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, validatePassword } from "@/lib/password";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Raad" },
      { name: "description", content: "Set a new password for your Raad account." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase places the recovery token in the URL hash; the client picks it up
    // automatically and emits PASSWORD_RECOVERY. We also gate on an active session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePassword(pw);
    if (!check.ok) return toast.error(check.message!);
    if (pw !== pw2) return toast.error("Passwords don't match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) return toast.error(friendlyAuthError(error.message));
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/home" });
  };

  return (
    <MobileShell withHero className="pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div />
        <RaadLogo size={32} />
      </div>

      <div className="mt-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Set a new password</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {ready
            ? "Choose a strong password. You'll be signed in after updating."
            : "Waiting for your reset link to be verified…"}
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={submit}>
        <Field id="pw" label="New password" value={pw} onChange={setPw}
          show={show} onToggle={() => setShow(s => !s)} />
        <Field id="pw2" label="Confirm password" value={pw2} onChange={setPw2}
          show={show} onToggle={() => setShow(s => !s)} />

        <p className="text-xs leading-relaxed text-muted-foreground">
          Must be 8+ characters and include upper &amp; lowercase letters, a number, and a special character.
        </p>

        <Button type="submit" size="lg" disabled={!ready || loading}
          className="h-14 w-full rounded-2xl gradient-primary text-base font-semibold text-primary-foreground shadow-elegant hover:opacity-95">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </MobileShell>
  );
}

function Field({ id, label, value, onChange, show, onToggle }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</label>
      <div className="glass-card group flex h-14 items-center gap-3 rounded-2xl px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground group-focus-within:text-primary"><Lock className="h-4 w-4" /></span>
        <input id={id} type={show ? "text" : "password"} value={value}
          onChange={(e) => onChange(e.target.value)} autoComplete="new-password"
          className="h-full flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          placeholder="••••••••" />
        <button type="button" onClick={onToggle}
          className="text-muted-foreground hover:text-foreground" aria-label={show ? "Hide" : "Show"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
