import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Lock,
  LogOut,
  MessageSquare,
  Moon,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Raad" },
      {
        name: "description",
        content: "Manage your Raad profile, SMS permissions, security, and preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

type Row = {
  icon: ReactNode;
  label: string;
  hint?: string;
  trailing?: ReactNode;
};

function SettingsPage() {
  const navigate = useNavigate();

  const account: Row[] = [
    { icon: <User className="h-4.5 w-4.5" />, label: "Profile", hint: "Name, phone, avatar" },
    { icon: <CreditCard className="h-4.5 w-4.5" />, label: "Linked accounts", hint: "EVC, Zaad, Sahal" },
    { icon: <MessageSquare className="h-4.5 w-4.5" />, label: "SMS permissions", hint: "Manage detection" },
  ];

  const preferences: Row[] = [
    { icon: <Bell className="h-4.5 w-4.5" />, label: "Notifications", hint: "Alerts & summaries" },
    { icon: <Moon className="h-4.5 w-4.5" />, label: "Appearance", hint: "Light · Dark · System" },
    { icon: <Sparkles className="h-4.5 w-4.5" />, label: "Categories", hint: "Auto-tagging rules" },
  ];

  const security: Row[] = [
    { icon: <Lock className="h-4.5 w-4.5" />, label: "App lock", hint: "PIN & biometrics" },
    { icon: <Shield className="h-4.5 w-4.5" />, label: "Privacy", hint: "Data stays on device" },
    { icon: <HelpCircle className="h-4.5 w-4.5" />, label: "Help & support" },
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("raad_user");
    navigate({ to: "/login" });
  };

  return (
    <MobileShell withHero className="pb-28 pt-6">
      <header>
        <p className="text-xs font-medium text-muted-foreground">Account</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Settings
        </h1>
      </header>

      {/* Profile card */}
      <section
        className="relative mt-5 overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-elegant"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl"
        />
        <div className="relative flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 font-display text-xl font-extrabold backdrop-blur">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold">Amina Yusuf</p>
            <p className="truncate text-xs text-primary-foreground/85">
              amina@raad.so · +252 61 000 0000
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest backdrop-blur"
          >
            Edit
          </button>
        </div>
      </section>

      <Group title="Account" rows={account} />
      <Group title="Preferences" rows={preferences} />
      <Group title="Security" rows={security} />

      <button
        type="button"
        onClick={handleLogout}
        className="glass-card mt-6 flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold text-[var(--expense)] shadow-card-soft"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Raad · v0.1.0 · Made for Somalia
      </p>

      <BottomNav />
    </MobileShell>
  );
}

function Group({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <ul className="glass-card overflow-hidden rounded-2xl shadow-card-soft">
        {rows.map((r, i) => (
          <li key={r.label}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/60"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary">
                {r.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{r.label}</span>
                {r.hint && (
                  <span className="block text-[11px] text-muted-foreground">{r.hint}</span>
                )}
              </span>
              {r.trailing ?? <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
            {i < rows.length - 1 && <div className="mx-4 h-px bg-border/60" />}
          </li>
        ))}
      </ul>
    </section>
  );
}
