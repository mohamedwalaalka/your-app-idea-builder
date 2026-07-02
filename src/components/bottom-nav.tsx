import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Home as HomeIcon, Plus, Receipt, Settings as SettingsIcon } from "lucide-react";
import type { ReactNode } from "react";

type Tab = {
  to: "/home" | "/transactions" | "/analytics" | "/settings";
  label: string;
  icon: ReactNode;
};

const leftTabs: Tab[] = [
  { to: "/home", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
  { to: "/transactions", label: "Transactions", icon: <Receipt className="h-5 w-5" /> },
];

const rightTabs: Tab[] = [
  { to: "/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { to: "/settings", label: "Settings", icon: <SettingsIcon className="h-5 w-5" /> },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md items-center justify-around border-t border-border/70 bg-background/85 px-4 pb-4 pt-2 backdrop-blur-xl"
    >
      {leftTabs.map((t) => (
        <NavItem key={t.to} tab={t} active={pathname === t.to} />
      ))}
      <div className="relative w-14">
        <Link
          to="/home"
          aria-label="Add transaction"
          className="absolute -top-8 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
      {rightTabs.map((t) => (
        <NavItem key={t.to} tab={t} active={pathname === t.to} />
      ))}
    </nav>
  );
}

function NavItem({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <Link
      to={tab.to}
      className={
        "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold transition-colors " +
        (active ? "text-primary" : "text-muted-foreground")
      }
    >
      <span
        className={
          "grid h-9 w-9 place-items-center rounded-xl transition-colors " +
          (active ? "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]" : "")
        }
      >
        {tab.icon}
      </span>
      {tab.label}
    </Link>
  );
}
