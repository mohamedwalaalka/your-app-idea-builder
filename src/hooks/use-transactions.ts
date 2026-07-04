import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hashSms, parseSms } from "@/lib/sms-parser";

export type TxnKind = "income" | "expense";
export type TxnProvider = "EVC" | "Zaad" | "Sahal" | "Other";
export type TxnCategory =
  | "Food" | "Transport" | "Shopping" | "Bills" | "Salary" | "Transfer"
  | "Business" | "Education" | "Health" | "Airtime" | "Other";

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  kind: TxnKind;
  category: TxnCategory;
  provider: TxnProvider;
  title: string;
  note: string | null;
  reference: string | null;
  sms_hash: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export const CATEGORIES: TxnCategory[] = [
  "Food","Transport","Shopping","Bills","Salary","Transfer",
  "Business","Education","Health","Airtime","Other",
];
export const PROVIDERS: TxnProvider[] = ["EVC","Zaad","Sahal","Other"];

const txnKey = ["transactions"] as const;

export function useTransactions() {
  return useQuery({
    queryKey: txnKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("occurred_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Transaction[];
    },
  });
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ["transactions", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Transaction | null;
    },
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      amount: number; kind: TxnKind; category: TxnCategory; provider: TxnProvider;
      title: string; note?: string | null; reference?: string | null; occurred_at?: string;
      sms_hash?: string | null;
    }) => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: uid,
          amount: input.amount,
          kind: input.kind,
          category: input.category,
          provider: input.provider,
          title: input.title,
          note: input.note ?? null,
          reference: input.reference ?? null,
          sms_hash: input.sms_hash ?? null,
          occurred_at: input.occurred_at ?? new Date().toISOString(),
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: txnKey });
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Transaction> }) => {
      const { error } = await supabase.from("transactions").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: txnKey });
      qc.invalidateQueries({ queryKey: ["transactions", v.id] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: txnKey }),
  });
}

/** Import an SMS (dedupe on user_id+hash). Returns { imported, transaction }. */
export function useImportSms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sender, body }: { sender: string | null; body: string }) => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Not signed in");

      const body_hash = await hashSms(sender, body);

      // Dedupe: if we already have a transaction with this hash, bail.
      const { data: existing } = await supabase
        .from("transactions")
        .select("id")
        .eq("user_id", uid)
        .eq("sms_hash", body_hash)
        .maybeSingle();
      if (existing) return { imported: false, reason: "duplicate" as const };

      const parsed = parseSms(sender, body);

      // Log the raw SMS regardless (upsert on unique hash)
      await supabase.from("sms_messages").upsert(
        {
          user_id: uid,
          sender,
          body,
          body_hash,
          recognized: !!parsed,
        },
        { onConflict: "user_id,body_hash", ignoreDuplicates: true },
      );

      if (!parsed) return { imported: false, reason: "unrecognized" as const };

      const { data: txn, error } = await supabase
        .from("transactions")
        .insert({
          user_id: uid,
          amount: parsed.amount,
          kind: parsed.kind,
          category: parsed.category,
          provider: parsed.provider,
          title: parsed.title,
          reference: parsed.reference,
          sms_hash: body_hash,
          occurred_at: parsed.occurredAt,
          note: body,
        })
        .select("*")
        .single();
      if (error) throw error;
      return { imported: true, transaction: txn as Transaction };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: txnKey });
      if (res.imported) {
        const t = res.transaction!;
        toast.success(`${t.kind === "income" ? "+" : "-"}$${t.amount} · ${t.title}`, {
          description: `Detected from SMS · ${t.category}`,
        });
      } else if (res.reason === "duplicate") {
        toast.info("Already imported", { description: "This SMS was detected earlier." });
      } else {
        toast.warning("SMS not recognized", { description: "Saved for review." });
      }
    },
  });
}
