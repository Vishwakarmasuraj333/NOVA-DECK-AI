"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getTemplateById } from "@/lib/templates/registry";
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  Copy,
  Edit3,
  ExternalLink,
  Presentation,
  Clock,
  Layout,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface PresentationItem {
  id: string;
  title: string;
  slug: string;
  aspectRatio: string;
  templateId: string;
  updatedAt: string;
  slideCount: number;
}

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [presentations, setPresentations] = useState<PresentationItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rename modal
  const [renameTarget, setRenameTarget] = useState<PresentationItem | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const fetchPresentations = () => {
    setIsLoading(true);
    fetch(`/api/presentations?search=${encodeURIComponent(search)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.presentations) {
          setPresentations(data.presentations);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPresentations();
  }, [search]);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/presentations/${id}/duplicate`, { method: "POST" });
      if (res.ok) {
        fetchPresentations();
      }
    } catch {}
  };

  const handleMoveToTrash = async (id: string) => {
    if (!confirm("Move this presentation to trash?")) return;
    try {
      const res = await fetch(`/api/presentations/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPresentations();
      }
    } catch {}
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !newTitle.trim()) return;
    try {
      const res = await fetch(`/api/presentations/${renameTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (res.ok) {
        setRenameTarget(null);
        fetchPresentations();
      }
    } catch {}
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
            Workspace Presentations
          </h1>
          <p className="text-xs sm:text-sm text-nova-muted mt-1">
            Manage your persistent presentations, slides, and generated decks.
          </p>
        </div>

        <Link href="/create">
          <Button variant="cyan" size="md" className="font-bold gap-2">
            <Sparkles className="w-4 h-4" />
            Create Presentation
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-nova-surface p-3 rounded-2xl border border-nova-border">
        <Search className="w-4 h-4 text-nova-muted ml-1" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search presentations by title..."
          className="w-full bg-transparent text-sm text-nova-softWhite placeholder-nova-muted/60 focus:outline-none"
        />
      </div>

      {/* Presentation Cards List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-nova-surface/40 border border-nova-border animate-pulse" />
          ))}
        </div>
      ) : presentations.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-nova-border p-12 text-center space-y-4">
          <Presentation className="w-12 h-12 text-nova-cyan mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-nova-softWhite">No presentations created yet</h3>
          <p className="text-xs text-nova-muted max-w-md mx-auto">
            Ready to design your first deck? Generate complete presentations from a single prompt or source document.
          </p>
          <Link href="/create">
            <Button variant="cyan" size="md" className="font-bold">
              Generate Presentation Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((p) => {
            const template = getTemplateById(p.templateId);
            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-nova-surface border border-nova-border hover:border-nova-cyan/50 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Stage */}
                <div
                  onClick={() => router.push(`/editor/${p.id}`)}
                  className="relative aspect-video w-full overflow-hidden bg-nova-card cursor-pointer border-b border-nova-border/60 p-4 flex flex-col justify-between"
                  style={{
                    backgroundColor: template?.colorPalette?.background || "#10091F",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white/90 border border-white/10">
                      {p.aspectRatio}
                    </span>
                    <span className="text-[10px] font-bold text-white/80">
                      {p.slideCount || 8} slides
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-tight">
                      {p.title}
                    </h3>
                    <span className="text-[10px] text-white/60 block mt-1">
                      Theme: {template?.name || "Standard"}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-nova-surface flex items-center justify-between text-xs text-nova-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-nova-darkMuted" />
                    <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setRenameTarget(p);
                        setNewTitle(p.title);
                      }}
                      className="p-1.5 rounded-lg hover:text-white hover:bg-nova-surfaceHover transition-colors"
                      title="Rename"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="p-1.5 rounded-lg hover:text-white hover:bg-nova-surfaceHover transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveToTrash(p.id)}
                      className="p-1.5 rounded-lg hover:text-red-400 hover:bg-nova-surfaceHover transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/editor/${p.id}`}>
                      <Button variant="cyan" size="sm" className="h-7 px-2.5 text-xs font-bold ml-1">
                        Open
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Rename Presentation"
        maxWidth="sm"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button variant="cyan" size="sm" type="submit">
              Save Title
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
