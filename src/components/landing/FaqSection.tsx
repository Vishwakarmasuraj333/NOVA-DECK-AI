"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I export editable PowerPoint (.pptx) files?",
      a: "Yes. NOVA DECK AI generates true binary .pptx files containing native PowerPoint shapes, editable text blocks, formatted lists, and chart components. You can open and edit them in Microsoft PowerPoint, Apple Keynote, and Google Slides.",
    },
    {
      q: "How does the AI outline and slide generator work?",
      a: "Our engine uses Google Gemini 1.5 to analyze your prompt or source document. It produces an editable outline where you can review, reorder, and refine slide titles before generating the final slides with custom layout tokens, speaker notes, and verified citations.",
    },
    {
      q: "What makes the 28 templates different from standard AI decks?",
      a: "Every single template defines distinct color palettes, typographic hierarchies, editorial container shapes, and tailored slide compositions. For instance, the 'Virtual Reality Lab' template uses midnight violet and neon cyan glows, while the 'MSc IT Viva' template specializes in system architecture diagrams and defense methodology.",
    },
    {
      q: "What happens if I select a premium template on a free plan?",
      a: "You can explore and preview all sample slides, layouts, and color tokens of any premium template. When you choose to generate with a locked template, you will see a clear upgrade prompt explaining the entitlements, while preserving your prompt and configuration.",
    },
    {
      q: "Do I need my own Gemini API key?",
      a: "By default, NOVA DECK AI reads GEMINI_API_KEY from the server environment. If you are self-hosting or testing locally, simply add your API key from Google AI Studio into the .env file. If credentials are not configured, the platform displays an actionable setup guide.",
    },
  ];

  return (
    <section className="py-24 bg-nova-midnight relative border-t border-nova-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-nova-cyan mb-2 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nova-softWhite tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-nova-surface/70 border border-nova-border overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-nova-softWhite">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-nova-cyan flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-nova-magenta" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-nova-muted leading-relaxed border-t border-nova-border/40 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FaqSection;
