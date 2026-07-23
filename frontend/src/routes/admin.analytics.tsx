import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/analytics")({
  component: Analytics,
});




function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["analyticsStats"],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/analytics/stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: aiData, isLoading: aiIsLoading } = useQuery({
    queryKey: ["aiStats"],
    queryFn: async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${backendUrl}/analytics/ai`);
      if (!res.ok) throw new Error("Failed to fetch AI stats");
      return res.json();
    },
  });


  const topPages = data?.pages || [];
  const totalViews = data?.totalViews || 0;
  const totalUniqueVisitors = data?.totalUniqueVisitors || 0;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <div className="text-terminal-dim text-sm">$ tail -f analytics.log</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Analytics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Total Views", v: isLoading ? "..." : totalViews.toLocaleString() },
          { l: "Unique Visitors", v: isLoading ? "..." : totalUniqueVisitors.toLocaleString() },
          { l: "AI queries", v: aiIsLoading ? "..." : (aiData?.totalQueries || 0).toLocaleString() },
        ].map((k) => (
          <div key={k.l} className="terminal-border rounded-lg bg-card p-4">
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className="text-2xl font-bold text-terminal mt-1">{k.v}</div>
          </div>
        ))}
      </div>



      <div className="grid gap-4 lg:grid-cols-2">
        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top pages (Live Data)</div>
          <ul className="space-y-2 text-sm">
            {topPages.map((p: { path: string; views: number; uniqueVisitors: number }) => (
              <li key={p.path} className="flex items-center gap-3">
                <span className="text-terminal-dim">▸</span>
                <span className="flex-1">{p.path}</span>
                <div className="w-32 h-1.5 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-terminal"
                    style={{ width: `${(p.views / (topPages[0]?.views || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-terminal text-xs w-20 text-right">{p.views} views ({p.uniqueVisitors} unique)</span>
              </li>
            ))}
            {topPages.length === 0 && !isLoading && (
              <li className="text-muted-foreground text-sm">No page visits recorded yet.</li>
            )}
          </ul>
        </div>
        <div className="terminal-border rounded-lg bg-card p-5">
          <div className="text-sm text-terminal mb-3">top AI queries</div>
          <ul className="space-y-2 text-sm">
            {aiData?.topQueries?.map((q: { question: string, timesAsked: number, rating: number }) => (
              <li key={q.question} className="flex items-start gap-3">
                <span className="text-terminal-dim">?</span>
                <span className="flex-1">{q.question}</span>
                <span className="text-muted-foreground text-xs">{q.timesAsked} asked</span>
                <span className={`text-xs ${q.rating > 0 ? "text-green-400" : q.rating < 0 ? "text-red-400" : "text-terminal"}`}>
                  {q.rating > 0 ? `+${q.rating}` : q.rating} rating
                </span>
              </li>
            ))}
            {aiData?.topQueries?.length === 0 && !aiIsLoading && (
              <li className="text-muted-foreground text-sm">No AI queries recorded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
