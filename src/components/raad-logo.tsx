import { cn } from "@/lib/utils";

interface RaadLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

export function RaadLogo({ className, showWordmark = true, size = 40 }: RaadLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative flex items-center justify-center rounded-2xl gradient-primary shadow-elegant"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary-foreground"
          style={{ width: size * 0.55, height: size * 0.55 }}
        >
          <path
            d="M4 20V6a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8 13h6M8 17h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
        </svg>
      </div>
      {showWordmark && (
        <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Raad
        </span>
      )}
    </div>
  );
}
