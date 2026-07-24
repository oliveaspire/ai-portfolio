import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal, Prompt } from "@/components/terminal";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-terminal-dim text-sm">
            <span className="text-terminal">$</span> whoami
          </p>
          <h1 className="mt-3 text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-foreground">Yash</span>{" "}
            <span className="text-terminal text-glow">Tripathi</span>
            <span className="caret ml-1" />
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Associate Engineer · Full-stack developer.
            <br />I ship clean APIs, thoughtful UIs, and AI-powered features that actually work in
            production.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="rounded border border-terminal bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow transition-colors"
            >
              ./view_projects.sh
            </Link>
            <Link
              to="/chat"
              className="rounded border border-terminal/50 text-terminal px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              ./ask_ai --about=yash
            </Link>
            <Link
              to="/contact"
              className="rounded border border-border text-foreground px-4 py-2 text-sm hover:border-terminal hover:text-terminal transition-colors"
            >
              mail -s "hi"
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "3+", v: "years shipping" },
              { k: "20+", v: "projects" },
              { k: "∞", v: "commits" },
            ].map((s) => (
              <div key={s.v} className="border border-border rounded p-3">
                <div className="text-terminal text-2xl font-bold">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <Terminal title="~/introduction.sh">
          <div className="space-y-1.5">
            <Prompt>cat introduction.md</Prompt>
            <div className="pl-4 text-foreground/90 space-y-2">
              <p>
                <span className="text-accent"># Hello, world</span>
              </p>
              <p>
                I'm a full-stack developer working across{" "}
                <span className="text-terminal">TypeScript</span>,{" "}
                <span className="text-terminal">Node.js</span>,{" "}
                <span className="text-terminal">Python</span>, and{" "}
                <span className="text-terminal">React</span>.
              </p>
              <p>
                Lately, I've been building <span className="text-terminal">RAG systems</span>,
                internal AI tooling, and pixel-crafted developer experiences.
              </p>
            </div>
            <Prompt>ls ~/interests</Prompt>
            <div className="pl-4 text-muted-foreground">
              distributed-systems/ ai-agents/ dx/ open-source/ coffee/
            </div>
            <Prompt>
              <span className="text-foreground">status</span>
              <span className="caret ml-1" />
            </Prompt>
            <div className="pl-4 text-terminal">● available for interesting problems</div>
          </div>
        </Terminal>
      </div>

      <div className="mt-20 grid gap-4 md:grid-cols-3">
        {[
          { to: "/about", title: "about", desc: "background, values, and how I work" },
          { to: "/skills", title: "skills", desc: "stack, tools, and comfort levels" },
          { to: "/projects", title: "projects", desc: "things I've built and shipped" },
          { to: "/experience", title: "experience", desc: "career timeline" },
          { to: "/education", title: "education", desc: "degrees and certifications" },
          { to: "/chat", title: "ai assistant", desc: "chat with my portfolio bot" },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group block rounded-lg border border-border p-5 hover:border-terminal hover:bg-card transition-colors"
          >
            <div className="text-terminal-dim text-xs">$ open</div>
            <div className="mt-1 text-lg font-semibold text-terminal group-hover:text-glow">
              /{c.title}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
