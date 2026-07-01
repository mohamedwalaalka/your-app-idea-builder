import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MessageSquareText, PieChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/mobile-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Raad — Get started" },
      {
        name: "description",
        content:
          "See how Raad turns your mobile money SMS into a clear picture of income, expenses, and balance.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    icon: MessageSquareText,
    eyebrow: "Automatic tracking",
    title: "Your SMS, turned into insights",
    body: "Raad reads your mobile money messages the moment they arrive and turns each one into a clean transaction — no typing, no spreadsheets.",
  },
  {
    icon: PieChart,
    eyebrow: "Clear picture",
    title: "Know where your money goes",
    body: "See income, expenses and your current balance at a glance. Beautiful charts help you spot patterns without the noise.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Private by design",
    title: "Your data stays yours",
    body: "SMS is processed on your device. We only ever store what you choose to sync — encrypted, and never sold.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const Icon = slide.icon;

  const next = () => {
    if (isLast) navigate({ to: "/signup" });
    else setIndex((i) => i + 1);
  };

  return (
    <MobileShell withHero className="pb-10 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5" aria-label={`Step ${index + 1} of ${slides.length}`}>
          {slides.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-primary" : "w-4 bg-border",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
        <div className="relative mb-10">
          <div
            aria-hidden
            className="absolute inset-0 -m-6 rounded-full opacity-60 blur-2xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="glass-card relative flex h-32 w-32 items-center justify-center rounded-[36px] shadow-elegant">
            <Icon className="h-14 w-14 text-primary" strokeWidth={1.75} />
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {slide.eyebrow}
        </p>
        <h1 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight text-foreground">
          {slide.title}
        </h1>
        <p className="mt-4 max-w-xs text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {slide.body}
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={next}
          size="lg"
          className="h-14 w-full rounded-2xl gradient-primary text-base font-semibold text-primary-foreground shadow-elegant hover:opacity-95"
        >
          {isLast ? "Get started" : "Continue"}
          <ArrowRight className="ml-1 h-5 w-5" />
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </MobileShell>
  );
}
