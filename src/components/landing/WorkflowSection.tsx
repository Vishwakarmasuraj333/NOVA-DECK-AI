import React from "react";
import { FileInput, Sliders, Sparkles, MonitorPlay } from "lucide-react";

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: FileInput,
      title: "Input Prompt or Source Doc",
      description:
        "Provide a topic, upload a research PDF, or paste an executive thesis. Outline your goals and target audience.",
    },
    {
      step: "02",
      icon: Sliders,
      title: "Configure Presentation Engine",
      description:
        "Select from 28 visual themes, define slide count, set technical density, and choose aspect ratio (16:9 or 4:3).",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Review & Refine Outline",
      description:
        "Inspect the AI-generated slide framework. Reorder sections, add critical talking points, and approve the structure.",
    },
    {
      step: "04",
      icon: MonitorPlay,
      title: "Edit, Present & Export",
      description:
        "Jump into the professional desktop slide editor. Edit inline, regenerate slides, present live, and export native PPTX.",
    },
  ];

  return (
    <section className="py-24 bg-nova-surface/40 relative border-t border-nova-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-nova-cyan mb-2 block">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nova-softWhite tracking-tight">
            From raw concept to stage-ready deck in 4 steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-nova-surface border border-nova-border p-6 flex flex-col justify-between hover:border-nova-cyan/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-nova-magenta/80">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-nova-card border border-nova-border flex items-center justify-center text-nova-cyan">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-nova-softWhite mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-nova-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default WorkflowSection;
