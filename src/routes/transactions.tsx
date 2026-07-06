import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, Search, Smartphone } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { BottomNav } from "@/components/bottom-nav";
import { useRequireAuth } from "@/hooks/use-auth";
import { useTransactions, type Transaction } from "@/hooks/use-transactions";
import { currency, formatRelative } from "@/lib/format";
import { TxnFormDialog } from "@/components/txn-form-dialog";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Raad Income Tracker" },
      { name: "description", content: "Browse every mobile money transaction Raad detected from your SMS inbox." },
      { property: "og:title", content: "Transactions — Raad Income Tracker" },
      { property: "og:description", content: "Browse every mobile money transaction Raad detected from your SMS inbox." },
      { property: "og:url", content: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/transactions" },
      { name: "twitter:title", content: "Transactions — Raad Income Tracker" },
      { name: "twitter:description", content: "Browse every mobile money transaction Raad detected from your SMS inbox." },
    ],
    links: [{ rel: "canonical", href: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/transactions" }],
  }),
  component: TransactionsPage,
});

type Filter = "All" | "Income" | "Expenses" | "EVC" | "Zaad" | "Sahal";

function TransactionsPage() {
  useRequireAuth();
  const { data: txns = [], isLoading } = useTransactions();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return txns.filter((t) => {
      if (filter === "Income" && t.kind !== "income") return false;
      if (filter === "Expenses" && t.kind !== "expense") return false;
      if (filter === "EVC" || filter === "Zaad" || filter === "Sahal") {
        if (t.provider !== filter) return false;
      }
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q) ||
        String(t.amount).includes(q) ||
        (t.reference?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [txns, query, filter]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const chips: Filter[] = ["All", "Income", "Expenses", "EVC", "Zaad", "Sahal"];

  return (
    <MobileShell className="pb-28 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">All activity</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Transactions</h1>
        </div>
        <button type="button" aria-label="Add" onClick={() => setAddOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <div className="glass-card mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card-soft">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, category, amount…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {chips.map((chip) => (
          <button key={chip} type="button" onClick={() => setFilter(chip)}
            className={
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
              (filter === chip
                ? "gradient-primary text-primary-foreground shadow-elegant"
                : "glass-card text-muted-foreground")
            }>
            {chip}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ul className="mt-6 space-y-2.5">{[0,1,2,3].map((i) => <li key={i} className="glass-card h-16 animate-pulse rounded-2xl" />)}</ul>
      ) : groups.length === 0 ? (
        <div className="glass-card mt-8 rounded-2xl p-6 text-center shadow-card-soft">
          <p className="text-sm font-semibold text-foreground">No transactions found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{g.label}</h2>
              <ul className="space-y-2.5">
                {g.items.map((t) => <TransactionRow key={t.id} txn={t} />)}
              </ul>
            </section>
          ))}
        </div>
      )}

      <TxnFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <BottomNav />
    </MobileShell>
  );
}

function groupByDay(txns: Transaction[]) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = startOfDay(now);
  const buckets: Record<string, Transaction[]> = {};
  const order: string[] = [];
  for (const t of txns) {
    const d = new Date(t.occurred_at);
    const days = Math.round((today - startOfDay(d)) / 86400000);
    const label = days === 0 ? "Today" : days === 1 ? "Yesterday" : days < 7 ? "This week" : days < 30 ? "This month" : "Earlier";
    if (!(label in buckets)) { buckets[label] = []; order.push(label); }
    buckets[label].push(t);
  }
  return order.map((label) => ({ label, items: buckets[label] }));
}

function TransactionRow({ txn }: { txn: Transaction }) {
  const isIncome = txn.kind === "income";
  return (
    <li>
      <Link to="/transactions/$id" params={{ id: txn.id }}
        className="glass-card flex items-center gap-3 rounded-2xl p-3.5 shadow-card-soft transition-transform active:scale-[0.99]">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{txn.title}</p>
          <p className="text-[11px] text-muted-foreground">{txn.provider} · {txn.category} · {formatRelative(txn.occurred_at)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={"grid h-7 w-7 place-items-center rounded-full " +
            (isIncome
              ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
              : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")}>
            {isIncome ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          </span>
          <p className={"text-sm font-bold " + (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")}>
            {isIncome ? "+" : "-"}${currency(txn.amount)}
          </p>
        </div>
      </Link>
    </li>
  );
}
