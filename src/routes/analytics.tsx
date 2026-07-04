import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, TrendingUp, ChevronDown } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions, type Transaction } from "@/hooks/use-transactions";
import { currency } from "@/lib/format";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Raad" },
      { name: "description", content: "Understand where your money goes with clear charts and category breakdowns." },
    ],
  }),
  component: AnalyticsPage,
});

const RANGES = [
  "Today","This Week","This Month","Last 3 Months","Last 6 Months","Last Year","All Time",
] as const;
type Range = typeof RANGES[number];

function rangeStart(range: Range): Date | null {
  const now = new Date();
  const d = new Date(now);
  switch (range) {
    case "Today": return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "This Week": {
      const day = now.getDay(); // 0=Sun
      const diff = (day + 6) % 7; // Monday start
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    }
    case "This Month": return new Date(now.getFullYear(), now.getMonth(), 1);
    case "Last 3 Months": d.setMonth(d.getMonth() - 3); return d;
    case "Last 6 Months": d.setMonth(d.getMonth() - 6); return d;
    case "Last Year": d.setFullYear(d.getFullYear() - 1); return d;
    case "All Time": return null;
  }
}

function AnalyticsPage() {
  useRequireAuth();
  const { data: txns = [] } = useTransactions();
  const [range, setRange] = useState<Range>("Last 6 Months");

  const filtered = useMemo(() => {
    const start = rangeStart(range);
    if (!start) return txns;
    const t = start.getTime();
    return txns.filter((x) => new Date(x.occurred_at).getTime() >= t);
  }, [txns, range]);

  const { income, expenses, months, categories } = useMemo(() => {
    let inc = 0, exp = 0;
    const cat: Record<string, number> = {};
    const byMonth: Record<string, { income: number; expense: number }> = {};
    for (const t of filtered) {
      const a = Number(t.amount);
      if (t.kind === "income") inc += a; else { exp += a; cat[t.category] = (cat[t.category] ?? 0) + a; }
      const key = new Date(t.occurred_at).toLocaleDateString(undefined, { month: "short" });
      byMonth[key] ??= { income: 0, expense: 0 };
      if (t.kind === "income") byMonth[key].income += a; else byMonth[key].expense += a;
    }
    const monthEntries = Object.entries(byMonth).slice(-6);
    const max = Math.max(1, ...monthEntries.flatMap(([, v]) => [v.income, v.expense]));
    const months = monthEntries.map(([m, v]) => ({ m, income: (v.income / max) * 100, expense: (v.expense / max) * 100 }));
    const total = Object.values(cat).reduce((s, n) => s + n, 0) || 1;
    const palette = ["var(--expense)", "var(--primary)", "var(--income)", "var(--primary-glow)", "oklch(0.7 0.05 220)"];
    const categories = Object.entries(cat)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount], i) => ({ name, amount, pct: Math.round((amount / total) * 100), tone: palette[i % palette.length] }));
    return { income: inc, expenses: exp, months, categories };
  }, [filtered]);

  const net = income - expenses;

  return (
    <MobileShell withHero className="pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Insights</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Analytics</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="glass-card inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-foreground">
            {range} <ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {RANGES.map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRange(r)}>{r}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section className="relative mt-5 overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-elegant" style={{ background: "var(--gradient-primary)" }}>
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/80">Net savings</p>
        <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
          {net < 0 ? "-" : ""}${currency(Math.abs(net))}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/85">
          <TrendingUp className="h-3.5 w-3.5" /> {range}
        </p>
      </section>

      <section className="glass-card mt-4 rounded-3xl p-5 shadow-card-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground">Income vs Expenses</h2>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <Legend color="var(--income)" label="Income" />
            <Legend color="var(--expense)" label="Expense" />
          </div>
        </div>
        {months.length === 0 ? (
          <p className="mt-6 text-center text-xs text-muted-foreground">No data in this range yet.</p>
        ) : (
          <div className="mt-5 flex h-40 items-end justify-between gap-2">
            {months.map((mo) => (
              <div key={mo.m} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-32 w-full items-end justify-center gap-1">
                  <div className="w-1/2 rounded-t-md" style={{ height: `${mo.income}%`, background: "var(--income)" }} />
                  <div className="w-1/2 rounded-t-md" style={{ height: `${mo.expense}%`, background: "var(--expense)" }} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{mo.m}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Spending by category</h2>
            <p className="text-xs text-muted-foreground">{range}</p>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">No expenses to break down yet.</p>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {categories.map((c) => (
              <li key={c.name} className="glass-card rounded-2xl p-4 shadow-card-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl"
                      style={{ background: `color-mix(in oklab, ${c.tone} 18%, transparent)`, color: c.tone }}>
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
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.tone }} />
                </div>
              </li>
            ))}
          </ul>
        )}
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
