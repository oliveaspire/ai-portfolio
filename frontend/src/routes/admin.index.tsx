import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, FolderKanban, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api";

const activity = [
  { t: "2m ago", msg: "AI query: 'What projects have you built?'", tag: "chat" },
  { t: "1h ago", msg: "Uploaded Resume_v3.pdf (indexed 12 chunks)", tag: "docs" },
  { t: "yesterday", msg: "Added project: pulse", tag: "projects" },
  { t: "2 days ago", msg: "Updated skill: NestJS 80% → 85%", tag: "skills" },
];

function AdminHome() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await apiFetch("/projects");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await apiFetch("/documents");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await apiFetch("/skills");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, delta: "Manage your portfolio" },
    { label: "Documents", value: documents.length, icon: FileText, delta: "Uploaded files" },
    { label: "Skills", value: skills.length, icon: Sparkles, delta: "Tracked abilities" },
    { label: "AI queries", value: 148, icon: MessageSquare, delta: "Mock data" },
  ];

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
