import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Bell, MessageSquareText, Plus, Smartphone,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { currency, formatRelative } from "@/lib/format";
import { SmsSimulator } from "@/components/sms-simulator";
import { TxnFormDialog } from "@/components/txn-form-dialog";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your money at a glance — Raad" },
      { name: "description", content: "See your current balance, mobile money income, and expenses in one calm dashboard." },
    ],
  }),
  component: Home,
});

function Home() {
  useRequireAuth();
  const { data: txns = [], isLoading } = useTransactions();
  const [smsOpen, setSmsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const { income, expenses, balance, thisMonth } = useMemo(() => {
    const now = new Date();
    const inMonth = (d: string) => {
      const t = new Date(d);
      return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
    };
    let inc = 0, exp = 0, mInc = 0, mExp = 0;
    for (const t of txns) {
      const a = Number(t.amount);
      if (t.kind === "income") { inc += a; if (inMonth(t.occurred_at)) mInc += a; }
      else { exp += a; if (inMonth(t.occurred_at)) mExp += a; }
    }
    return { income: inc, expenses: exp, balance: inc - exp, thisMonth: { inc: mInc, exp: mExp } };
  }, [txns]);

  const incPct = income + expenses === 0 ? 50 : Math.round((income / (income + expenses)) * 100);
  const recent = txns.slice(0, 5);
  const monthLabel = new Date().toLocaleDateString(undefined, { month: "long" });

  return (
    <MobileShell withHero className="pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary shadow-elegant">
            <span className="font-display text-lg font-extrabold text-primary-foreground">R</span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Welcome back</p>
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground">Your finances</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Simulate SMS" onClick={() => setSmsOpen(true)}
            className="glass-card relative grid h-11 w-11 place-items-center rounded-2xl text-foreground transition-colors hover:bg-accent">
            <MessageSquareText className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <Link to="/settings" aria-label="Settings"
            className="glass-card grid h-11 w-11 place-items-center rounded-2xl text-foreground transition-colors hover:bg-accent">
            <Bell className="h-4.5 w-4.5" />
          </Link>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <SummaryCard label="Total Income" amount={income} tone="income" icon={<ArrowUpRight className="h-4 w-4" />} sub={`This month +$${currency(thisMonth.inc)}`} />
        <SummaryCard label="Total Expenses" amount={expenses} tone="expense" icon={<ArrowDownRight className="h-4 w-4" />} sub={`This month -$${currency(thisMonth.exp)}`} />
      </section>

      <section className="relative mt-4 overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-elegant" style={{ background: "var(--gradient-primary)" }}>
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/15 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/80">Current balance</p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
              {balance < 0 ? "-" : ""}${currency(Math.abs(balance))}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Net this month · {thisMonth.inc - thisMonth.exp >= 0 ? "+" : "-"}${currency(Math.abs(thisMonth.inc - thisMonth.exp))}
            </p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">{monthLabel}</span>
        </div>
        <div className="relative mt-6">
          <div className="flex items-center justify-between text-[11px] font-medium text-primary-foreground/85">
            <span>Income</span><span>Expenses</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/20">
            <div className="h-full rounded-full bg-white" style={{ width: `${incPct}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold">
            <span>${currency(income)}</span><span>${currency(expenses)}</span>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Recent transactions</h2>
            <p className="text-xs text-muted-foreground">Detected from your SMS inbox</p>
          </div>
          <Link to="/transactions" className="text-sm font-semibold text-primary hover:underline">See all</Link>
        </div>

        {isLoading ? (
          <ul className="mt-3 space-y-2.5">
            {[0,1,2].map((i) => <li key={i} className="glass-card h-16 animate-pulse rounded-2xl" />)}
          </ul>
        ) : recent.length === 0 ? (
          <div className="glass-card mt-3 rounded-2xl p-6 text-center shadow-card-soft">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">No transactions yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Import a sample mobile money SMS to see automatic detection.
            </p>
            <button onClick={() => setSmsOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-elegant">
              <Plus className="h-3.5 w-3.5" /> Simulate SMS
            </button>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {recent.map((t) => <TransactionRow key={t.id} txn={t} />)}
          </ul>
        )}
      </section>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        aria-label="Add transaction"
        className="fixed bottom-24 right-1/2 z-50 mr-[-9rem] grid h-14 w-14 translate-x-1/2 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant transition-transform active:scale-95 sm:mr-[-11rem]"
      >
        <Plus className="h-6 w-6" />
      </button>

      <SmsSimulator open={smsOpen} onOpenChange={setSmsOpen} />
      <TxnFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <BottomNav />
    </MobileShell>
  );
}

function SummaryCard({ label, amount, tone, icon, sub }: {
  label: string; amount: number; tone: "income" | "expense"; icon: React.ReactNode; sub: string;
}) {
  const isIncome = tone === "income";
  return (
    <div className="glass-card rounded-2xl p-4 shadow-card-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <span className={
          "grid h-8 w-8 place-items-center rounded-full " +
          (isIncome
            ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
            : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")
        }>{icon}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground">${currency(amount)}</p>
      <p className={"mt-1 text-[11px] font-semibold " + (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")}>{sub}</p>
    </div>
  );
}

function TransactionRow({ txn }: { txn: { id: string; title: string; provider: string; occurred_at: string; amount: number; kind: "income" | "expense" } }) {
  const isIncome = txn.kind === "income";
  return (
    <li>
      <Link to="/transactions/$id" params={{ id: txn.id }} className="glass-card flex items-center gap-3 rounded-2xl p-3.5 shadow-card-soft transition-transform active:scale-[0.99]">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{txn.title}</p>
          <p className="text-[11px] text-muted-foreground">{txn.provider} · {formatRelative(txn.occurred_at)}</p>
        </div>
        <div className="text-right">
          <p className={"text-sm font-bold " + (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")}>
            {isIncome ? "+" : "-"}${currency(txn.amount)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {isIncome ? "Income" : "Expense"}
          </p>
        </div>
      </Link>
    </li>
  );
}
