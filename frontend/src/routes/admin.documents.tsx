import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/documents")({
  component: Documents,
});

type Doc = { id: string; name: string; size: string; indexed: boolean };

const seed: Doc[] = [
  { id: "1", name: "Resume.pdf", size: "412 KB", indexed: true },
  { id: "2", name: "Projects.md", size: "18 KB", indexed: true },
  { id: "3", name: "Skills.md", size: "6 KB", indexed: true },
  { id: "4", name: "AI-Notes.md", size: "24 KB", indexed: true },
];

function Documents() {
  const [docs, setDocs] = useState<Doc[]>(seed);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const added: Doc[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      indexed: false,
    }));
    setDocs((d) => [...added, ...d]);
    // fake indexing
    setTimeout(() => {
      setDocs((d) => d.map((x) => (added.find((a) => a.id === x.id) ? { ...x, indexed: true } : x)));
    }, 1500);
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <div className="text-terminal-dim text-sm">$ upload ./docs</div>
        <h1 className="text-2xl font-bold text-terminal text-glow mt-1">Upload Documents</h1>
        <p className="text-sm text-muted-foreground">
          Documents feed the AI assistant's knowledge base.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`terminal-border rounded-lg bg-card p-10 text-center cursor-pointer transition-colors ${
          drag ? "border-terminal bg-muted" : "hover:border-terminal"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="w-8 h-8 mx-auto text-terminal" />
        <div className="mt-3 text-terminal">drop files here</div>
        <div className="text-xs text-muted-foreground mt-1">
          PDF, MD, TXT · or click to browse
        </div>
      </div>

      <div className="terminal-border rounded-lg bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border text-xs text-terminal-dim uppercase bg-background/50">
          ./documents ({docs.length})
        </div>
        <ul>
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 px-4 py-3 border-t border-border first:border-t-0 hover:bg-background/40"
            >
              <FileText className="w-4 h-4 text-terminal" />
              <div className="flex-1">
                <div className="text-sm">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">{d.size}</div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${
                  d.indexed
                    ? "border-terminal text-terminal"
                    : "border-border text-muted-foreground animate-pulse"
                }`}
              >
                {d.indexed ? "indexed" : "indexing..."}
              </span>
              <button
                onClick={() => setDocs((all) => all.filter((x) => x.id !== d.id))}
                className="text-muted-foreground hover:text-destructive p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
