import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/skills")({
  component: ManageSkills,
});

type Skill = { id: string; name: string; level: number; group: string };

const seed: Skill[] = [
  { id: "1", name: "TypeScript", level: 95, group: "languages" },
  { id: "2", name: "React", level: 92, group: "frontend" },
  { id: "3", name: "NestJS", level: 85, group: "backend" },
  { id: "4", name: "RAG pipelines", level: 85, group: "ai" },
  { id: "5", name: "Docker", level: 82, group: "devops" },
];

function ManageSkills() {
  const [skills, setSkills] = useState<Skill[]>(seed);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("languages");
  const [level, setLevel] = useState(70);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="text-terminal-dim text-sm">$ manage skills</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Manage Skills</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          setSkills((s) => [...s, { id: crypto.randomUUID(), name, group, level }]);
          setName("");
          setLevel(70);
        }}
        className="terminal-border rounded-lg bg-card p-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="skill name"
          className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
        >
          {["languages", "frontend", "backend", "ai", "devops"].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="flex-1 accent-[color:var(--color-terminal)]"
          />
          <span className="text-terminal text-sm w-10 text-right">{level}%</span>
        </div>
        <button className="rounded bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="terminal-border rounded-lg bg-card overflow-hidden">
        <ul>
          {skills.map((s) => (
            <li
              key={s.id}
              className="px-4 py-3 border-t border-border first:border-t-0 flex items-center gap-4"
            >
              <div className="w-40">
                <div className="text-sm">{s.name}</div>
                <div className="text-[10px] text-terminal-dim">#{s.group}</div>
              </div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden border border-border">
                <div
                  className="h-full bg-terminal"
                  style={{ width: `${s.level}%`, boxShadow: "0 0 12px var(--color-terminal)" }}
                />
              </div>
              <span className="text-terminal text-xs w-10 text-right">{s.level}%</span>
              <button
                onClick={() => setSkills((all) => all.filter((x) => x.id !== s.id))}
                className="text-muted-foreground hover:text-destructive p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
