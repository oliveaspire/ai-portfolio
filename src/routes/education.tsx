import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [{ title: "Education — Yash Tripathi" }, { name: "description", content: "Education and certifications." }],
  }),
  component: Education,
});

const edu = [
  {
    school: "Your University",
    degree: "B.Tech in Computer Science",
    period: "2019 — 2023",
    notes: ["GPA: 8.5 / 10", "Coursework: Distributed Systems, ML, DBMS, Algorithms"],
  },
  {
    school: "Your High School",
    degree: "Senior Secondary — Science (PCM)",
    period: "2017 — 2019",
    notes: ["Focus on Math & Physics", "School coding club lead"],
  },
];

const certs = [
  "AWS Certified Cloud Practitioner",
  "Meta Front-End Developer (Coursera)",
  "Deep Learning Specialization — DeepLearning.AI",
  "Postgres for Application Developers",
];

function Education() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 space-y-12">
      <div>
        <SectionHeader
          cmd="cat education.log"
          title="education()"
          desc="Formal training that got me here."
        />
        <div className="space-y-5">
          {edu.map((e) => (
            <div key={e.school} className="terminal-border rounded-lg bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-terminal">{e.degree}</h3>
                <span className="text-xs text-terminal-dim">{e.period}</span>
              </div>
              <div className="text-sm text-muted-foreground">{e.school}</div>
              <ul className="mt-3 space-y-1 text-sm">
                {e.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span className="text-terminal">▸</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-terminal mb-3">
          <span className="text-terminal-dim">$</span> ls ./certifications
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {certs.map((c) => (
            <div
              key={c}
              className="rounded-lg border border-border bg-card p-4 text-sm hover:border-terminal transition-colors"
            >
              <span className="text-terminal mr-2">▸</span>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
