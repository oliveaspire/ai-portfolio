import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, FileText, Send, User } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Yash Tripathi" },
      {
        name: "description",
        content: "Chat with an AI assistant that knows Yash's portfolio, projects, and experience.",
      },
    ],
  }),
  component: ChatPage,
});

type Source = { file: string };
type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const suggestions = [
  "What projects have you built?",
  "Tell me about your experience with RAG.",
  "What's your tech stack?",
  "Are you available for freelance work?",
];

const canned: Array<{ match: RegExp; reply: string; sources: Source[] }> = [
  {
    match: /project|built|build/i,
    reply:
      "Yash has built several projects, most notably **ai-cms** — an AI-powered CMS with a retrieval-augmented content assistant built on **NestJS**, **Postgres (pgvector)**, and **React**. Other highlights include **agentkit** (a small SDK for composing LLM agents), **pulse** (a real-time microservice status board in Go), and **flowmail** (a self-hosted transactional email service with observability).",
    sources: [{ file: "Projects.md" }, { file: "Resume.pdf" }],
  },
  {
    match: /rag|retrieval|vector|llm|ai/i,
    reply:
      "Yash has hands-on experience with RAG pipelines: chunking + embedding strategies, hybrid search over **pgvector**, prompt-injection guardrails, and evaluation harnesses. He's used **OpenAI**, **Gemini**, and open models via **LangChain**, and shipped an internal RAG assistant that measurably cut ops-ticket resolution time.",
    sources: [{ file: "Projects.md" }, { file: "AI-Notes.md" }],
  },
  {
    match: /stack|tech|language|tool/i,
    reply:
      "Daily driver: **TypeScript** on both ends, **Node.js / NestJS** on the server, **React** with **TanStack** and **Tailwind** on the client, **Postgres** + **Redis** for storage. Comfortable in **Python** for AI work and **Go** for services that need to be lean.",
    sources: [{ file: "Skills.md" }],
  },
  {
    match: /freelance|hire|available|work with/i,
    reply:
      "Yash is currently an Associate Engineer and open to **interesting freelance or full-time work**, especially around AI features, developer tools, and thoughtful full-stack products. The fastest way to reach him is via the [contact page](/contact).",
    sources: [{ file: "Resume.pdf" }],
  },
  {
    match: /education|study|university|degree/i,
    reply:
      "Yash holds a **B.Tech in Computer Science** and has continued learning via certifications in cloud (**AWS**), frontend (**Meta**), and ML (**DeepLearning.AI**).",
    sources: [{ file: "Education.md" }, { file: "Resume.pdf" }],
  },
];

function pickReply(q: string) {
  for (const c of canned) if (c.match.test(q)) return c;
  return {
    reply:
      "Good question. Based on Yash's portfolio, he's a full-stack developer working across TypeScript, Node, React, and AI tooling. Ask about **projects**, **skills**, **experience**, or **availability** and I'll dig deeper.",
    sources: [{ file: "Resume.pdf" }] as Source[],
  };
}

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Yash's portfolio assistant. Ask me about his projects, skills, experience, or how to hire him.",
      sources: [{ file: "Resume.pdf" }],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const chosen = pickReply(q);
    setTimeout(
      () => {
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: chosen.reply,
            sources: chosen.sources,
          },
        ]);
        setLoading(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      },
      700 + Math.random() * 500,
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-4">
        <div className="text-terminal-dim text-sm">
          <span className="text-terminal">$</span> ./ai_portfolio_assistant --interactive
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold text-terminal text-glow">
          AI Portfolio Assistant
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grounded on Yash's resume, projects, and notes. (Demo — mocked responses.)
        </p>
      </div>

      <div className="terminal-border rounded-lg bg-card overflow-hidden flex flex-col h-[70vh]">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/60">
          <span className="w-3 h-3 rounded-full bg-destructive/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-terminal/80" />
          <span className="ml-2 text-xs text-muted-foreground">yash@portfolio: ~/ai-assistant</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-terminal">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" /> online
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 scanlines">
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {loading && <TypingBubble />}
        </div>

        {messages.length <= 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs px-3 py-1.5 rounded border border-border text-muted-foreground hover:border-terminal hover:text-terminal transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 flex items-end gap-2 bg-background/40"
        >
          <span className="text-terminal pl-1 pb-2">&gt;</span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Ask something..."
            className="flex-1 resize-none bg-transparent text-sm focus:outline-none py-2 max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded bg-terminal text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-terminal-glow disabled:opacity-40 flex items-center gap-1"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
          isUser ? "border-border bg-muted" : "border-terminal/50 bg-background text-terminal"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div className="text-[10px] text-terminal-dim mb-1">
          {isUser ? "user@guest" : "assistant@yash-bot"}
        </div>
        <div
          className={`inline-block text-left rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-background/60 border border-border text-foreground"
          }`}
        >
          <MarkdownLite text={msg.content} />
          {msg.sources && msg.sources.length > 0 && !isUser && (
            <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
              <span className="text-[10px] text-terminal-dim uppercase tracking-wide">Source:</span>
              {msg.sources.map((s) => (
                <span
                  key={s.file}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-muted text-terminal border border-border"
                >
                  <FileText className="w-3 h-3" /> {s.file}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-terminal/50 text-terminal">
        <Bot className="w-4 h-4" />
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-lg px-4 py-3 bg-background/60 border border-border">
        <span
          className="w-1.5 h-1.5 rounded-full bg-terminal animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-terminal animate-bounce"
          style={{ animationDelay: "120ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-terminal animate-bounce"
          style={{ animationDelay: "240ms" }}
        />
        <span className="ml-2 text-xs text-muted-foreground">thinking...</span>
      </div>
    </div>
  );
}

// Very small markdown-ish renderer: **bold**, `code`, [text](href)
function MarkdownLite({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(regex)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push(text.slice(last, idx));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={i++} className="text-terminal font-semibold">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      parts.push(
        <code key={i++} className="px-1 py-0.5 rounded bg-muted text-terminal text-xs">
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      const label = tok.slice(1, tok.indexOf("]"));
      const href = tok.slice(tok.indexOf("(") + 1, -1);
      parts.push(
        <a key={i++} href={href} className="text-terminal underline hover:text-glow">
          {label}
        </a>,
      );
    }
    last = idx + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <span className="whitespace-pre-wrap">{parts}</span>;
}
