import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({
  component: ManageProjects,
});

type Project = { id: string; name: string; stack: string; status: "live" | "draft" };

const seed: Project[] = [
  { id: "1", name: "ai-cms", stack: "NestJS, Postgres, React", status: "live" },
  { id: "2", name: "devlog", stack: "TypeScript, Vite, MDX", status: "live" },
  { id: "3", name: "flowmail", stack: "Node.js, Redis, Postgres", status: "live" },
  { id: "4", name: "agentkit", stack: "TypeScript, LangChain", status: "draft" },
];

function ManageProjects() {
  const [rows, setRows] = useState<Project[]>(seed);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="text-terminal-dim text-sm">$ manage projects</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Manage Projects</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          setRows((r) => [
            ...r,
            { id: crypto.randomUUID(), name, stack, status: "draft" },
          ]);
          setName("");
          setStack("");
        }}
        className="terminal-border rounded-lg bg-card p-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="project name"
          className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
        />
        <input
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="stack (comma separated)"
          className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
        />
        <button className="rounded bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="terminal-border rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs text-terminal-dim uppercase bg-background/50">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Stack</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-background/40">
                <td className="px-4 py-3 text-terminal font-medium">/{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.stack}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      r.status === "live"
                        ? "border-terminal text-terminal"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-muted-foreground hover:text-terminal p-1">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRows((all) => all.filter((x) => x.id !== r.id))}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
