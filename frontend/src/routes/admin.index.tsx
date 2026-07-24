import { env } from "../config/env";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  FileText,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Eye,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api";

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

  const { data: analytics = {} } = useQuery({
    queryKey: ["analyticsStats"],
    queryFn: async () => {
      const backendUrl = env.BACKEND_URL;
      const res = await fetch(`${backendUrl}/analytics/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: aiData = {} } = useQuery({
    queryKey: ["aiStats"],
    queryFn: async () => {
      const backendUrl = env.BACKEND_URL;
      const res = await fetch(`${backendUrl}/analytics/ai`);
      if (!res.ok) throw new Error("Failed to fetch AI stats");
      return res.json();
    },
  });

  const stats = [
    { label: "Total Views", value: analytics.totalViews || 0, icon: Eye, delta: "Page views" },
    {
      label: "Unique Visitors",
      value: analytics.totalUniqueVisitors || 0,
      icon: Users,
      delta: "Total sessions",
    },
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      delta: "Manage your portfolio",
    },
    { label: "Documents", value: documents.length, icon: FileText, delta: "Uploaded files" },
    { label: "Skills", value: skills.length, icon: Sparkles, delta: "Tracked abilities" },
    {
      label: "AI queries",
      value: aiData.totalQueries || 0,
      icon: MessageSquare,
      delta: "Live data",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <div className="text-terminal-dim text-sm">$ status --overview</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Everything you're managing, in one glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top pages</div>
          <ul className="space-y-2 text-sm">
            {(analytics.pages || []).map(
              (p: { path: string; views: number; uniqueVisitors: number }) => (
                <li key={p.path} className="flex items-center gap-3">
                  <span className="text-terminal-dim">▸</span>
                  <span className="flex-1">{p.path}</span>
                  <div className="w-24 h-1.5 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-terminal"
                      style={{ width: `${(p.views / (analytics.pages?.[0]?.views || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-terminal text-xs w-20 text-right">{p.views} views</span>
                </li>
              ),
            )}
            {!analytics.pages?.length && (
              <li className="text-muted-foreground text-sm">No page visits recorded yet.</li>
            )}
          </ul>
        </div>

        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top AI queries</div>
          <ul className="space-y-2 text-sm">
            {(aiData.topQueries || []).map(
              (q: { question: string; timesAsked: number; rating: number }) => (
                <li key={q.question} className="flex items-start gap-3">
                  <span className="text-terminal-dim">?</span>
                  <span className="flex-1">{q.question}</span>
                  <span className="text-muted-foreground text-xs">{q.timesAsked} asked</span>
                  <span
                    className={`text-xs ${q.rating > 0 ? "text-green-400" : q.rating < 0 ? "text-red-400" : "text-terminal"}`}
                  >
                    {q.rating > 0 ? `+${q.rating}` : q.rating} rating
                  </span>
                </li>
              ),
            )}
            {!aiData.topQueries?.length && (
              <li className="text-muted-foreground text-sm">No AI queries recorded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
