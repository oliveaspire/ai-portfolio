import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Terminal, Prompt } from "@/components/terminal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Yash Tripathi" },
      {
        name: "description",
        content: "About Yash Tripathi — Associate Engineer and full-stack developer.",
      },
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
            <span className="text-accent"># about_me</span>
          </p>
          <p>
            I'm a full-stack developer focused on building scalable, maintainable, and intelligent web applications with modern JavaScript and TypeScript technologies. My work centers around designing robust backend systems, developing performant APIs, and creating reusable frontend architectures that simplify complex workflows and improve developer productivity.
          </p>
          <p>
            I enjoy solving challenging engineering problems by combining clean software architecture with practical solutions. Whether it's designing modular services with NestJS, building responsive interfaces with React, or optimizing data-driven applications, I strive to write code that is reliable, extensible, and easy to maintain.
          </p>
          <p>
            <span className="text-accent">## interests</span>
          </p>
          <p>
            My interests extend beyond traditional web development into AI-powered applications, geospatial technologies, and data engineering. I enjoy exploring how large language models, Retrieval-Augmented Generation (RAG), vector databases, and geospatial systems can be integrated to build intelligent, context-aware software that delivers real value.
          </p>
          <p>
            <span className="text-accent">## technical_stack</span>
          </p>
          <p>
            Technically, I work primarily with TypeScript, React, NestJS, Node.js, PostgreSQL, and MongoDB, with experience building RESTful APIs, authentication systems, and scalable backend architectures. I also work with GIS platforms such as ArcGIS and have an interest in cloud-native development, automation, and modern data platforms.
          </p>
          <p>
            <span className="text-accent">## outside_coding</span>
          </p>
          <p>
            Outside of coding, I'm constantly learning new technologies, refining engineering practices, and experimenting with emerging tools in artificial intelligence, distributed systems, and developer experience. I enjoy building software that balances performance, scalability, and clean architecture while continuously expanding my understanding of modern backend engineering and AI systems.
          </p>
          <Prompt>
            <span className="caret" />
          </Prompt>
        </div>
      </Terminal>
    </div>
  );
}
