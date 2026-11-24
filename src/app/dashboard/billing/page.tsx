"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Check, Lock, Sparkles, CreditCard, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      });
  }, []);

  const handleUpgrade = async (plan: string) => {
    setIsUpgrading(true);
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        setSuccess(true);
        setUser((prev: any) => ({
          ...prev,
          role: "PRO",
          subscription: { plan: "PRO", status: "ACTIVE" },
        }));
      }
    } catch {
      alert("Failed to process upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const currentPlan = user?.subscription?.plan || "FREE";

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite">
          Subscription & Billing
        </h1>
        <p className="text-xs sm:text-sm text-nova-muted mt-1">
          Manage your subscription tier, billing cycle, and template access entitlements.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span>Your workspace has been successfully upgraded to Pro Studio! All 28 templates are unlocked.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-nova-surface border border-nova-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-nova-softWhite">Free Starter</h3>
              {currentPlan === "FREE" && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Current Tier
                </span>
              )}
            </div>
            <p className="text-xs text-nova-muted mb-6">
              Standard access for basic presentation generation.
            </p>
            <div className="text-3xl font-black text-nova-softWhite mb-6">$0</div>
            <ul className="space-y-3 text-xs text-nova-muted">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> 14 Free Templates</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> 5 Presentations/mo</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> High-res PDF Export</li>
            </ul>
          </div>
          <div className="pt-8">
            <Button variant="outline" size="md" disabled className="w-full">
              {currentPlan === "FREE" ? "Active" : "Downgrade"}
            </Button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl bg-nova-surface border-2 border-nova-magenta shadow-nova-glow flex flex-col justify-between relative">
          <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-nova-magenta to-nova-cyan text-white text-[10px] font-black uppercase">
            Recommended
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-nova-softWhite">Pro Studio</h3>
              {currentPlan === "PRO" && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-nova-magenta/20 text-nova-magenta font-bold">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-nova-muted mb-6">
              Full unconstrained access for serious speakers and founders.
            </p>
            <div className="text-3xl font-black text-nova-softWhite mb-6">$24 <span className="text-xs text-nova-muted font-normal">/ mo</span></div>
            <ul className="space-y-3 text-xs text-nova-softWhite/90">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> All 28+ Custom Templates Unlocked</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> Unlimited Presentations & Slides</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> Editable PowerPoint (.PPTX) Export</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-nova-cyan" /> AI Slide Rewrites & Translation</li>
            </ul>
          </div>
          <div className="pt-8">
            <Button
              variant="primary"
              size="md"
              isLoading={isUpgrading}
              disabled={currentPlan === "PRO"}
              onClick={() => handleUpgrade("PRO")}
              className="w-full font-bold"
            >
              {currentPlan === "PRO" ? "Current Subscription" : "Upgrade to Pro Studio"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
