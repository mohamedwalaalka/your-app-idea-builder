import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RaadLogo } from "@/components/raad-logo";
import { MobileShell } from "@/components/mobile-shell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { friendlyAuthError, validateEmail } from "@/lib/password";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in to Raad" },
      { name: "description", content: "Sign in to your Raad account to keep tracking your finances." },
    ],
  }),
  component: Login,
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session, ready } = useAuth();

  // Already signed in? Go straight home.
  useEffect(() => {
    if (ready && session) navigate({ to: "/home", replace: true });
  }, [ready, session, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const emailCheck = validateEmail(email);
    if (!emailCheck.ok) return toast.error(emailCheck.message!);
    if (!password) return toast.error("Enter your password.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { toast.error(friendlyAuthError(error.message)); return; }
    toast.success("Welcome back");
    navigate({ to: "/home", replace: true });
  };

  const signInWithGoogle = async () => {
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) { toast.error(friendlyAuthError(res.error.message) || "Google sign-in failed"); return; }
      if (res.redirected) return;
      navigate({ to: "/home", replace: true });
    } catch (err) {
      toast.error(friendlyAuthError((err as Error).message));
    }
  };

  const resetPassword = async () => {
    const emailCheck = validateEmail(email);
    if (!emailCheck.ok) { toast.error("Enter your email above first"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(friendlyAuthError(error.message));
    else toast.success("Reset link sent — check your inbox");
  };


  return (
    <MobileShell withHero className="pb-10 pt-6">
      <div className="flex items-center justify-between">
        <Link to="/onboarding" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/60 text-foreground backdrop-blur transition-colors hover:bg-accent" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <RaadLogo size={32} />
      </div>

      <div className="mt-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">Sign in to pick up right where you left off.</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={signIn}>
        <Field id="email" label="Email" type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={setEmail} autoComplete="email" />
        <div className="space-y-2">
          <Field
            id="password" label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            icon={<Lock className="h-4 w-4" />}
            value={password} onChange={setPassword}
            autoComplete="current-password"
            trailing={
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-muted-foreground transition-colors hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="flex justify-end">
            <button type="button" onClick={resetPassword} className="text-sm font-semibold text-primary hover:underline">
              Forgot password?
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={loading}
          className="h-14 w-full rounded-2xl gradient-primary text-base font-semibold text-primary-foreground shadow-elegant hover:opacity-95">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button type="button" onClick={signInWithGoogle}
        className="glass-card flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="mt-auto pt-10 text-center text-sm text-muted-foreground">
        New to Raad?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </MobileShell>
  );
}

interface FieldProps {
  id: string; label: string; type: string; placeholder: string;
  icon: React.ReactNode; autoComplete?: string; trailing?: React.ReactNode;
  value: string; onChange: (v: string) => void;
}

function Field({ id, label, type, placeholder, icon, autoComplete, trailing, value, onChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">{label}</label>
      <div className="glass-card group flex h-14 items-center gap-3 rounded-2xl px-4 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground group-focus-within:text-primary">{icon}</span>
        <input id={id} type={type} placeholder={placeholder} autoComplete={autoComplete}
          value={value} onChange={(e) => onChange(e.target.value)}
          className="h-full flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none" />
        {trailing}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.3-.98 2.4-2.08 3.14l3.36 2.6c1.96-1.8 3.09-4.46 3.09-7.63 0-.74-.07-1.45-.19-2.13H12z" />
      <path fill="#34A853" d="M6.62 14.27l-.76.58-2.68 2.09C4.87 20.03 8.16 22 12 22c2.7 0 4.96-.9 6.62-2.44l-3.36-2.6c-.9.6-2.05.98-3.26.98-2.5 0-4.62-1.68-5.38-3.94z" />
      <path fill="#4A90E2" d="M3.18 7.06A9.94 9.94 0 0 0 2 12c0 1.6.38 3.12 1.06 4.47l3.44-2.67A5.98 5.98 0 0 1 6.18 12c0-.66.11-1.3.31-1.9L3.18 7.06z" />
      <path fill="#FBBC05" d="M12 6.15c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 3.15 14.7 2 12 2 8.16 2 4.87 3.97 3.18 7.06l3.31 2.56C7.24 7.66 9.36 6.15 12 6.15z" />
    </svg>
  );
}
