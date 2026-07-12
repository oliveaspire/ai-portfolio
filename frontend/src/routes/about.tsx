import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Terminal, Prompt } from "@/components/terminal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yash Tripathi" },
      { name: "description", content: "About Yash Tripathi — Associate Engineer and full-stack developer." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <SectionHeader cmd="cat about.md" title="about()" desc="A quick who / what / why." />

      <Terminal title="~/about.md">
        <div className="space-y-4 leading-relaxed">
          <p>
            <span className="text-accent"># hello</span>
          </p>
          <p>
            I'm <span className="text-terminal">Yash Tripathi</span>, an Associate Engineer and
            full-stack developer. I like building products that feel fast, honest, and quietly
            powerful — the kind of software people don't have to think about to use well.
          </p>
          <p>
            <span className="text-accent">## what I do</span>
          </p>
          <p>
            End-to-end web apps: TypeScript & Node on the backend, React on the front, Postgres in
            the middle. Lately: LLM-powered features, retrieval pipelines, and agentic tooling.
          </p>
          <p>
            <span className="text-accent">## how I work</span>
          </p>
          <ul className="list-none space-y-1 pl-4">
            <li>
              <span className="text-terminal">▸</span> Small PRs. Fast feedback. Boring tech where
              possible.
            </li>
            <li>
              <span className="text-terminal">▸</span> Write it, ship it, measure it, sharpen it.
            </li>
            <li>
              <span className="text-terminal">▸</span> Docs are a love letter to future me.
            </li>
          </ul>
          <p>
            <span className="text-accent">## outside the terminal</span>
          </p>
          <p>Reading sci-fi, brewing pour-overs, and losing at chess to strangers online.</p>
          <Prompt>
            <span className="caret" />
          </Prompt>
        </div>
      </Terminal>
    </div>
  );
}
