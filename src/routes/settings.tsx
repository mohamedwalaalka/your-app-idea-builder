import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell, ChevronRight, Globe, HelpCircle, Lock, LogOut, MessageSquare,
  Moon, Shield, Sparkles, User,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";


export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Raad Income Tracker" },
      { name: "description", content: "Manage your Raad profile, SMS permissions, security, and preferences." },
      { property: "og:title", content: "Settings — Raad Income Tracker" },
      { property: "og:description", content: "Manage your Raad profile, SMS permissions, security, and preferences." },
      { property: "og:url", content: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/settings" },
      { name: "twitter:title", content: "Settings — Raad Income Tracker" },
      { name: "twitter:description", content: "Manage your Raad profile, SMS permissions, security, and preferences." },
    ],
    links: [{ rel: "canonical", href: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/settings" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  useRequireAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggle: toggleDark } = useTheme();
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState(true);
  useEffect(() => {
    const v = localStorage.getItem("raad.notifications");
    if (v !== null) setNotifications(v === "1");
  }, []);
  const toggleNotifications = (v: boolean) => {
    setNotifications(v);
    localStorage.setItem("raad.notifications", v ? "1" : "0");
    toast.success(v ? "Notifications enabled" : "Notifications muted");
  };

  const handleLogout = async () => {
    // Sign-out hygiene: cancel in-flight, clear cache, sign out, then navigate.
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  };


  const displayName =
    (user?.user_metadata as any)?.display_name || user?.email?.split("@")[0] || "You";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <MobileShell withHero className="pb-28 pt-6">
      <header>
        <p className="text-xs font-medium text-muted-foreground">Account</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Settings</h1>
      </header>

      <section className="relative mt-5 overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-elegant"
        style={{ background: "var(--gradient-primary)" }}>
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 font-display text-xl font-extrabold backdrop-blur">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold">{displayName}</p>
            <p className="truncate text-xs text-primary-foreground/85">{user?.email ?? ""}</p>
          </div>
        </div>
      </section>

      <Group title="Account">
        <RowLink icon={<User className="h-4.5 w-4.5" />} label="Profile" hint="Name, phone, avatar" />
        <RowLink icon={<MessageSquare className="h-4.5 w-4.5" />} label="SMS permissions"
          hint="Manage automatic detection" onClick={() => navigate({ to: "/sms-permission" })} />
      </Group>

      <Group title="Preferences">
        <RowToggle icon={<Bell className="h-4.5 w-4.5" />} label="Notifications"
          hint="New transactions & summaries" checked={notifications} onChange={toggleNotifications} />
        <RowToggle icon={<Moon className="h-4.5 w-4.5" />} label="Dark mode"
          hint="Match your device" checked={isDark} onChange={toggleDark} />
        <RowLink icon={<Globe className="h-4.5 w-4.5" />} label="Language" hint="English · Somali" />
        <RowLink icon={<Sparkles className="h-4.5 w-4.5" />} label="Categories" hint="Auto-tagging rules" />
      </Group>

      <Group title="Security & About">
        <RowLink icon={<Lock className="h-4.5 w-4.5" />} label="App lock" hint="PIN & biometrics" />
        <RowLink icon={<Shield className="h-4.5 w-4.5" />} label="Privacy" hint="Data stays yours" />
        <RowLink icon={<HelpCircle className="h-4.5 w-4.5" />} label="About Raad" hint="v0.1.0 · Made for Somalia" />
      </Group>

      <button type="button" onClick={handleLogout}
        className="glass-card mt-6 flex w-full items-center justify-center gap-2 rounded-2xl p-4 text-sm font-bold text-[var(--expense)] shadow-card-soft">
        <LogOut className="h-4 w-4" /> Log out
      </button>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">Raad · v0.1.0 · Made for Somalia</p>
      <BottomNav />
    </MobileShell>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <ul className="glass-card overflow-hidden rounded-2xl shadow-card-soft divide-y divide-border/60">{children}</ul>
    </section>
  );
}

function RowLink({ icon, label, hint, onClick }: { icon: ReactNode; label: string; hint?: string; onClick?: () => void }) {
  return (
    <li>
      <button type="button" onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/60">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{label}</span>
          {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    </li>
  );
}

function RowToggle({ icon, label, hint, checked, onChange }: {
  icon: ReactNode; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex w-full items-center gap-3 px-4 py-3.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-primary">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </li>
  );
}
