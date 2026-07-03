import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MessageSquareText, ShieldCheck, Sparkles, Lock } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/sms-permission")({
  head: () => ({
    meta: [
      { title: "Enable SMS access — Raad" },
      {
        name: "description",
        content:
          "Raad reads mobile money SMS to automatically track your income and expenses. Private and secure.",
      },
    ],
  }),
  component: SmsPermissionPage,
});

function SmsPermissionPage() {
  const navigate = useNavigate();

  return (
    <MobileShell className="flex min-h-full flex-col pb-8 pt-8">
      {/* Hero */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-70 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-[28px] shadow-elegant"
             style={{ background: "var(--gradient-primary)" }}>
          <MessageSquareText className="h-12 w-12 text-primary-foreground" />
          <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-background shadow-card-soft">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Let Raad read your money SMS
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          We securely scan mobile money messages from EVC, Zaad, and Sahal to
          automatically log every income and expense — so you never have to.
        </p>
      </div>

      {/* Benefits */}
      <ul className="mt-8 space-y-3">
        <Benefit
          icon={<Sparkles className="h-5 w-5" />}
          title="Automatic tracking"
          body="Transactions appear the moment your SMS arrives."
        />
        <Benefit
          icon={<Lock className="h-5 w-5" />}
          title="Stays on your device"
          body="Only money-related SMS are parsed. Nothing else is read or shared."
        />
        <Benefit
          icon={<ShieldCheck className="h-5 w-5" />}
          title="You're in control"
          body="Revoke permission any time from Settings."
        />
      </ul>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="gradient-primary shadow-elegant flex h-14 w-full items-center justify-center rounded-2xl text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Allow SMS access
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Not now
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          You can enable this later in Settings → Permissions.
        </p>
      </div>
    </MobileShell>
  );
}

function Benefit({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="glass-card flex items-start gap-3 rounded-2xl p-4 shadow-card-soft">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </li>
  );
}
