import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Filter, Search, Smartphone } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Raad" },
      {
        name: "description",
        content:
          "Browse every mobile money transaction Raad detected from your SMS inbox.",
      },
    ],
  }),
  component: TransactionsPage,
});

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

type Txn = {
  id: string;
  title: string;
  provider: "EVC" | "Zaad" | "Sahal";
  time: string;
  amount: number;
  kind: "income" | "expense";
};

const groups: { label: string; items: Txn[] }[] = [
  {
    label: "Today",
    items: [
      { id: "1", title: "Salary — Hormuud", provider: "EVC", time: "09:12", amount: 1200, kind: "income" },
      { id: "2", title: "Grocery — Bakaaraha", provider: "EVC", time: "08:04", amount: 42, kind: "expense" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { id: "3", title: "Ride — Bajaj", provider: "Sahal", time: "19:44", amount: 6, kind: "expense" },
      { id: "4", title: "Freelance client", provider: "Zaad", time: "14:20", amount: 350, kind: "income" },
    ],
  },
  {
    label: "This week",
    items: [
      { id: "5", title: "Electricity — BECO", provider: "EVC", time: "Mon 10:02", amount: 78, kind: "expense" },
      { id: "6", title: "Top-up — Hormuud", provider: "EVC", time: "Sun 18:31", amount: 10, kind: "expense" },
    ],
  },
];

function TransactionsPage() {
  return (
    <MobileShell className="pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">All activity</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Transactions
          </h1>
        </div>
        <button
          type="button"
          aria-label="Filter"
          className="glass-card grid h-11 w-11 place-items-center rounded-2xl text-foreground"
        >
          <Filter className="h-4.5 w-4.5" />
        </button>
      </header>

      {/* Search */}
      <div className="glass-card mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card-soft">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search transactions"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Segmented filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {["All", "Income", "Expenses", "EVC", "Zaad", "Sahal"].map((chip, i) => (
          <button
            key={chip}
            type="button"
            className={
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
              (i === 0
                ? "gradient-primary text-primary-foreground shadow-elegant"
                : "glass-card text-muted-foreground")
            }
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Groups */}
      <div className="mt-6 space-y-6">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {g.label}
            </h2>
            <ul className="space-y-2.5">
              {g.items.map((t) => (
                <TransactionRow key={t.id} txn={t} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <BottomNav />
    </MobileShell>
  );
}

function TransactionRow({ txn }: { txn: Txn }) {
  const isIncome = txn.kind === "income";
  return (
    <li>
      <Link
        to="/transactions/$id"
        params={{ id: txn.id }}
        className="glass-card flex items-center gap-3 rounded-2xl p-3.5 shadow-card-soft transition-transform active:scale-[0.99]"
      >
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{txn.title}</p>
          <p className="text-[11px] text-muted-foreground">
            {txn.provider} · {txn.time}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={
              "grid h-7 w-7 place-items-center rounded-full " +
              (isIncome
                ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
                : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")
            }
          >
            {isIncome ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          </span>
          <p
            className={
              "text-sm font-bold " +
              (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")
            }
          >
            {isIncome ? "+" : "-"}${currency(txn.amount)}
          </p>
        </div>
      </Link>
    </li>
  );
}
