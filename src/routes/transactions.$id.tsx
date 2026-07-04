import { createFileRoute, useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, ArrowDownRight, ArrowUpRight, Calendar, Clock,
  MessageSquareText, Pencil, Smartphone, Tag, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/mobile-shell";
import { useRequireAuth } from "@/hooks/use-auth";
import { useDeleteTransaction, useTransaction } from "@/hooks/use-transactions";
import { currency, formatDate, formatTime } from "@/lib/format";
import { TxnFormDialog } from "@/components/txn-form-dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/transactions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Transaction — Raad` },
      { name: "description", content: "Detected mobile money transaction details with the original SMS." },
    ],
  }),
  component: TransactionDetailsPage,
});

function TransactionDetailsPage() {
  useRequireAuth();
  const { id } = useParams({ from: "/transactions/$id" });
  const router = useRouter();
  const navigate = useNavigate();
  const { data: txn, isLoading } = useTransaction(id);
  const del = useDeleteTransaction();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return <MobileShell className="pb-10 pt-6"><div className="glass-card mt-10 h-64 animate-pulse rounded-3xl" /></MobileShell>;
  }
  if (!txn) {
    return (
      <MobileShell className="pb-10 pt-6">
        <p className="mt-10 text-center text-sm text-muted-foreground">Transaction not found.</p>
      </MobileShell>
    );
  }

  const isIncome = txn.kind === "income";

  const handleDelete = async () => {
    try {
      await del.mutateAsync(txn.id);
      toast.success("Transaction deleted");
      navigate({ to: "/transactions" });
    } catch (e: any) { toast.error(e?.message ?? "Delete failed"); }
  };

  return (
    <MobileShell className="pb-10 pt-6">
      <header className="flex items-center justify-between">
        <button type="button" aria-label="Back" onClick={() => router.history.back()}
          className="glass-card grid h-11 w-11 place-items-center rounded-2xl text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Transaction</p>
        <span className="h-11 w-11" />
      </header>

      <section className="mt-6 text-center">
        <span className={
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest " +
          (isIncome
            ? "bg-[color-mix(in_oklab,var(--income)_15%,transparent)] text-[var(--income)]"
            : "bg-[color-mix(in_oklab,var(--expense)_15%,transparent)] text-[var(--expense)]")
        }>
          {isIncome ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {isIncome ? "Income" : "Expense"}
        </span>
        <p className={"mt-3 font-display text-5xl font-extrabold tracking-tight " + (isIncome ? "text-[var(--income)]" : "text-[var(--expense)]")}>
          {isIncome ? "+" : "-"}${currency(Number(txn.amount))}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{txn.title}</p>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        <MetaCard icon={<Smartphone className="h-4 w-4" />} label="Provider" value={txn.provider} />
        <MetaCard icon={<Tag className="h-4 w-4" />} label="Category" value={txn.category} />
        <MetaCard icon={<Calendar className="h-4 w-4" />} label="Date" value={formatDate(txn.occurred_at)} />
        <MetaCard icon={<Clock className="h-4 w-4" />} label="Time" value={formatTime(txn.occurred_at)} />
      </section>

      {txn.reference && (
        <div className="glass-card mt-3 flex items-center justify-between rounded-2xl px-4 py-3 shadow-card-soft">
          <span className="text-xs font-medium text-muted-foreground">Reference</span>
          <span className="font-mono text-xs font-semibold text-foreground">{txn.reference}</span>
        </div>
      )}

      {txn.note && (
        <section className="mt-6">
          <h2 className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <MessageSquareText className="h-3.5 w-3.5" /> {txn.sms_hash ? "Original SMS" : "Note"}
          </h2>
          <div className="glass-card rounded-2xl p-4 shadow-card-soft">
            <p className="rounded-xl bg-accent/60 p-3 text-[13px] leading-relaxed text-foreground">{txn.note}</p>
          </div>
        </section>
      )}

      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => setEditOpen(true)}
          className="glass-card flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-foreground">
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button type="button" onClick={() => setConfirmOpen(true)}
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-[var(--expense)]"
          style={{ background: "color-mix(in oklab, var(--expense) 12%, transparent)" }}>
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>

      <TxnFormDialog open={editOpen} onOpenChange={setEditOpen} initial={txn} />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function MetaCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-3.5 shadow-card-soft">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
