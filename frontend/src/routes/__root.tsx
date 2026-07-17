import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav, SiteFooter } from "../components/site-nav";

// ── Global BFCache guard (module-level, never cleaned up by React) ──────────
// When Chrome restores a page from the Back-Forward Cache (bfcache),
// no JS re-executes except for `pageshow`. React's useEffect cleanup removes
// component-level pageshow listeners BEFORE the page is stored in bfcache,
// so they never fire on restore. This module-level listener is registered
// exactly once and is immune to React's lifecycle — it always fires.
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (event.persisted && window.location.pathname.startsWith("/admin")) {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        window.location.replace("/login");
      }
    }
  });
}
// ───────────────────────────────────────────────────────────────────────────

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <p className="text-terminal-dim text-sm">$ cat /page</p>
        <h1 className="mt-2 text-7xl font-bold text-terminal text-glow">404</h1>
        <h2 className="mt-4 text-lg font-semibold">segmentation fault — page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The path you requested does not exist in this filesystem.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded border border-terminal/50 px-4 py-2 text-sm text-terminal hover:bg-terminal hover:text-primary-foreground transition-colors"
        >
          cd ~/
        </Link>
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-terminal">runtime error</h1>
        <p className="mt-2 text-sm text-muted-foreground">Process exited unexpectedly.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded border border-terminal/50 px-4 py-2 text-sm text-terminal hover:bg-terminal hover:text-primary-foreground"
        >
          $ retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Yash Tripathi — Full-Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Yash Tripathi — Associate Engineer & full-stack developer building AI-powered products.",
      },
      { property: "og:title", content: "Yash Tripathi — Full-Stack Developer" },
      {
        property: "og:description",
        content:
          "Portfolio of Yash Tripathi — Associate Engineer & full-stack developer building AI-powered products.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <div className="min-h-screen flex flex-col">
          <SiteNav />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      )}
    </QueryClientProvider>
  );
}
