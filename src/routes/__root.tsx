import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Raad Income Tracker — Private mobile money finance" },
      {
        name: "description",
        content:
          "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style.",
      },
      { name: "author", content: "Raad" },
      { name: "theme-color", content: "#16A34A" },
      { property: "og:title", content: "Raad Income Tracker — Private mobile money finance" },
      {
        property: "og:description",
        content:
          "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Raad Income Tracker — Private mobile money finance" },
      { name: "description", content: "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style." },
      { property: "og:description", content: "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style." },
      { name: "twitter:description", content: "Raad parses financial incoming notifications to track income and expenses automatically. Completely private, WhatsApp interface style." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a0efe622-fe55-4c1e-ac4e-d333b0ab9d39" },
      { property: "og:site_name", content: "Raad" },
      { property: "og:url", content: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a0efe622-fe55-4c1e-ac4e-d333b0ab9d39" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Raad Income Tracker",
          url: "https://test-site-38dju7y6dhj7feyh7dhe.lovable.app/",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          description:
            "Raad automatically parses mobile money SMS notifications to track income and expenses. Completely private, WhatsApp-style interface.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function CrawlerContent() {
  // Visually hidden but crawler-visible content block for SEO.
  return (
    <div
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        border: 0,
        padding: 0,
        margin: -1,
      }}
    >
      <h1>Raad — Income Tracker</h1>
      <p>
        Raad is a smart personal finance app that parses financial incoming
        notifications to automatically track your mobile money income and
        expenses. Completely private. WhatsApp interface style.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Parses financial incoming notifications</li>
        <li>Completely private — your data stays on your device and account</li>
        <li>WhatsApp interface style, calm and familiar</li>
        <li>Automatic income and expense categorization</li>
        <li>Beautiful analytics and monthly summaries</li>
      </ul>
      <h2>Explore Raad</h2>
      <nav aria-label="Sitemap">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/home">Dashboard</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/analytics">Analytics</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/onboarding">Get started</a></li>
          <li><a href="/login">Log in</a></li>
          <li><a href="/signup">Create account</a></li>
        </ul>
      </nav>
      <h3>About Raad</h3>
      <p>
        Built for Somalia's mobile money users on EVC Plus, Zaad, and Sahal,
        Raad turns transaction SMS into a clear picture of your finances.
      </p>
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CrawlerContent />
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

