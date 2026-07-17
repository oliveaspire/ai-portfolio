import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const links = [
  { to: "/", label: "~/home" },
  { to: "/about", label: "~/about" },
  { to: "/skills", label: "~/skills" },
  { to: "/projects", label: "~/projects" },
  { to: "/experience", label: "~/experience" },
  { to: "/education", label: "~/education" },
  { to: "/contact", label: "~/contact" },
  { to: "/chat", label: "~/ai-assistant" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("admin_token"));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-terminal text-glow">
          <span className="text-terminal-dim">$</span>
          <span className="font-bold">yash.tripathi</span>
          <span className="caret" />
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-terminal text-sm border border-border px-2 py-1 rounded"
          aria-label="menu"
        >
          {open ? "[x] close" : "[=] menu"}
        </button>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-2 py-1 rounded transition-colors ${
                  active
                    ? "text-terminal text-glow bg-muted"
                    : "text-muted-foreground hover:text-terminal hover:bg-muted/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            to="/admin"
            className="ml-2 px-3 py-1 rounded border border-terminal/40 text-terminal hover:bg-terminal hover:text-primary-foreground transition-colors"
          >
            {hasToken ? "[admin]" : "[login]"}
          </Link>
        </nav>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border px-4 py-2 flex flex-col gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-2 py-2 rounded ${
                pathname === l.to ? "text-terminal bg-muted" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="px-2 py-2 rounded text-terminal border border-terminal/40"
          >
            {hasToken ? "[admin]" : "[login]"}
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
        <span>
          <span className="text-terminal-dim">$</span> echo "built with love & caffeine"
        </span>
        <span>© {new Date().getFullYear()} Yash Tripathi — exit 0</span>
      </div>
    </footer>
  );
}
