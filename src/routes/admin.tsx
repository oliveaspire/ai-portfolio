import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, FileUp, FolderKanban, Home, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Yash Tripathi" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/projects", label: "Manage Projects", icon: FolderKanban },
  { to: "/admin/documents", label: "Upload Documents", icon: FileUp },
  { to: "/admin/skills", label: "Manage Skills", icon: Sparkles },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="text-xs text-terminal-dim">$ sudo access</div>
          <div className="text-terminal text-glow font-bold mt-1">admin.console</div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-terminal text-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-terminal"
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-sidebar-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-terminal"
          >
            <Home className="w-4 h-4" /> back to site
          </Link>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-destructive">
            <LogOut className="w-4 h-4" /> logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-6 justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="text-terminal">$</span> pwd
            <span className="ml-2 text-foreground">{pathname}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-terminal animate-pulse" />
            <span className="text-muted-foreground">signed in as</span>
            <span className="text-terminal">yash</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
