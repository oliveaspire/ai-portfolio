import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";
import { ExternalLink, Github } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Projects — Yash Tripathi" }, { name: "description", content: "Selected projects built by Yash Tripathi." }],
  }),
  component: Projects,
});

const projects = [
  {
    name: "ai-cms",
    tagline: "AI-powered CMS with RAG-based content assistant",
    desc:
      "A NestJS + Postgres CMS with a retrieval-augmented assistant that helps editors draft, summarize, and cross-link content across knowledge bases.",
    stack: ["NestJS", "Postgres", "pgvector", "React", "OpenAI"],
    tags: ["AI", "RAG", "Full-stack"],
  },
  {
    name: "devlog",
    tagline: "Minimal, terminal-styled dev blog engine",
    desc:
      "A static blog generator with MDX, tag graphs, RSS, and a search index. Themed like a real terminal — because reading code should feel like reading code.",
    stack: ["TypeScript", "Vite", "MDX"],
    tags: ["OSS", "Tools"],
  },
  {
    name: "flowmail",
    tagline: "Transactional email service with observability",
    desc:
      "Self-hosted SMTP + webhook proxy with retry queues, per-tenant quotas, and a lightweight analytics dashboard.",
    stack: ["Node.js", "Redis", "Postgres", "Grafana"],
    tags: ["Backend", "DevOps"],
  },
  {
    name: "agentkit",
    tagline: "Composable agents SDK for internal automation",
    desc:
      "A small SDK for wiring together LLM tools, memory stores, and guardrails. Powers a couple of internal ops bots handling triage and reporting.",
    stack: ["TypeScript", "LangChain", "SQLite"],
    tags: ["AI", "OSS"],
  },
  {
    name: "pulse",
    tagline: "Real-time status board for microservices",
    desc:
      "Websocket-first uptime board with incident timelines, PagerDuty sync, and per-service SLOs.",
    stack: ["Go", "React", "ClickHouse"],
    tags: ["Backend", "Realtime"],
  },
  {
    name: "portfolio",
    tagline: "This site — terminal-themed portfolio + AI assistant",
    desc:
      "Built with TanStack Start and Tailwind v4. Includes a mocked AI assistant, admin dashboard, and a scanline-heavy dark theme.",
    stack: ["TanStack Start", "Tailwind v4", "TypeScript"],
    tags: ["Web", "Design"],
  },
];

function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="find ./projects -type d -maxdepth 1"
        title="projects()"
        desc="A selection — code, notes, and things that shipped."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.name}
            className="terminal-border rounded-lg bg-card p-5 flex flex-col hover:border-terminal transition-colors"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-terminal text-lg font-semibold">
                <span className="text-terminal-dim">/</span>
                {p.name}
              </h3>
              <div className="flex gap-2 text-muted-foreground">
                <a href="#" aria-label="github" className="hover:text-terminal">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" aria-label="live" className="hover:text-terminal">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <p className="mt-1 text-sm text-foreground">{p.tagline}</p>
            <p className="mt-3 text-sm text-muted-foreground flex-1">{p.desc}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5 rounded bg-muted text-terminal border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-1 text-[10px] text-accent">
              {p.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
