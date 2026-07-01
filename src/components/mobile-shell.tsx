import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
  withHero?: boolean;
}

/**
 * Frames content as a phone-like column on desktop while filling the screen on mobile.
 * `withHero` adds the subtle radial green glow at the top used across auth flows.
 */
export function MobileShell({ children, className, withHero = false }: MobileShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      {withHero && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{ background: "var(--gradient-hero)" }}
        />
      )}
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
