import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";
import { ExternalLink, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Projects — Yash Tripathi" }, { name: "description", content: "Selected projects built by Yash Tripathi." }],
  }),
  component: Projects,
});

type Project = { id: string; name: string; stack: string; status: "live" | "draft" };


function Projects() {
  const { data, isLoading, error } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const projects = data?.filter((p) => p.status === "live") || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="find ./projects -type d -maxdepth 1"
        title="projects()"
        desc="A selection — code, notes, and things that shipped."
      />

      {isLoading && <div className="text-terminal">Loading projects...</div>}
      {error && <div className="text-destructive">Error loading projects.</div>}

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
            <p className="mt-3 text-sm text-muted-foreground flex-1">
              No description available.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5 rounded bg-muted text-terminal border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
