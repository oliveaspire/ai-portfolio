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
            Associate Engineer · Full-Stack Developer
            <br />Architecting robust, scalable platforms with <span className="text-foreground font-medium">NestJS</span> and <span className="text-foreground font-medium">React</span>. Specialized in complex <span className="text-terminal">Geospatial (GIS)</span> integrations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="rounded border border-terminal bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow transition-colors"
            >
              ./view_projects.sh
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
              className="rounded border border-terminal/50 text-terminal px-4 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
            >
              ./ask_ai --about=yash
            </button>
            <Link
              to="/contact"
              className="rounded border border-border text-foreground px-4 py-2 text-sm hover:border-terminal hover:text-terminal transition-colors"
            >
              mail -s "hi"
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "1+", v: "years shipping" },
              { k: "2+", v: "enterprise deployments" },
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
                I am a full-stack engineer driven by scalable architecture. I build 
                primarily with <span className="text-terminal">TypeScript</span>,{" "}
                <span className="text-terminal">NestJS</span>,{" "}
                <span className="text-terminal">React</span>, and{" "}
                <span className="text-terminal">PostgreSQL</span>.
              </p>
              <p>
                Recently, I've been focused on <span className="text-terminal">ArcGIS platform integration</span>,
                scalable enterprise architecture, and <span className="text-terminal">AI integrations (RAG, LangChain)</span>.
              </p>
            </div>
            <Prompt>ls ~/interests</Prompt>
            <div className="pl-4 text-muted-foreground">
              clean_architecture/ geospatial_tech/ AI_applications/ cloud_native/
            </div>
            <Prompt>
              <span className="text-foreground">status</span>
              <span className="caret ml-1" />
            </Prompt>
            <div className="pl-4 text-terminal">● building scalable, intelligent web applications</div>
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
          { isAction: true, title: "ai assistant", desc: "chat with my portfolio bot" },
        ].map((c) => 
          c.isAction ? (
            <button
              key={c.title}
              onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
              className="text-left group block rounded-lg border border-border p-5 hover:border-terminal hover:bg-card transition-colors cursor-pointer"
            >
              <div className="text-terminal-dim text-xs">$ execute</div>
              <div className="mt-1 text-lg font-semibold text-terminal group-hover:text-glow">
                /{c.title}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </button>
          ) : (
            <Link
              key={c.to}
              to={c.to as string}
              className="group block rounded-lg border border-border p-5 hover:border-terminal hover:bg-card transition-colors"
            >
              <div className="text-terminal-dim text-xs">$ open</div>
              <div className="mt-1 text-lg font-semibold text-terminal group-hover:text-glow">
                /{c.title}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
