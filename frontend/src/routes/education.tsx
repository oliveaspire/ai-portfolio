import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education — Yash Tripathi" },
      { name: "description", content: "Education and certifications." },
    ],
  }),
  component: Education,
});

const edu = [
  {
    school: "Chandigarh Engineering College, Mohali",
    degree: "Bachelor of Technology – Computer Science Engineering",
    period: "Sep 2021 – May 2025",
    notes: [
      "CGPA: 8.0 / 10.0",
      "Coursework: Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, Object-Oriented Programming",
    ],
  },
  {
    school: "Guru Nanak Modern School, Kanpur",
    degree: "XIIᵗʰ",
    period: "Apr 2020 - Apr 2021",
    notes: [
      "Percentage: 92.4%",
      "Stream: Science (PCM)",
      "Subjects: Physics, Chemistry, Mathematics, English, Computer Science",
    ],
  },
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
    </div>
  );
}
