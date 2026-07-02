import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RaadLogo } from "@/components/raad-logo";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Raad account" },
      {
        name: "description",
        content: "Create a free Raad account and start tracking your mobile money in minutes.",
      },
    ],
  }),
  component: Signup,
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMockAuth = () => {
    if (loading) return;
    setLoading(true);
    try {
      localStorage.setItem(
        "raad.mockUser",
        JSON.stringify({ name: "Amina", email: "amina@raad.app", createdAt: Date.now() }),
      );
    } catch {
      /* storage may be unavailable */
    }
    // Small delay for Material 3 emphasized easing feel
    window.setTimeout(() => {
      navigate({ to: "/home" });
    }, 320);
  };

  return (
    <MobileShell withHero className="pb-10 pt-6">
      <div className="flex items-center justify-between">
        <Link
          to="/onboarding"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/60 text-foreground backdrop-blur transition-colors hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <RaadLogo size={32} />
      </div>

      <div className="mt-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Track income and expenses automatically — it takes less than a minute.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleMockAuth();
        }}
      >
        <Field
          id="name"
          label="Full name"
          type="text"
          placeholder="Your name"
          icon={<User className="h-4 w-4" />}
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 8 characters"
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <p className="text-xs leading-relaxed text-muted-foreground">
          By continuing you agree to Raad's{" "}
          <span className="font-semibold text-foreground">Terms</span> and{" "}
          <span className="font-semibold text-foreground">Privacy Policy</span>.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="h-14 w-full rounded-2xl gradient-primary text-base font-semibold text-primary-foreground shadow-elegant transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:opacity-95 active:scale-[0.98] disabled:opacity-80"
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={handleMockAuth}
        className="glass-card flex w-full items-center justify-center gap-3 rounded-2xl py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <p className="mt-auto pt-10 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </MobileShell>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
  trailing?: React.ReactNode;
}

function Field({ id, label, type, placeholder, icon, autoComplete, trailing }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="glass-card group flex h-14 items-center gap-3 rounded-2xl px-4 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground group-focus-within:text-primary">{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-full flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        {trailing}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.3-.98 2.4-2.08 3.14l3.36 2.6c1.96-1.8 3.09-4.46 3.09-7.63 0-.74-.07-1.45-.19-2.13H12z"
      />
      <path
        fill="#34A853"
        d="M6.62 14.27l-.76.58-2.68 2.09C4.87 20.03 8.16 22 12 22c2.7 0 4.96-.9 6.62-2.44l-3.36-2.6c-.9.6-2.05.98-3.26.98-2.5 0-4.62-1.68-5.38-3.94z"
      />
      <path
        fill="#4A90E2"
        d="M3.18 7.06A9.94 9.94 0 0 0 2 12c0 1.6.38 3.12 1.06 4.47l3.44-2.67A5.98 5.98 0 0 1 6.18 12c0-.66.11-1.3.31-1.9L3.18 7.06z"
      />
      <path
        fill="#FBBC05"
        d="M12 6.15c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 3.15 14.7 2 12 2 8.16 2 4.87 3.97 3.18 7.06l3.31 2.56C7.24 7.66 9.36 6.15 12 6.15z"
      />
    </svg>
  );
}
