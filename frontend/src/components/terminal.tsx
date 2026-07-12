import { ReactNode } from "react";

export function Terminal({
  title = "yash@portfolio: ~",
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`terminal-border rounded-lg bg-card overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-background/60">
        <span className="w-3 h-3 rounded-full bg-destructive/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-terminal/80" />
        <span className="ml-2 text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="p-5 md:p-6 text-sm scanlines">{children}</div>
    </div>
  );
}

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <div className="text-terminal">
      <span className="text-terminal-dim">yash@portfolio</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-accent">~</span>
      <span className="text-muted-foreground">$ </span>
      <span>{children}</span>
    </div>
  );
}

export function SectionHeader({
  cmd,
  title,
  desc,
}: {
  cmd: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-8">
      <Prompt>{cmd}</Prompt>
      <h1 className="mt-3 text-3xl md:text-4xl font-bold text-terminal text-glow">
        {title}
      </h1>
      {desc && <p className="mt-2 text-muted-foreground max-w-2xl">{desc}</p>}
    </div>
  );
}
