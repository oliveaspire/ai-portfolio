import { env } from "../config/env";
import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Terminal, Prompt } from "@/components/terminal";
import { useState } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Yash Tripathi" },
      { name: "description", content: "Get in touch with Yash Tripathi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const backendUrl = env.BACKEND_URL;
      const res = await fetch(`${backendUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setStatus((prev) => (prev === "sent" ? "idle" : prev));
      }, 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Unknown error occurred");
      }
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
      <SectionHeader
        cmd="mail -s 'let\'s talk' yashtripathi2993@gmail.com"
        title="contact()"
        desc="Best way to reach me. I reply within a day or two."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <Terminal title="~/contact.info">
            <div className="space-y-2">
              <Prompt>cat contact.info</Prompt>
              <div className="pl-4 space-y-2 text-sm">
                <a
                  href="mailto:yashtripathi2993@gmail.com"
                  className="flex items-center gap-2 hover:text-terminal"
                >
                  <Mail className="w-4 h-4 text-terminal" /> yashtripathi2993@gmail.com
                </a>
                <a
                  href="https://github.com/oliveaspire"
                  className="flex items-center gap-2 hover:text-terminal"
                >
                  <Github className="w-4 h-4 text-terminal" /> github.com/oliveaspire
                </a>


              </div>
              <Prompt>
                <span className="text-accent">availability</span>
              </Prompt>
              <div className="pl-4 text-terminal">● open to full-time opportunities</div>
              <Prompt>
                <span className="caret" />
              </Prompt>
            </div>
          </Terminal>
        </div>

        <form onSubmit={handleSubmit} className="terminal-border rounded-lg bg-card p-5 space-y-4">
          <div className="text-terminal text-sm">
            <span className="text-terminal-dim">$</span> nano message.txt
          </div>
          <div>
            <label htmlFor="nameInput" className="text-xs text-terminal-dim">
              name:
            </label>
            <input
              id="nameInput"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
              placeholder=""
              required
            />
          </div>
          <div>
            <label htmlFor="emailInput" className="text-xs text-terminal-dim">
              email:
            </label>
            <input
              id="emailInput"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal"
              placeholder=""
              required
            />
          </div>
          <div>
            <label htmlFor="messageInput" className="text-xs text-terminal-dim">
              message:
            </label>
            <textarea
              id="messageInput"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="mt-1 w-full bg-input border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-terminal resize-none"
              placeholder=""
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            aria-disabled={status === "loading"}
            className="rounded border border-terminal bg-terminal text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-terminal-glow transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "sending..." : ":wq — send"}
          </button>
          <div aria-live="polite">
            {status === "sent" && (
              <div className="text-terminal text-sm">
                ✓ message sent — I'll get back to you soon.
              </div>
            )}
            {status === "error" && <div className="text-red-400 text-sm">✗ Error: {errorMsg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
