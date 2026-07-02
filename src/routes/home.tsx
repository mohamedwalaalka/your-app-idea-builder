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
  Smartphone,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your money at a glance — Raad" },
      {
        name: "description",
        content:
          "See your current balance, mobile money income, and expenses in one calm dashboard.",
      },
    ],
  }),
  component: Home,
});

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

type Txn = {
  id: string;
  title: string;
  provider: "EVC" | "Zaad" | "Sahal";
  date: string;
  amount: number;
  kind: "income" | "expense";
};

const transactions: Txn[] = [
  { id: "1", title: "Salary — Hormuud", provider: "EVC", date: "Today, 09:12", amount: 1200, kind: "income" },
  { id: "2", title: "Grocery — Bakaaraha", provider: "EVC", date: "Today, 08:04", amount: 42, kind: "expense" },
  { id: "3", title: "Ride — Bajaj", provider: "Sahal", date: "Yesterday, 19:44", amount: 6, kind: "expense" },
  { id: "4", title: "Freelance client", provider: "Zaad", date: "Yesterday, 14:20", amount: 350, kind: "income" },
  { id: "5", title: "Electricity — BECO", provider: "EVC", date: "Mon, 10:02", amount: 78, kind: "expense" },
];

function Home() {
  const income = 4820;
  const expenses = 1930;
  const balance = income - expenses;
  const incomePct = Math.round((income / (income + expenses)) * 100);

  return (
    <MobileShell withHero className="pb-28 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary shadow-elegant">
            <span className="font-display text-lg font-extrabold text-primary-foreground">R</span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Good morning</p>
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
              Amina
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="glass-card relative grid h-11 w-11 place-items-center rounded-2xl text-foreground transition-colors hover:bg-accent"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground ring-2 ring-background"
          >
            A
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        <SummaryCard
          label="Total Income"
          amount={income}
          tone="income"
          trend="+12.4%"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <SummaryCard
          label="Total Expenses"
          amount={expenses}
          tone="expense"
          trend="-3.2%"
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
      </section>

      {/* Dashboard hero card */}
      <section
        className="relative mt-4 overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-elegant"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/15 blur-3xl"
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/80">
              Current balance
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
              ${currency(balance)}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              Net this month · +${currency(income - expenses)}
            </p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest backdrop-blur">
            June
          </span>
        </div>

        {/* Bar */}
        <div className="relative mt-6">
          <div className="flex items-center justify-between text-[11px] font-medium text-primary-foreground/85">
            <span>Income</span>
            <span>Expenses</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${incomePct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-semibold">
            <span>${currency(income)}</span>
            <span>${currency(expenses)}</span>
          </div>
        </div>
      </section>

      {/* Recent transactions */}
      <section className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Recent transactions
            </h2>
            <p className="text-xs text-muted-foreground">Detected from your SMS inbox</p>
          </div>
          <button type="button" className="text-sm font-semibold text-primary hover:underline">
            See all
          </button>
        </div>

        <ul className="mt-3 space-y-2.5">
          {transactions.map((t) => (
            <TransactionRow key={t.id} txn={t} />
          ))}
        </ul>
      </section>

      {/* Bottom nav */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md items-center justify-around border-t border-border/70 bg-background/85 px-4 pb-4 pt-2 backdrop-blur-xl"
      >
        <NavItem icon={<HomeIcon className="h-5 w-5" />} label="Home" active />
        <NavItem icon={<Receipt className="h-5 w-5" />} label="Transactions" />
        <div className="relative w-14">
          <Link
            to="/home"
            aria-label="Add transaction"
            className="absolute -top-8 left-1/2 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant transition-transform active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>
        <NavItem icon={<BarChart3 className="h-5 w-5" />} label="Analytics" />
        <NavItem icon={<SettingsIcon className="h-5 w-5" />} label="Settings" />
      </nav>
    </MobileShell>
  );
}

function SummaryCard({
  label,
  amount,
  tone,
  trend,
  icon,
}: {
  label: string;
  amount: number;
  tone: "income" | "expense";
  trend: string;
  icon: React.ReactNode;
}) {
  const isIncome = tone === "income";
  return (
    <div className="glass-card rounded-2xl p-4 shadow-card-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <span
          className={
            "grid h-8 w-8 place-items-center rounded-full " +
            (isIncome
              ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
              : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")
          }
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground">
        ${currency(amount)}
      </p>
      <p
        className={
          "mt-1 text-[11px] font-semibold " +
          (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")
        }
      >
        {trend} vs last month
      </p>
    </div>
  );
}

function TransactionRow({ txn }: { txn: Txn }) {
  const isIncome = txn.kind === "income";
  return (
    <li className="glass-card flex items-center gap-3 rounded-2xl p-3.5 shadow-card-soft">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Smartphone className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{txn.title}</p>
        <p className="text-[11px] text-muted-foreground">
          {txn.provider} · {txn.date}
        </p>
      </div>
      <div className="text-right">
        <p
          className={
            "text-sm font-bold " +
            (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")
          }
        >
          {isIncome ? "+" : "-"}${currency(txn.amount)}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {isIncome ? "Income" : "Expense"}
        </p>
      </div>
    </li>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold " +
        (active ? "text-primary" : "text-muted-foreground")
      }
    >
      <span
        className={
          "grid h-9 w-9 place-items-center rounded-xl transition-colors " +
          (active ? "bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]" : "")
        }
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
