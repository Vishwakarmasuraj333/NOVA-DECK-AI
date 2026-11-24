import React from "react";
import {
  Wand2,
  Palette,
  Download,
  FileCode,
  ShieldCheck,
  Layers,
  Sparkles,
  BarChart3,
  RefreshCw,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Wand2,
      title: "Context-Aware Neural Synthesis",
      description:
        "Transforms complex research papers, dissertations, and executive briefs into logical slide narratives with tailored layout topologies.",
      badge: "Gemini 1.5",
    },
    {
      icon: Palette,
      title: "28 Editorial Design Templates",
      description:
        "Genuinely distinct visual design languages—from VR neon and terminal cybersecurity to high-stakes venture pitches and Swiss typography.",
      badge: "Custom Tokens",
    },
    {
      icon: Download,
      title: "Real PPTX & PDF Downloads",
      description:
        "Generates true Microsoft PowerPoint (.pptx) documents with native vector shapes, editable text blocks, and structured charts.",
      badge: "Native Binary",
    },
    {
      icon: RefreshCw,
      title: "Granular Slide AI Regeneration",
      description:
        "Refine individual slides on demand—expand depth, shorten bullet points, adapt persuasive tone, or rewrite technical diagrams.",
      badge: "Real-Time",
    },
    {
      icon: BarChart3,
      title: "Editable Charts & Diagrams",
      description:
        "Visualize cohorts, metrics, and architecture topologies with interactive data points that render seamlessly into exported files.",
      badge: "Interactive",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Workspace Security",
      description:
        "Strict workspace isolation, verified citation flags, role-based permissions, and zero data leakage to public models.",
      badge: "Zero-Trust",
    },
  ];

  return (
    <section className="py-24 bg-nova-midnight relative border-t border-nova-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-surface border border-nova-border text-xs font-semibold text-nova-magenta mb-4">
            <Sparkles className="w-3.5 h-3.5 text-nova-magenta" />
            <span>Built For Serious Presentations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nova-softWhite tracking-tight">
            Not another toy mockup generator.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-nova-muted">
            NOVA DECK AI provides the exact depth, editorial typography, and file fidelity demanded by investors, academic viva examiners, and board members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-nova-surface/60 border border-nova-border/80 p-7 hover:border-nova-magenta/50 hover:bg-nova-surfaceHover/80 transition-all duration-300 shadow-lg hover:shadow-nova-glow/10"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-nova-surfaceHover border border-nova-borderLight flex items-center justify-center text-nova-cyan group-hover:text-nova-magenta transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-nova-card border border-nova-border text-nova-cyan">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-nova-softWhite mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-nova-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
