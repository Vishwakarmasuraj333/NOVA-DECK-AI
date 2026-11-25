"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";

interface TrashItem {
  id: string;
  title: string;
  updatedAt: string;
  deletedAt: string;
}

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TrashItem | null>(null);

  const fetchTrash = () => {
    setIsLoading(true);
    fetch("/api/presentations?filter=trash")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.presentations) setItems(data.presentations);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/presentations/${id}/trash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      if (res.ok) {
        toast.success("Presentation restored to workspace");
        fetchTrash();
      }
    } catch {
      toast.error("Failed to restore presentation");
    }
  };

  const confirmPermanentDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/presentations/${id}/trash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_permanently" }),
      });
      if (res.ok) {
        toast.success("Presentation permanently destroyed");
        fetchTrash();
      }
    } catch {
      toast.error("Failed to delete presentation");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
          Trash & Deleted Decks
        </h1>
        <p className="text-xs sm:text-sm text-nova-muted mt-1">
          Items in trash can be restored to your active workspace or permanently purged.
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-nova-muted">Loading trash...</div>
      ) : items.length === 0 ? (
        <div className="p-12 rounded-3xl border border-nova-border bg-nova-surface/50 text-center space-y-3">
          <Trash2 className="w-10 h-10 text-nova-muted mx-auto" />
          <h3 className="text-base font-bold text-nova-softWhite">Trash is Empty</h3>
          <p className="text-xs text-nova-muted">No deleted presentations found in your workspace.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-nova-surface border border-nova-border flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-bold text-nova-softWhite">{item.title}</h4>
                <span className="text-[10px] text-nova-muted">
                  Moved to trash: {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : "Recently"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(item.id)}
                  className="gap-1.5 text-xs text-nova-cyan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restore
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                  className="gap-1.5 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Permanently
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App Permanent Deletion Confirmation Modal (Replaces browser confirm) */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Permanently Destroy Presentation?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-200 leading-relaxed">
              Permanently destroy <strong className="text-white">"{deleteTarget?.title}"</strong> and all associated slide snapshots? This action is completely irreversible.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmPermanentDelete}>
              Permanently Destroy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
