import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Terminal, Prompt } from "@/components/terminal";
import { useState } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — Yash Tripathi" }, { name: "description", content: "Get in touch with Yash Tripathi." }],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="mail -s 'let\\'s talk' yash@example.com"
        title="contact()"
        desc="Best way to reach me. I reply within a day or two."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <Terminal title="~/contact.info">
            <div className="space-y-2">
              <Prompt>cat contact.info</Prompt>
              <div className="pl-4 space-y-2 text-sm">
                <a href="mailto:yash@example.com" className="flex items-center gap-2 hover:text-terminal">
                  <Mail className="w-4 h-4 text-terminal" /> yash@example.com
                </a>
                <a href="https://github.com" className="flex items-center gap-2 hover:text-terminal">
                  <Github className="w-4 h-4 text-terminal" /> github.com/yashtripathi
                </a>
                <a href="https://linkedin.com" className="flex items-center gap-2 hover:text-terminal">
                  <Linkedin className="w-4 h-4 text-terminal" /> linkedin.com/in/yashtripathi
                </a>
                <a href="https://x.com" className="flex items-center gap-2 hover:text-terminal">
                  <Twitter className="w-4 h-4 text-terminal" /> @yashtripathi
                </a>
              </div>
              <Prompt>
                <span className="text-accent">availability</span>
              </Prompt>
              <div className="pl-4 text-terminal">● open to full-time & freelance</div>
              <Prompt>
                <span className="caret" />
              </Prompt>
            </div>
          </Terminal>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="terminal-border rounded-lg bg-card p-5 space-y-4"
        >
          <div className="text-terminal text-sm">
            <span className="text-terminal-dim">$</span> nano message.txt
          </div>
          <div>
            <label className="text-xs text-terminal-dim">name:</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
              placeholder="ada lovelace"
              required
            />
          </div>
          <div>
            <label className="text-xs text-terminal-dim">email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
              placeholder="ada@analytical.engine"
              required
            />
          </div>
          <div>
            <label className="text-xs text-terminal-dim">message:</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal resize-none"
              placeholder="tell me about the problem you're solving..."
              required
            />
          </div>
          <button
            type="submit"
            className="rounded border border-terminal bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow transition-colors"
          >
            :wq — send
          </button>
          {sent && (
            <div className="text-terminal text-sm">
              ✓ message queued — I'll get back to you soon.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
