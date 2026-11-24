"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Presentation,
  Layers,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Server,
  Zap,
} from "lucide-react";

export default function AdminConsolePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-nova-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-xl bg-nova-surface border border-nova-border text-nova-muted hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-nova-softWhite">NOVA DECK AI Admin Console</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nova-cyan/20 text-nova-cyan border border-nova-cyan/40">
                PROD
              </span>
            </div>
            <p className="text-xs text-nova-muted mt-0.5">
              Live database telemetry, provider statuses, audit logs, and user entitlements.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-nova-muted">Fetching real database metrics...</div>
      ) : (
        <>
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-2">
              <span className="text-xs font-bold uppercase text-nova-muted">Total Registered Users</span>
              <div className="text-3xl font-black text-nova-softWhite">{data?.metrics?.totalUsers || 0}</div>
              <span className="text-[10px] text-nova-cyan">Derived from User table</span>
            </div>

            <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-2">
              <span className="text-xs font-bold uppercase text-nova-muted">Total Presentations</span>
              <div className="text-3xl font-black text-nova-softWhite">{data?.metrics?.totalPresentations || 0}</div>
              <span className="text-[10px] text-nova-cyan">Derived from Presentation table</span>
            </div>

            <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-2">
              <span className="text-xs font-bold uppercase text-nova-muted">Total Slides Stored</span>
              <div className="text-3xl font-black text-nova-softWhite">{data?.metrics?.totalSlides || 0}</div>
              <span className="text-[10px] text-nova-cyan">Derived from Slide table</span>
            </div>

            <div className="p-6 rounded-2xl bg-nova-surface border border-nova-border space-y-2">
              <span className="text-xs font-bold uppercase text-nova-muted">Audit Events Recorded</span>
              <div className="text-3xl font-black text-nova-softWhite">{data?.metrics?.totalAuditEvents || 0}</div>
              <span className="text-[10px] text-nova-cyan">Derived from AuditLog table</span>
            </div>
          </div>

          {/* Provider Configuration Status (Secure - Never Exposes Secrets) */}
          <div className="p-6 rounded-3xl bg-nova-surface border border-nova-border space-y-4">
            <h3 className="text-base font-bold text-nova-softWhite flex items-center gap-2">
              <Server className="w-5 h-5 text-nova-cyan" />
              External Service Providers Configuration Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-nova-midnight border border-nova-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-nova-softWhite">Google Gemini 1.5 Text AI</h4>
                  <p className="text-xs text-nova-muted">Environment Variable: {data?.providers?.ai?.envVarName}</p>
                </div>
                {data?.providers?.ai?.isConfigured ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Key Missing
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-nova-midnight border border-nova-border flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-nova-softWhite">Image Generation Engine</h4>
                  <p className="text-xs text-nova-muted">Active: {data?.providers?.image?.activeProvider}</p>
                </div>
                {data?.providers?.image?.isConfigured ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center gap-1">
                    Curated Fallback
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Real Users Table */}
          <div className="p-6 rounded-3xl bg-nova-surface border border-nova-border space-y-4">
            <h3 className="text-base font-bold text-nova-softWhite flex items-center gap-2">
              <Users className="w-5 h-5 text-nova-cyan" />
              Registered Accounts ({data?.users?.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-nova-border text-nova-muted uppercase font-bold">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Plan</th>
                    <th className="py-2.5">Decks Created</th>
                    <th className="py-2.5">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nova-border/50">
                  {data?.users?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-nova-surfaceHover">
                      <td className="py-2.5 font-bold text-nova-softWhite">{u.name}</td>
                      <td className="py-2.5 text-nova-muted">{u.email}</td>
                      <td className="py-2.5 font-mono text-nova-cyan">{u.role}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${u.plan === "PRO" ? "bg-nova-magenta/20 text-nova-magenta" : "bg-white/10 text-white"}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-2.5">{u.presentationCount}</td>
                      <td className="py-2.5 text-nova-darkMuted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="p-6 rounded-3xl bg-nova-surface border border-nova-border space-y-4">
            <h3 className="text-base font-bold text-nova-softWhite flex items-center gap-2">
              <Activity className="w-5 h-5 text-nova-cyan" />
              Recent Audit Log Events
            </h3>
            <div className="space-y-2">
              {data?.auditLogs?.map((log: any) => (
                <div key={log.id} className="p-3 rounded-xl bg-nova-midnight border border-nova-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-nova-magenta font-bold">{log.action}</span>
                    <span className="text-nova-muted">by {log.user?.email || "System"}</span>
                  </div>
                  <span className="text-[10px] text-nova-darkMuted font-mono">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
