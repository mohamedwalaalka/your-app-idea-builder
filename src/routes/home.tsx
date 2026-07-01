import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Home as HomeIcon,
  Plus,
  Receipt,
  Settings as SettingsIcon,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { RaadLogo } from "@/components/raad-logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Raad" },
      {
        name: "description",
        content:
          "Your Raad dashboard: current balance, monthly income and expenses, and recent mobile money activity at a glance.",
      },
    ],
  }),
  component: HomePage,
});

const currency = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

interface Transaction {
  id: string;
  title: string;
  provider: string;
  providerInitials: string;
  providerTone: "evc" | "zaad" | "sahal" | "cash";
  when: string;
  amount: number;
  type: "income" | "expense";
}

const transactions: Transaction[] = [
  { id: "1", title: "Payment from Ayaan", provider: "EVC Plus", providerInitials: "EV", providerTone: "evc", when: "Today • 10:24", amount: 120, type: "income" },
  { id: "2", title: "Bakaaraha Market", provider: "EVC Plus", providerInitials: "EV", providerTone: "evc", when: "Today • 09:02", amount: 34, type: "expense" },
  { id: "3", title: "Somtel Airtime", provider: "Zaad", providerInitials: "ZD", providerTone: "zaad", when: "Yesterday", amount: 5, type: "expense" },
  { id: "4", title: "Salary — Hormuud", provider: "Sahal", providerInitials: "SH", providerTone: "sahal", when: "Mon", amount: 850, type: "income" },
  { id: "5", title: "Taxi ride", provider: "Cash", providerInitials: "C", providerTone: "cash", when: "Sun", amount: 8, type: "expense" },
];

function HomePage() {
  const income = 2480;
  const expenses = 1215;
  const balance = income - expenses;
  const incomePct = Math.round((income / (income + expenses)) * 100);
  const expensePct = 100 - incomePct;

  return (
    <MobileShell withHero className="pb-28">
      <Header />

      <div className="mt-6 grid grid-cols-2 gap-3">
        <SummaryCard
          label="Total Income"
          amount={currency(income)}
          hint="This month"
          tone="income"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <SummaryCard
          label="Total Expenses"
          amount={currency(expenses)}
          hint="This month"
          tone="expense"
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
      </div>

      <BalanceCard
        balance={currency(balance)}
        net={currency(income - expenses)}
        income={income}
        expenses={expenses}
        incomePct={incomePct}
        expensePct={expensePct}
      />

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-foreground">
            Recent transactions
          </h2>
          <Link
            to="/home"
            className="text-sm font-medium text-primary hover:opacity-80"
          >
            See all
          </Link>
        </div>

        <ul className="space-y-2">
          {transactions.map((t) => (
            <TransactionRow key={t.id} tx={t} />
          ))}
        </ul>
      </section>

      <FloatingAddButton />
      <BottomNav />
    </MobileShell>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between pt-6">
      <div className="flex items-center gap-3">
        <RaadLogo size={40} showWordmark={false} />
        <div>
          <p className="text-xs text-muted-foreground">Good morning</p>
          <p className="font-display text-base font-semibold text-foreground">
            Cabdi Faarax
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <div
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-semibold text-primary-foreground shadow-elegant"
        >
          CF
        </div>
      </div>
    </header>
  );
}

interface SummaryCardProps {
  label: string;
  amount: string;
  hint: string;
  tone: "income" | "expense";
  icon: ReactNode;
}

function SummaryCard({ label, amount, hint, tone, icon }: SummaryCardProps) {
  const isIncome = tone === "income";
  return (
    <div className="glass-card shadow-card-soft rounded-3xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            isIncome
              ? "bg-[color:var(--income)]/12 text-[color:var(--income)]"
              : "bg-[color:var(--expense)]/12 text-[color:var(--expense)]",
          )}
          style={{
            backgroundColor: isIncome
              ? "color-mix(in oklab, var(--income) 14%, transparent)"
              : "color-mix(in oklab, var(--expense) 14%, transparent)",
            color: isIncome ? "var(--income)" : "var(--expense)",
          }}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
        {amount}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

interface BalanceCardProps {
  balance: string;
  net: string;
  income: number;
  expenses: number;
  incomePct: number;
  expensePct: number;
}

function BalanceCard({ balance, net, incomePct, expensePct }: BalanceCardProps) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-[28px] p-5 text-primary-foreground shadow-elegant gradient-primary">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-black/10 blur-2xl"
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 opacity-90" />
          <span className="text-xs font-medium uppercase tracking-wider opacity-90">
            Current balance
          </span>
        </div>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
          This month
        </span>
      </div>

      <p className="relative mt-3 font-display text-[38px] font-extrabold leading-none tracking-tight">
        {balance}
      </p>
      <p className="relative mt-1 text-xs opacity-90">Net income {net}</p>

      <div className="relative mt-5">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-l-full bg-white"
            style={{ width: `${incomePct}%` }}
          />
          <div
            className="h-full bg-black/25"
            style={{ width: `${expensePct}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="opacity-90">Income</span>
            <span className="font-semibold">{incomePct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-black/40" />
            <span className="opacity-90">Expenses</span>
            <span className="font-semibold">{expensePct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const providerStyles: Record<Transaction["providerTone"], string> = {
  evc: "bg-emerald-500/12 text-emerald-600",
  zaad: "bg-sky-500/12 text-sky-600",
  sahal: "bg-amber-500/12 text-amber-600",
  cash: "bg-muted text-muted-foreground",
};

function TransactionRow({ tx }: { tx: Transaction }) {
  const isIncome = tx.type === "income";
  return (
    <li className="glass-card shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold",
          providerStyles[tx.providerTone],
        )}
      >
        {tx.providerInitials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {tx.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {tx.provider} • {tx.when}
        </p>
      </div>
      <div
        className="text-right font-display text-sm font-bold"
        style={{ color: isIncome ? "var(--income)" : "var(--expense)" }}
      >
        {isIncome ? "+" : "−"}
        {currency(tx.amount)}
      </div>
    </li>
  );
}

function FloatingAddButton() {
  return (
    <button
      type="button"
      aria-label="Add transaction"
      className="fixed bottom-24 left-1/2 z-30 flex h-14 w-14 -translate-x-[calc(-50%+9rem)] items-center justify-center rounded-2xl text-primary-foreground shadow-elegant gradient-primary transition active:scale-95"
      style={{ transform: "translateX(calc(11rem))" }}
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}

const navItems = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Transactions", icon: Receipt, active: false },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: SettingsIcon, active: false },
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
      <div className="glass-card shadow-elegant flex w-full max-w-md items-center justify-around rounded-2xl px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition",
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={item.active ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
