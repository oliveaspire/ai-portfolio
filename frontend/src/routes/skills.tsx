import { env } from "../config/env";
import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Yash Tripathi" },
      { name: "description", content: "Stack, tools, and languages Yash works with." },
    ],
  }),
  component: Skills,
});

type Skill = { id: string; name: string; level: number; group: string };

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
  const {
    data: skills = [],
    isLoading,
    error,
  } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const backendUrl = env.BACKEND_URL;
      const res = await fetch(`${backendUrl}/skills`);
      if (!res.ok) throw new Error("Failed to fetch skills");
      return res.json();
    },
  });

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.group]) acc[skill.group] = [];
      acc[skill.group].push({ n: skill.name, l: skill.level });
      return acc;
    },
    {} as Record<string, { n: string; l: number }[]>,
  );

  const groups = Object.keys(groupedSkills).map((name) => ({
    name,
    items: groupedSkills[name],
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="ls -la /skills"
        title="skills()"
        desc="A rough map of what I reach for daily and what I keep sharp."
      />
      {isLoading && <div className="text-terminal">Loading skills...</div>}
      {error && <div className="text-destructive">Error loading skills.</div>}
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
