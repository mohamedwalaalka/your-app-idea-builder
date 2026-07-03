import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  MoreHorizontal,
  Pencil,
  Smartphone,
  Tag,
  Trash2,
  MessageSquareText,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/transactions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Transaction ${params.id} — Raad` },
      {
        name: "description",
        content: "Detected mobile money transaction details with the original SMS.",
      },
    ],
  }),
  component: TransactionDetailsPage,
});

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

// Mock lookup — later this comes from the store / DB
const mockTxn = {
  id: "1",
  title: "Salary — Hormuud",
  provider: "EVC" as const,
  amount: 1200,
  kind: "income" as const,
  category: "Salary",
  date: "Jul 3, 2026",
  time: "09:12",
  reference: "TXN-EVC-9F82K1",
  sms:
    "EVCPlus: You have received $1,200.00 from HORMUUD TELECOM (Salary). New balance: $2,340.10. Ref: 9F82K1. Thank you for using EVCPlus.",
  sender: "EVCPlus",
};

function TransactionDetailsPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const txn = mockTxn;
  const isIncome = txn.kind === "income";

  return (
    <MobileShell className="pb-10 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.history.back()}
          className="glass-card grid h-11 w-11 place-items-center rounded-2xl text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Transaction
        </p>
        <button
          type="button"
          aria-label="More"
          className="glass-card grid h-11 w-11 place-items-center rounded-2xl text-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Amount hero */}
      <section className="mt-6 text-center">
        <span
          className={
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest " +
            (isIncome
              ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
              : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")
          }
        >
          {isIncome ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {isIncome ? "Income" : "Expense"}
        </span>
        <p
          className={
            "mt-3 font-display text-5xl font-extrabold tracking-tight " +
            (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")
          }
        >
          {isIncome ? "+" : "-"}${currency(txn.amount)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{txn.title}</p>
      </section>

      {/* Meta grid */}
      <section className="mt-8 grid grid-cols-2 gap-3">
        <MetaCard icon={<Smartphone className="h-4 w-4" />} label="Provider" value={txn.provider} />
        <MetaCard icon={<Tag className="h-4 w-4" />} label="Category" value={txn.category} />
        <MetaCard icon={<Calendar className="h-4 w-4" />} label="Date" value={txn.date} />
        <MetaCard icon={<Clock className="h-4 w-4" />} label="Time" value={txn.time} />
      </section>

      {/* Reference */}
      <div className="glass-card mt-3 flex items-center justify-between rounded-2xl px-4 py-3 shadow-card-soft">
        <span className="text-xs font-medium text-muted-foreground">Reference</span>
        <span className="font-mono text-xs font-semibold text-foreground">
          {txn.reference}
        </span>
      </div>

      {/* Original SMS */}
      <section className="mt-6">
        <h2 className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <MessageSquareText className="h-3.5 w-3.5" />
          Original SMS
        </h2>
        <div className="glass-card rounded-2xl p-4 shadow-card-soft">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{txn.sender}</span>
            <span className="text-[11px] text-muted-foreground">
              {txn.date} · {txn.time}
            </span>
          </div>
          <p className="rounded-xl bg-accent/60 p-3 text-[13px] leading-relaxed text-foreground">
            {txn.sms}
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/transactions" })}
          className="glass-card flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-foreground"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => router.history.back()}
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-[var(--expense)]"
          style={{
            background:
              "color-mix(in oklab, var(--expense) 12%, transparent)",
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </MobileShell>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-3.5 shadow-card-soft">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
