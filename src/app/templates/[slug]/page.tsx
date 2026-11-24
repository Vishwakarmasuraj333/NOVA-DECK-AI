"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { getTemplateById } from "@/lib/templates/registry";
import {
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Palette,
  Layers,
  FileText,
  Sliders,
} from "lucide-react";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const template = getTemplateById(slug);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  if (!template) {
    return (
      <div className="min-h-screen bg-nova-midnight text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Template Not Found</h2>
          <Link href="/templates">
            <Button variant="cyan">Back to Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sampleSlides = template.sampleSlides.length > 0
    ? template.sampleSlides
    : [
        {
          order: 1,
          title: template.name,
          subtitle: template.description,
          layoutType: "cover" as const,
          imageAsset: template.previewThumbnail,
        },
        {
          order: 2,
          title: "Executive Synthesis & Strategic Horizon",
          subtitle: "Core Architecture Principles",
          layoutType: "stats" as const,
          bulletPoints: [
            "Sub-4ms real-time throughput",
            "Validated 99.98% reliability tier",
            "Zero regression across production pipelines",
          ],
        },
      ];

  const handleUseTemplate = () => {
    if (template.isPremium) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/create?template=${template.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full flex-1">
        {/* Breadcrumb navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs text-nova-muted">
          <Link href="/templates" className="hover:text-nova-cyan flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Templates
          </Link>
          <span>/</span>
          <span className="text-nova-softWhite font-semibold">{template.name}</span>
        </div>

        {/* Hero header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-nova-cyan uppercase px-2 py-0.5 rounded bg-nova-surface border border-nova-border">
                {template.category}
              </span>
              {template.isPremium ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-nova-magenta/20 text-nova-magenta border border-nova-magenta/40 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  PRO TEMPLATE
                </span>
              ) : (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  FREE TEMPLATE
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-nova-softWhite tracking-tight">
              {template.name}
            </h1>
            <p className="text-base text-nova-muted leading-relaxed max-w-2xl">
              {template.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {template.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-nova-surface/60 border border-nova-border text-nova-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-nova-surface/80 rounded-2xl border border-nova-border p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-nova-softWhite">Template Specifications</h3>
            <div className="space-y-2 text-xs text-nova-muted">
              <div className="flex justify-between py-1 border-b border-nova-border/50">
                <span>Supported Layouts:</span>
                <span className="font-semibold text-nova-softWhite">{template.supportedLayouts.length} Types</span>
              </div>
              <div className="flex justify-between py-1 border-b border-nova-border/50">
                <span>Aspect Ratio:</span>
                <span className="font-semibold text-nova-softWhite">16:9 & 4:3</span>
              </div>
              <div className="flex justify-between py-1 border-b border-nova-border/50">
                <span>Export Fidelity:</span>
                <span className="font-semibold text-nova-softWhite">PPTX & PDF</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Color Palette:</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/30"
                    style={{ backgroundColor: template.colorPalette.primary }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/30"
                    style={{ backgroundColor: template.colorPalette.accent }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/30"
                    style={{ backgroundColor: template.colorPalette.background }}
                  />
                </div>
              </div>
            </div>

            <Button
              variant={template.isPremium ? "primary" : "cyan"}
              size="lg"
              onClick={handleUseTemplate}
              className="w-full font-bold gap-2"
            >
              {template.isPremium && <Lock className="w-4 h-4" />}
              Use This Template
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Live Slide Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-nova-softWhite flex items-center gap-2">
              <Sliders className="w-5 h-5 text-nova-cyan" />
              Interactive Sample Slide Preview
            </h2>
            <div className="flex items-center gap-2">
              {sampleSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSampleIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                    activeSampleIndex === idx
                      ? "bg-nova-cyan text-nova-midnight border-nova-cyan"
                      : "bg-nova-surface text-nova-muted border-nova-border hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-nova-border bg-nova-surface/40 p-4 sm:p-8 flex items-center justify-center shadow-2xl">
            <div className="w-full max-w-4xl">
              <SlideRenderer
                slide={sampleSlides[activeSampleIndex] as any}
                template={template}
                aspectRatio="16:9"
                isInteractive={false}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade to Unlock Pro Templates"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-nova-card border border-nova-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nova-magenta/20 border border-nova-magenta flex items-center justify-center text-nova-magenta flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-nova-softWhite">{template.name}</h4>
              <p className="text-xs text-nova-muted">
                Requires an active Pro Studio or Enterprise subscription.
              </p>
            </div>
          </div>

          <p className="text-xs text-nova-muted leading-relaxed">
            Unlock all 28+ cinematic presentation templates, PPTX exports, and AI slide regenerations with Pro Studio.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/pricing">
              <Button variant="primary" size="lg" className="w-full font-bold">
                Upgrade to Pro Studio ($19/mo)
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUpgradeModal(false);
                router.push(`/create?template=virtual-reality-lab`);
              }}
            >
              Or use free Virtual Reality Lab template
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
