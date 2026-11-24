import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Terms of Service</h1>
        <div className="space-y-4 text-sm text-nova-muted leading-relaxed">
          <p>Last updated: November 24, 2026</p>
          <p>
            By accessing or using NOVA DECK AI, you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company or academic institution, you represent that you have the authority to bind such entity.
          </p>
          <h2 className="text-xl font-bold text-nova-softWhite pt-4">Permitted Use</h2>
          <p>
            NOVA DECK AI provides AI-assisted presentation structuring, slide generation, and file exporting tools. You agree not to misuse the platform to generate deceptive materials or violate academic viva standards.
          </p>
          <h2 className="text-xl font-bold text-nova-softWhite pt-4">Export Licensing & Rights</h2>
          <p>
            Generated PowerPoint (.pptx) and PDF files may be used freely for commercial pitch presentations, academic defenses, conferences, and internal executive meetings without royalties.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
