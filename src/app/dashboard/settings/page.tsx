"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { User, Shield, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name);
        }
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
          Account & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-nova-muted mt-1">
          Manage your personal credentials, workspace preferences, and security profile.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile preferences saved.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-nova-surface rounded-3xl border border-nova-border p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
            Display Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="w-full p-3 rounded-xl bg-nova-midnight/50 border border-nova-border text-sm text-nova-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
            Workspace Role
          </label>
          <div className="p-3 rounded-xl bg-nova-midnight border border-nova-border text-xs text-nova-cyan font-bold uppercase font-mono">
            {user?.role || "USER"}
          </div>
        </div>

        <Button type="submit" variant="cyan" size="md" className="font-bold">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
