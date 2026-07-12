import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});

const traffic = [12, 18, 24, 20, 32, 40, 38, 50, 46, 58, 64, 72, 68, 80];
const topPages = [
  { p: "/projects", v: 1284 },
  { p: "/", v: 962 },
  { p: "/chat", v: 748 },
  { p: "/about", v: 512 },
  { p: "/contact", v: 331 },
];
const topQueries = [
  { q: "What projects have you built?", n: 84 },
  { q: "Are you available for hire?", n: 41 },
  { q: "Tell me about your RAG experience", n: 33 },
  { q: "What's your stack?", n: 27 },
];

function Analytics() {
  const max = Math.max(...traffic);
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="text-terminal-dim text-sm">$ tail -f analytics.log</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Analytics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Visitors (30d)", v: "3,241" },
          { l: "AI queries", v: "748" },
          { l: "Avg. session", v: "2m 14s" },
          { l: "Bounce rate", v: "38%" },
        ].map((k) => (
          <div key={k.l} className="terminal-border rounded-lg bg-card p-4">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className="text-2xl font-bold text-terminal mt-1">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="terminal-border rounded-lg bg-card p-5">
        <div className="text-sm text-terminal mb-4">
          <span className="text-terminal-dim">$</span> plot traffic --days=14
        </div>
        <div className="h-48 flex items-end gap-1">
          {traffic.map((t, i) => (
            <div
              key={i}
              className="flex-1 bg-terminal/70 hover:bg-terminal transition-colors rounded-t"
              style={{
                height: `${(t / max) * 100}%`,
                boxShadow: "0 0 12px -2px var(--color-terminal)",
              }}
              title={`day ${i + 1}: ${t}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top pages</div>
          <ul className="space-y-2 text-sm">
            {topPages.map((p) => (
              <li key={p.p} className="flex items-center gap-3">
                <span className="text-terminal-dim">▸</span>
                <span className="flex-1">{p.p}</span>
                <div className="w-32 h-1.5 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-terminal"
                    style={{ width: `${(p.v / topPages[0].v) * 100}%` }}
                  />
                </div>
                <span className="text-terminal text-xs w-14 text-right">{p.v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top AI queries</div>
          <ul className="space-y-2 text-sm">
            {topQueries.map((q) => (
              <li key={q.q} className="flex items-start gap-3">
                <span className="text-terminal-dim">?</span>
                <span className="flex-1">{q.q}</span>
                <span className="text-terminal text-xs">{q.n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
