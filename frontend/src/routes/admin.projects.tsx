import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/projects")({
  component: ManageProjects,
});

type Project = { id: string; name: string; stack: string; status: "live" | "draft" };

function ManageProjects() {
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [status, setStatus] = useState<"live" | "draft">("draft");
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: Omit<Project, "id">) => {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setName("");
      setStack("");
      setStatus("draft");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const res = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditingId(null);
      setName("");
      setStack("");
      setStatus("draft");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

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
          if (editingId) {
            updateMutation.mutate({ id: editingId, name, stack, status });
          } else {
            createMutation.mutate({ name, stack, status });
          }
        }}
        className="terminal-border rounded-lg bg-card p-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]"
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "live" | "draft")}
          className="bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
        >
          <option value="draft">draft</option>
          <option value="live">live</option>
        </select>
        <div className="flex gap-2">
          <button 
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow flex items-center gap-1 disabled:opacity-50"
          >
            {editingId ? "Update" : <><Plus className="w-4 h-4" /> Add</>}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setStack("");
                setStatus("draft");
              }}
              className="rounded border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              Cancel
            </button>
          )}
        </div>
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
            {isLoading ? (
              <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">Loading...</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-background/40">
                <td className="px-4 py-3 text-terminal font-medium">/{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.stack}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateMutation.mutate({ id: r.id, status: r.status === "live" ? "draft" : "live" })}
                    disabled={updateMutation.isPending}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      r.status === "live"
                        ? "border-terminal text-terminal hover:bg-terminal/10"
                        : "border-border text-muted-foreground hover:bg-border/50"
                    }`}
                  >
                    {r.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => {
                      setEditingId(r.id);
                      setName(r.name);
                      setStack(r.stack);
                      setStatus(r.status);
                    }}
                    className="text-muted-foreground hover:text-terminal p-1"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(r.id)}
                    disabled={deleteMutation.isPending}
                    className="text-muted-foreground hover:text-destructive p-1 disabled:opacity-50"
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
