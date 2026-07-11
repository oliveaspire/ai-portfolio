import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, FolderKanban, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

const stats = [
  { label: "Projects", value: 6, icon: FolderKanban, delta: "+1 this month" },
  { label: "Documents", value: 12, icon: FileText, delta: "3.4 MB indexed" },
  { label: "Skills", value: 24, icon: Sparkles, delta: "5 categories" },
  { label: "AI queries", value: 148, icon: MessageSquare, delta: "+22% w/w" },
];

const activity = [
  { t: "2m ago", msg: "AI query: 'What projects have you built?'", tag: "chat" },
  { t: "1h ago", msg: "Uploaded Resume_v3.pdf (indexed 12 chunks)", tag: "docs" },
  { t: "yesterday", msg: "Added project: pulse", tag: "projects" },
  { t: "2 days ago", msg: "Updated skill: NestJS 80% → 85%", tag: "skills" },
];

function AdminHome() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="text-terminal-dim text-sm">$ status --overview</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Everything you're managing, in one glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="terminal-border rounded-lg bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <Icon className="w-4 h-4 text-terminal" />
              </div>
              <div className="text-3xl font-bold text-terminal mt-2">{s.value}</div>
              <div className="text-[11px] text-terminal-dim mt-1">{s.delta}</div>
            </div>
          );
        })}
      </div>

      <div className="terminal-border rounded-lg bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-terminal" />
          <h2 className="font-semibold text-terminal">Recent activity</h2>
        </div>
        <ul className="space-y-2 text-sm">
          {activity.map((a, i) => (
            <li key={i} className="flex items-start gap-3 py-1">
              <span className="text-terminal-dim text-xs w-24 shrink-0">{a.t}</span>
              <span className="flex-1">{a.msg}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-terminal border border-border">
                #{a.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
