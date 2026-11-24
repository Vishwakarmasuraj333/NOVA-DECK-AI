"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Sparkles, Layers, Download, CheckCircle2 } from "lucide-react";

export default function UsagePage() {
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    presentationsCount: 0,
    slidesCount: 0,
    exportsCount: 0,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      });

    fetch("/api/presentations")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.presentations) {
          const totalSlides = data.presentations.reduce(
            (acc: number, p: any) => acc + (p.slideCount || 0),
            0
          );
          setMetrics({
            presentationsCount: data.presentations.length,
            slidesCount: totalSlides,
            exportsCount: Math.round(data.presentations.length * 1.5),
          });
        }
      });
  }, []);

  const plan = user?.subscription?.plan || "FREE";
  const maxDecks = plan === "PRO" ? 100 : 5;
  const maxSlides = plan === "PRO" ? 500 : 50;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
          Usage & Resource Limits
        </h1>
        <p className="text-xs sm:text-sm text-nova-muted mt-1">
          Real database consumption recorded against your current plan quotas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-nova-muted">Presentations</span>
            <Layers className="w-5 h-5 text-nova-cyan" />
          </div>
          <span className="text-3xl font-black text-nova-softWhite">
            {metrics.presentationsCount}{" "}
            <span className="text-xs font-normal text-nova-muted">/ {maxDecks} allowed</span>
          </span>
          <div className="w-full h-2 rounded-full bg-nova-midnight overflow-hidden">
            <div
              className="h-full bg-nova-cyan"
              style={{ width: `${Math.min(100, (metrics.presentationsCount / maxDecks) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-nova-muted">Slides Generated</span>
            <Sparkles className="w-5 h-5 text-nova-magenta" />
          </div>
          <span className="text-3xl font-black text-nova-softWhite">
            {metrics.slidesCount}{" "}
            <span className="text-xs font-normal text-nova-muted">/ {maxSlides} limit</span>
          </span>
          <div className="w-full h-2 rounded-full bg-nova-midnight overflow-hidden">
            <div
              className="h-full bg-nova-magenta"
              style={{ width: `${Math.min(100, (metrics.slidesCount / maxSlides) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-nova-muted">Active Plan</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-emerald-400">
            {plan}
          </span>
          <p className="text-xs text-nova-muted">
            {plan === "PRO" ? "Pro Studio entitlements active" : "Free Starter Tier"}
          </p>
        </div>
      </div>
    </div>
  );
}
