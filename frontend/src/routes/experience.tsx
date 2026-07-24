import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/terminal";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Yash Tripathi" },
      { name: "description", content: "Career timeline of Yash Tripathi." },
    ],
  }),
  component: Experience,
});

const jobs = [
  {
    role: "Associate Engineer",
    company: "Successive Digital",
    period: "May 2025 — Present",
    projects: [
      {
        name: "GIS-Based Field Operations Platform",
        bullets: [
          "Migrated the platform from single-tenant to multi-tenant architecture, implementing tenant-specific ArcGIS configurations and access controls, enabling onboarding of 5+ tenant organizations without codebase duplication.",
          "Contributed to backend development using NestJS, building REST APIs and a reusable ArcGIS integration layer to centralize request handling, configuration management, and geospatial data access.",
          "Implemented configuration-driven geospatial data access by replacing hard-coded layer identifiers with dynamic layer-name based resolution, improving portability across tenant environments.",
          "Designed role- and permission-based access controls supporting secure onboarding for 5+ tenant organizations and 50+ users across multiple access tiers.",
          "Developed a configurable reporting module on a custom Ant Design component library, reducing new-report development time by ~40% through reusable, config-driven components.",
          "Built dynamic, filter-driven reports with grouping, search, pagination, export (CSV/PDF), print, refresh, and zoom capabilities, allowing users to generate customized reports from ArcGIS Feature Layer data.",
          "Designed reusable frontend components and reporting workflows, improving maintainability, scalability, and development efficiency across multiple modules.",
          "Identified and resolved performance bottlenecks, code quality issues, and defects, while authoring technical documentation to improve maintainability and onboarding efficiency."
        ],
        stack: ["React", "TypeScript", "NestJS", "ArcGIS", "Ant Design"],
      },
      {
        name: "UAV-Based Housing Classification (Temporary vs. Permanent) - Proof of Concept",
        bullets: [
          "Developed an end-to-end proof-of-concept pipeline to classify buildings from UAV/drone imagery as temporary or permanent using ArcGIS Pro and deep learning models.",
          "Created labeled ground-truth dataset by digitizing building footprints and annotating structures based on roof material, texture, and geometric features.",
          "Prepared training data by generating 256×256 overlapping image chips using ArcGIS \"Export Training Data for Deep Learning\" in PASCAL VOC format.",
          "Trained object detection models (Faster R-CNN / SSD with ResNet34/ResNet50 backbones), optimizing hyperparameters to improve validation performance and reduce overfitting.",
          "Performed large-scale inference on unseen drone imagery using \"Detect Objects Using Deep Learning,\" producing georeferenced classified outputs with confidence scores.",
          "Evaluated model performance using confusion matrix analysis and improved accuracy through iterative dataset augmentation to reduce class confusion."
        ],
        stack: ["Python", "ArcGIS Pro", "Deep Learning", "Faster R-CNN"],
      }
    ]
  }
];

function Experience() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="git log --oneline --decorate"
        title="experience()"
        desc="The commit history of my career so far."
      />

      <div className="relative border-l-2 border-border pl-6 space-y-8">
        {jobs.map((j, i) => (
          <div key={j.company + j.period} className="relative">
            <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-terminal border-4 border-background" />
            <div className="terminal-border rounded-lg bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-terminal">
                  {j.role} <span className="text-muted-foreground text-sm">@ {j.company}</span>
                </h3>
                <span className="text-xs text-terminal-dim">{j.period}</span>
              </div>
              
              <div className="mt-6 space-y-8">
                {j.projects.map((p) => (
                  <div key={p.name}>
                    <div className="text-md font-medium text-foreground">Project: {p.name}</div>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-terminal">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded bg-muted text-terminal border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {i === 0 && <div className="mt-4 pt-4 border-t border-border text-xs text-accent">● HEAD → current</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
