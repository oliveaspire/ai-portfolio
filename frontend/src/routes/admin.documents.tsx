import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/documents")({
  component: Documents,
});

type Doc = { id: string; originalName: string; size: number; indexed: boolean };

function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("admin_token");
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(`${API_URL}/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const uploaded = await res.json();
        setDocs((prev) => [...uploaded, ...prev]);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch (e) {
      console.error("Failed to upload documents", e);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`${API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete document", e);
    }
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
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">loading...</div>
        ) : docs.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">no documents found</div>
        ) : (
          <ul>
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 px-4 py-3 border-t border-border first:border-t-0 hover:bg-background/40"
              >
                <FileText className="w-4 h-4 text-terminal" />
                <div className="flex-1">
                  <div className="text-sm">{d.originalName}</div>
                  <div className="text-[11px] text-muted-foreground">{(d.size / 1024).toFixed(1)} KB</div>
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
                  onClick={() => handleDelete(d.id)}
                  className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

