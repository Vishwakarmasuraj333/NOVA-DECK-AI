"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
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
      if (res.ok) fetchTrash();
    } catch {}
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Permanently destroy this presentation and all associated slide snapshots? This action is irreversible.")) return;
    try {
      const res = await fetch(`/api/presentations/${id}/trash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_permanently" }),
      });
      if (res.ok) fetchTrash();
    } catch {}
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
                  onClick={() => handlePermanentDelete(item.id)}
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
    </div>
  );
}
