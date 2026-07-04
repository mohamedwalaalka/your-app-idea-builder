import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES, PROVIDERS,
  useCreateTransaction, useUpdateTransaction,
  type Transaction, type TxnCategory, type TxnKind, type TxnProvider,
} from "@/hooks/use-transactions";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Transaction | null;
}

export function TxnFormDialog({ open, onOpenChange, initial }: Props) {
  const isEdit = !!initial;
  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<TxnKind>("expense");
  const [category, setCategory] = useState<TxnCategory>("Other");
  const [provider, setProvider] = useState<TxnProvider>("EVC");
  const [occurredAt, setOccurredAt] = useState<string>(() =>
    new Date().toISOString().slice(0, 16),
  );
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setTitle(initial.title);
      setAmount(String(initial.amount));
      setKind(initial.kind);
      setCategory(initial.category);
      setProvider(initial.provider);
      setOccurredAt(new Date(initial.occurred_at).toISOString().slice(0, 16));
      setNote(initial.note ?? "");
    } else {
      setTitle(""); setAmount(""); setKind("expense");
      setCategory("Other"); setProvider("EVC");
      setOccurredAt(new Date().toISOString().slice(0, 16));
      setNote("");
    }
  }, [open, initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!title.trim() || !isFinite(amt) || amt <= 0) {
      toast.error("Please enter a title and a positive amount");
      return;
    }
    const payload = {
      amount: amt, kind, category, provider,
      title: title.trim(), note: note.trim() || null,
      occurred_at: new Date(occurredAt).toISOString(),
    };
    try {
      if (isEdit && initial) {
        await update.mutateAsync({ id: initial.id, patch: payload });
        toast.success("Transaction updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Transaction added");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit transaction" : "Add transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={kind === "income" ? "default" : "outline"}
              onClick={() => setKind("income")}
              className={kind === "income" ? "bg-[var(--income)] hover:bg-[var(--income)]/90" : ""}
            >
              Income
            </Button>
            <Button
              type="button"
              variant={kind === "expense" ? "default" : "outline"}
              onClick={() => setKind("expense")}
              className={kind === "expense" ? "bg-[var(--expense)] hover:bg-[var(--expense)]/90" : ""}
            >
              Expense
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Grocery — Bakaaraha" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amt">Amount</Label>
              <Input id="amt" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="when">Date & time</Label>
              <Input id="when" type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TxnCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as TxnProvider)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {isEdit ? "Save changes" : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
