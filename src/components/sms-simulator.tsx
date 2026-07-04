import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Sparkles } from "lucide-react";
import { SAMPLE_SMS } from "@/lib/sms-parser";
import { useImportSms } from "@/hooks/use-transactions";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SmsSimulator({ open, onOpenChange }: Props) {
  const importSms = useImportSms();
  const [busyIdx, setBusyIdx] = useState<number | null>(null);

  const importOne = async (i: number) => {
    setBusyIdx(i);
    try { await importSms.mutateAsync(SAMPLE_SMS[i]); } finally { setBusyIdx(null); }
  };

  const importAll = async () => {
    setBusyIdx(-1);
    try {
      for (const sms of SAMPLE_SMS) await importSms.mutateAsync(sms);
    } finally {
      setBusyIdx(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Simulate mobile money SMS
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Web preview can't read the Android inbox — use these samples to see automatic detection,
          categorization, and deduplication.
        </p>
        <ul className="mt-2 max-h-[52vh] space-y-2 overflow-y-auto">
          {SAMPLE_SMS.map((s, i) => (
            <li key={i} className="rounded-2xl border border-border/70 bg-card/60 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">{s.sender}</span>
                <Button size="sm" variant="secondary" disabled={busyIdx !== null} onClick={() => importOne(i)}>
                  {busyIdx === i ? "Importing…" : "Import"}
                </Button>
              </div>
              <p className="flex gap-2 rounded-xl bg-accent/60 p-2 text-[12px] leading-relaxed text-foreground">
                <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {s.body}
              </p>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={importAll} disabled={busyIdx !== null}>
            {busyIdx === -1 ? "Importing all…" : "Import all"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
