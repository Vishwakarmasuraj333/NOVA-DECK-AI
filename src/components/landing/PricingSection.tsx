"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles, Zap, Shield } from "lucide-react";

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Starter",
      description: "For students, academics, and individual presentation creators.",
      price: billingCycle === "monthly" ? "$0" : "$0",
      period: "forever free",
      badge: "Free Forever",
      highlight: false,
      features: [
        "Access to 14 free visual templates",
        "Generate up to 5 complete decks/month",
        "Up to 10 slides per presentation",
        "Standard AI outline & content synthesis",
        "High-resolution PDF export",
        "Public shareable presentation links",
      ],
      ctaText: "Start For Free",
      ctaHref: "/create",
      ctaVariant: "outline" as const,
    },
    {
      name: "Pro Studio",
      description: "For founders, researchers, consultants, and enterprise speakers.",
      price: billingCycle === "monthly" ? "$24" : "$19",
      period: billingCycle === "monthly" ? "per month" : "per month, billed annually",
      badge: "Most Popular",
      highlight: true,
      features: [
        "Unlock all 28+ premium visual templates",
        "Unlimited presentation creation",
        "Up to 30 slides per presentation",
        "Editable Microsoft PowerPoint (.PPTX) export",
        "Slide AI regeneration & custom rewrite prompts",
        "Custom brand color tokens & typography",
        "Full citation audit and verification flags",
        "Priority Gemini 1.5 inference speeds",
      ],
      ctaText: "Upgrade to Pro",
      ctaHref: "/pricing",
      ctaVariant: "primary" as const,
    },
    {
      name: "Enterprise",
      description: "For teams, institutions, and departments requiring governance.",
      price: billingCycle === "monthly" ? "$79" : "$65",
      period: "per seat / month",
      badge: "Team License",
      highlight: false,
      features: [
        "Everything in Pro Studio",
        "Shared team workspace & asset repository",
        "Custom corporate template engineering",
        "Dedicated API key configuration & zero-logging",
        "Admin user management & audit logs",
        "Single Sign-On (SAML / SSO)",
        "Dedicated onboarding & 24/7 SLA",
      ],
      ctaText: "Contact Sales",
      ctaHref: "/contact",
      ctaVariant: "secondary" as const,
    },
  ];

  return (
    <section className="py-24 bg-nova-midnight relative border-t border-nova-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-nova-magenta mb-2 block">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nova-softWhite tracking-tight">
            Flexible plans for every stage of impact.
          </h2>
          <p className="mt-4 text-base text-nova-muted">
            Start creating free presentations immediately. Upgrade anytime to unlock premium templates and PPTX downloads.
          </p>

          {/* Toggle Monthly / Annual */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-nova-surface border border-nova-border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-nova-magenta text-white shadow-sm"
                  : "text-nova-muted hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-nova-magenta text-white shadow-sm"
                  : "text-nova-muted hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-nova-cyan/20 text-nova-cyan text-[10px]">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "bg-nova-surface border-2 border-nova-magenta shadow-nova-glow"
                  : "bg-nova-surface/60 border border-nova-border hover:border-nova-borderLight"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-nova-magenta to-nova-cyan text-white text-xs font-extrabold shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-nova-softWhite">
                    {plan.name}
                  </h3>
                  {!plan.highlight && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-nova-card border border-nova-border text-nova-muted font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-nova-muted mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mb-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-nova-softWhite">
                    {plan.price}
                  </span>
                  <span className="text-xs text-nova-muted">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-nova-softWhite/90">
                      <Check className="w-4 h-4 text-nova-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={plan.ctaHref} className="w-full">
                <Button variant={plan.ctaVariant} size="lg" className="w-full font-bold">
                  {plan.ctaText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
