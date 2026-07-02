import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Raad" },
      {
        name: "description",
        content: "Understand where your money goes with clear charts and category breakdowns.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

const months = [
  { m: "Jan", income: 60, expense: 30 },
  { m: "Feb", income: 45, expense: 40 },
  { m: "Mar", income: 70, expense: 35 },
  { m: "Apr", income: 55, expense: 50 },
  { m: "May", income: 80, expense: 45 },
  { m: "Jun", income: 92, expense: 40 },
];

const categories = [
  { name: "Food & Groceries", amount: 420, pct: 32, tone: "var(--expense)" },
  { name: "Transport", amount: 180, pct: 14, tone: "var(--primary)" },
  { name: "Utilities", amount: 260, pct: 20, tone: "var(--income)" },
  { name: "Airtime & Data", amount: 90, pct: 7, tone: "var(--primary-glow)" },
  { name: "Other", amount: 350, pct: 27, tone: "oklch(0.7 0.05 220)" },
];

function AnalyticsPage() {
  return (
    <MobileShell withHero className="pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Insights</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Analytics
          </h1>
        </div>
        <span className="glass-card rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground">
          Last 6 months
        </span>
      </header>

      {/* KPI */}
      <section
        className="relative mt-5 overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-elegant"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl"
        />
        <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/80">
          Net savings
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
          ${currency(2890)}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/85">
          <TrendingUp className="h-3.5 w-3.5" /> +18.2% vs previous period
        </p>
      </section>

      {/* Chart */}
      <section className="glass-card mt-4 rounded-3xl p-5 shadow-card-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">
            Income vs Expenses
          </h2>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <Legend color="var(--income)" label="Income" />
            <Legend color="var(--expense)" label="Expense" />
          </div>
        </div>
        <div className="mt-5 flex h-40 items-end justify-between gap-2">
          {months.map((mo) => (
            <div key={mo.m} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-32 w-full items-end justify-center gap-1">
                <div
                  className="w-1/2 rounded-t-md"
                  style={{ height: `${mo.income}%`, background: "var(--income)" }}
                />
                <div
                  className="w-1/2 rounded-t-md"
                  style={{ height: `${mo.expense}%`, background: "var(--expense)" }}
                />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {mo.m}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Spending by category
            </h2>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <button type="button" className="text-sm font-semibold text-primary hover:underline">
            View all
          </button>
        </div>

        <ul className="mt-3 space-y-2.5">
          {categories.map((c) => (
            <li
              key={c.name}
              className="glass-card rounded-2xl p-4 shadow-card-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: `color-mix(in oklab, ${c.tone} 18%, transparent)`, color: c.tone }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.pct}% of spending</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">${currency(c.amount)}</p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.pct}%`, background: c.tone }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <BottomNav />
    </MobileShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
