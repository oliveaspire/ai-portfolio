import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [{ title: "Skills — Yash Tripathi" }, { name: "description", content: "Stack, tools, and languages Yash works with." }],
  }),
  component: Skills,
});

const groups = [
  {
    name: "languages",
    items: [
      { n: "TypeScript", l: 95 },
      { n: "JavaScript", l: 95 },
      { n: "Python", l: 85 },
      { n: "Go", l: 60 },
      { n: "SQL", l: 85 },
    ],
  },
  {
    name: "frontend",
    items: [
      { n: "React", l: 92 },
      { n: "Next.js / TanStack", l: 88 },
      { n: "Tailwind CSS", l: 90 },
      { n: "Framer Motion", l: 70 },
    ],
  },
  {
    name: "backend",
    items: [
      { n: "Node.js", l: 92 },
      { n: "NestJS", l: 85 },
      { n: "FastAPI", l: 75 },
      { n: "PostgreSQL", l: 85 },
      { n: "Redis", l: 70 },
    ],
  },
  {
    name: "ai / ml",
    items: [
      { n: "LangChain", l: 80 },
      { n: "RAG pipelines", l: 85 },
      { n: "Vector DBs (pgvector, Pinecone)", l: 78 },
      { n: "OpenAI / Gemini APIs", l: 88 },
    ],
  },
  {
    name: "devops",
    items: [
      { n: "Docker", l: 82 },
      { n: "AWS / GCP", l: 72 },
      { n: "GitHub Actions", l: 80 },
      { n: "Linux", l: 85 },
    ],
  },
];

function Bar({ n, l }: { n: string; l: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-foreground">{n}</span>
        <span className="text-terminal-dim">{l}%</span>
      </div>
      <div className="h-2 rounded bg-muted overflow-hidden border border-border">
        <div
          className="h-full bg-terminal"
          style={{ width: `${l}%`, boxShadow: "0 0 12px var(--color-terminal)" }}
        />
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="ls -la /skills"
        title="skills()"
        desc="A rough map of what I reach for daily and what I keep sharp."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name} className="terminal-border rounded-lg bg-card p-5">
            <div className="text-terminal mb-4">
              <span className="text-terminal-dim">$</span> cd ./{g.name}
            </div>
            <div className="space-y-3">
              {g.items.map((i) => (
                <Bar key={i.n} {...i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
