import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Yash Tripathi" },
      { name: "description", content: "Career timeline of Yash Tripathi." },
    ],
  }),
  component: Experience,
});

const jobs = [
  {
    role: "Associate Engineer",
    company: "Current Company",
    period: "2024 — present",
    bullets: [
      "Owning full-stack features across a TypeScript / Node / React codebase.",
      "Built an internal RAG assistant used by ops & support to cut resolution time.",
      "Reduced API p95 by ~40% by rewriting hot paths and introducing caching.",
    ],
    stack: ["TypeScript", "NestJS", "React", "Postgres", "Redis"],
  },
  {
    role: "Software Engineer Intern",
    company: "Previous Company",
    period: "2023 — 2024",
    bullets: [
      "Shipped an event ingestion pipeline handling millions of events daily.",
      "Wrote developer docs & onboarding tooling adopted by 3 teams.",
    ],
    stack: ["Node.js", "Kafka", "Postgres", "Docker"],
  },
  {
    role: "Freelance / Open Source",
    company: "Independent",
    period: "2022 — 2023",
    bullets: [
      "Built websites, small SaaS tools, and Chrome extensions for clients.",
      "Maintained a few OSS libraries around dev tooling and prompt utilities.",
    ],
    stack: ["React", "Node.js", "Python"],
  },
];

function Experience() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="git log --oneline --decorate"
        title="experience()"
        desc="The commit history of my career so far."
      />

      <div className="relative border-l-2 border-border pl-6 space-y-8">
        {jobs.map((j, i) => (
          <div key={j.role + j.period} className="relative">
            <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-terminal border-4 border-background" />
            <div className="terminal-border rounded-lg bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-terminal">
                  {j.role} <span className="text-muted-foreground text-sm">@ {j.company}</span>
                </h3>
                <span className="text-xs text-terminal-dim">{j.period}</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
                {j.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-terminal">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {j.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded bg-muted text-terminal border border-border"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {i === 0 && <div className="mt-3 text-xs text-accent">● HEAD → current</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
