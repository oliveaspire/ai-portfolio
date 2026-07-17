import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../utils/api";

export const Route = createFileRoute("/admin/skills")({
  component: ManageSkills,
});

type Skill = { id: string; name: string; level: number; group: string };

function ManageSkills() {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("languages");
  const [level, setLevel] = useState(70);
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await apiFetch("/skills");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newSkill: Omit<Skill, "id">) => {
      const res = await apiFetch("/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setName("");
      setGroup("languages");
      setLevel(70);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/skills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });

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
          createMutation.mutate({ name, group, level });
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
        <button 
          disabled={createMutation.isPending}
          className="rounded bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow flex items-center gap-1 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="terminal-border rounded-lg bg-card overflow-hidden">
        <ul>
          {isLoading ? (
            <li className="px-4 py-3 text-muted-foreground text-center text-sm">Loading...</li>
          ) : skills.map((s) => (
            <li
              key={s.id}
              className="px-4 py-3 border-t border-border flex items-center gap-4 hover:bg-background/40"
            >
              <div className="w-40">
                <div className="text-sm font-medium text-foreground">{s.name}</div>
                <div className="text-[10px] text-terminal-dim">#{s.group}</div>
              </div>
              <div className="flex-1 h-2 bg-muted rounded overflow-hidden border border-border">
                <div
                  className="h-full bg-terminal transition-all duration-500"
                  style={{ width: `${s.level}%`, boxShadow: "0 0 12px var(--color-terminal)" }}
                />
              </div>
              <span className="text-terminal text-xs w-10 text-right">{s.level}%</span>
              <button
                onClick={() => deleteMutation.mutate(s.id)}
                disabled={deleteMutation.isPending}
                className="text-muted-foreground hover:text-destructive p-1 disabled:opacity-50"
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
