"use client";

import React from "react";
import { SlideDocument, TemplateDefinition } from "@/types";
import {
  Quote,
  CheckCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface SlideRendererProps {
  slide: SlideDocument;
  template?: TemplateDefinition;
  aspectRatio?: "16:9" | "4:3" | "A4";
  isInteractive?: boolean;
  onEditField?: (field: keyof SlideDocument, value: any) => void;
  scale?: number;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  template,
  aspectRatio = "16:9",
  isInteractive = false,
  onEditField,
  scale = 1,
}) => {
  const palette = template?.colorPalette || {
    background: "#10091F",
    surface: "#1B1230",
    primary: "#E82DA8",
    accent: "#43D5E8",
    text: "#F8F5FF",
    muted: "#B7AEC9",
    border: "#2E224D",
  };

  const bgStyle = slide.themeTokens?.customBg || palette.background;
  const textColor = slide.themeTokens?.customText || palette.text;
  const primaryColor = slide.themeTokens?.customPrimary || palette.primary;
  const accentColor = slide.themeTokens?.customAccent || palette.accent;

  const aspectClass =
    aspectRatio === "4:3"
      ? "aspect-[4/3] max-w-[900px]"
      : "aspect-[16/9] max-w-[1200px]";

  // Helper for inline editable text
  const renderEditable = (
    text: string | undefined,
    field: keyof SlideDocument,
    placeholder: string,
    className: string,
    as: "h1" | "h2" | "h3" | "p" | "span" = "p"
  ) => {
    if (!isInteractive) {
      const Tag = as;
      return <Tag className={className}>{text || placeholder}</Tag>;
    }

    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onEditField?.(field, e.currentTarget.innerText)}
        className={`${className} outline-none focus:ring-1 focus:ring-nova-cyan/50 rounded px-1 -mx-1 hover:bg-white/5 transition-colors cursor-text`}
      >
        {text || placeholder}
      </div>
    );
  };

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-2xl transition-all select-none border border-white/10`}
      style={{
        backgroundColor: bgStyle,
        color: textColor,
      }}
    >
      {/* Subtle decorative background gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 80% 20%, ${primaryColor} 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
        }}
      />

      {/* Slide Layout Renderers */}
      <div className="relative z-10 w-full h-full p-8 sm:p-12 flex flex-col justify-between">
        {/* COVER LAYOUT */}
        {slide.layoutType === "cover" && (
          <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase" style={{ color: accentColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>{template?.name || "Executive Presentation"}</span>
            </div>

            {renderEditable(
              slide.title,
              "title",
              "Enter Presentation Title",
              "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight",
              "h1"
            )}

            {renderEditable(
              slide.subtitle,
              "subtitle",
              "Enter Subtitle or Key Thesis",
              "text-lg sm:text-2xl font-light max-w-2xl text-opacity-90",
              "p"
            )}

            {slide.imageAsset && (
              <div className="w-full max-w-lg h-44 rounded-xl overflow-hidden shadow-lg border border-white/10 mt-4">
                <img
                  src={slide.imageAsset}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* AGENDA LAYOUT */}
        {slide.layoutType === "agenda" && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase opacity-75" style={{ color: accentColor }}>
                Session Roadmap
              </span>
              {renderEditable(slide.title, "title", "Agenda & Structure", "text-2xl sm:text-4xl font-bold mt-1", "h2")}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
              {(slide.bulletPoints && slide.bulletPoints.length > 0
                ? slide.bulletPoints
                : ["Executive Summary", "Market Landscape", "Architecture Deep Dive", "Financial Projections"]
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}>
                    0{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-semibold">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs opacity-60">Interactive Presentation • NOVA DECK AI</p>
          </div>
        )}

        {/* STATS / METRICS LAYOUT */}
        {slide.layoutType === "stats" && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase opacity-75" style={{ color: accentColor }}>
                Key Performance Metrics
              </span>
              {renderEditable(slide.title, "title", "Traction & Moat", "text-2xl sm:text-4xl font-bold mt-1", "h2")}
              {slide.subtitle && <p className="text-sm opacity-80 mt-1">{slide.subtitle}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-auto">
              {(slide.bulletPoints && slide.bulletPoints.length > 0
                ? slide.bulletPoints
                : ["$4.2M ARR (+340% YoY)", "99.98% Model Uptime", "-6.4% Net Revenue Churn"]
              ).map((stat, idx) => {
                const parts = stat.split(" - ");
                const big = parts[0] || stat;
                const desc = parts[1] || "Target benchmark exceeded";
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
                      <span className="text-xs font-semibold uppercase opacity-75">Metric 0{idx + 1}</span>
                    </div>
                    <span className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
                      {big}
                    </span>
                    <span className="text-xs opacity-80 mt-2">{desc}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs opacity-60 pt-2 border-t border-white/10">
              <span>Audited Q4 Benchmark</span>
              <span>NOVA DECK AI</span>
            </div>
          </div>
        )}

        {/* CHART LAYOUT */}
        {slide.layoutType === "chart" && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase opacity-75" style={{ color: accentColor }}>
                Quantitative Analysis
              </span>
              {renderEditable(slide.title, "title", "Performance Distribution", "text-2xl sm:text-4xl font-bold mt-1", "h2")}
            </div>

            <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* SVG Bar Chart Visualization */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-80">
                  {slide.chartData?.title || "Cohort Growth Metrics"}
                </h4>
                <div className="space-y-3">
                  {(slide.chartData?.data || [
                    { label: "Q1 Baseline", value: 38 },
                    { label: "Q2 Expansion", value: 65 },
                    { label: "Q3 Scale", value: 89 },
                    { label: "Q4 Peak", value: 112 },
                  ]).map((pt, idx) => {
                    const maxVal = 120;
                    const pct = Math.min(100, Math.round((pt.value / maxVal) * 100));
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{pt.label}</span>
                          <span style={{ color: accentColor }}>{pt.value}</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: idx % 2 === 0 ? primaryColor : accentColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accompanying analysis notes */}
              <div className="space-y-4">
                <p className="text-sm leading-relaxed opacity-90">{slide.body || "Observed exponential compounding acceleration across core enterprise cohorts with consistent unit economic expansion."}</p>
                <div className="space-y-2">
                  {slide.bulletPoints?.map((bp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs opacity-85">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs opacity-60">Verified Statistical Analysis</div>
          </div>
        )}

        {/* IMAGE WITH TEXT / DEFAULT LAYOUT */}
        {slide.layoutType !== "cover" &&
          slide.layoutType !== "agenda" &&
          slide.layoutType !== "stats" &&
          slide.layoutType !== "chart" && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-75" style={{ color: accentColor }}>
                  {slide.layoutType.replace("_", " ")}
                </span>
                {renderEditable(slide.title, "title", "Slide Title", "text-2xl sm:text-4xl font-bold mt-1", "h2")}
                {slide.subtitle && (
                  <p className="text-sm sm:text-base opacity-80 mt-1 font-light" style={{ color: primaryColor }}>
                    {slide.subtitle}
                  </p>
                )}
              </div>

              <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  {slide.body && (
                    <p className="text-sm sm:text-base leading-relaxed opacity-90">{slide.body}</p>
                  )}
                  {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                    <ul className="space-y-2.5">
                      {slide.bulletPoints.map((bp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {slide.imageAsset && (
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 aspect-video">
                    <img
                      src={slide.imageAsset}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    {slide.imagePrompt && (
                      <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-white/80 line-clamp-1">
                        Prompt: {slide.imagePrompt}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Citations footer if present */}
              {slide.citations && slide.citations.length > 0 && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] opacity-75">
                  <span className="font-bold">Citations:</span>
                  {slide.citations.map((c, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-nova-cyan" />
                      {c.source}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};
export default SlideRenderer;
