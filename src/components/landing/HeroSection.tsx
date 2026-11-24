"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, Wand2, FileText, CheckCircle2 } from "lucide-react";

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      router.push("/create");
      return;
    }
    router.push(`/create?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const samplePrompts = [
    "AI in Cybersecurity for an MSc IT thesis viva presentation",
    "Series A investor pitch deck for an autonomous drone logistics startup",
    "Corporate quarterly ESG sustainability roadmap & carbon audit",
    "SaaS product launch deck with metrics and pricing tier breakdown",
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-nova-midnight">
      {/* Background cinematic lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-nova-hero blur-3xl pointer-events-none opacity-80" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-nova-magenta/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-nova-cyan/15 blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F8F5FF 1px, transparent 1px), linear-gradient(90deg, #F8F5FF 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nova-surface/80 border border-nova-cyan/30 text-xs font-semibold text-nova-cyan shadow-sm mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-nova-cyan" />
          <span>Next-Generation Neural Presentation Studio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-nova-cyan"></span>
          <span className="text-nova-softWhite font-bold">28+ Curated Styles</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-nova-softWhite leading-[1.08] mb-6">
          Cinematic AI Presentations.{" "}
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-nova-magenta via-nova-softWhite to-nova-cyan">
            Crafted for High-Stakes Impact.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-nova-muted mb-10 leading-relaxed font-normal">
          Generate publication-ready decks from a single prompt, research paper, or document. Engineered with deep styling systems, editable charts, and real export pipelines.
        </p>

        {/* Interactive Prompt Generator Box */}
        <div className="max-w-3xl mx-auto mb-8">
          <form
            onSubmit={handleGenerate}
            className="p-2 sm:p-2.5 rounded-2xl bg-nova-surface/90 border border-nova-border/90 backdrop-blur-xl shadow-2xl focus-within:border-nova-cyan/60 focus-within:ring-2 focus-within:ring-nova-cyan/20 transition-all flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 w-full px-3 py-2 sm:py-0">
              <Wand2 className="w-5 h-5 text-nova-cyan flex-shrink-0" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What presentation do you want to create today? (e.g., MSc IT Viva on AI in Cybersecurity)"
                className="w-full bg-transparent text-nova-softWhite placeholder-nova-muted/70 text-sm sm:text-base focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full sm:w-auto flex-shrink-0 gap-2 font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Generate
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Prompt chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-nova-darkMuted font-medium">Try:</span>
            {samplePrompts.slice(0, 2).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(item)}
                className="px-2.5 py-1 rounded-lg bg-nova-surface/50 hover:bg-nova-surfaceHover text-nova-muted hover:text-nova-softWhite border border-nova-border/60 transition-colors text-left truncate max-w-xs"
              >
                &ldquo;{item}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Social Proof / Trust Indicators */}
        <div className="pt-6 border-t border-nova-border/40 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-nova-muted font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
            <span>28 Custom Visual Templates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
            <span>Real PPTX & PDF Downloads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
            <span>Google Gemini Structured Schema</span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
