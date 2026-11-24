import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-nova-muted leading-relaxed">
          <p>Last updated: November 24, 2026</p>
          <p>
            At NOVA DECK AI, we take your presentation intellectual property, source files, and research privacy seriously. This Privacy Policy details how we handle prompts, documents, and generated deck assets.
          </p>
          <h2 className="text-xl font-bold text-nova-softWhite pt-4">Data Ownership & Confidentiality</h2>
          <p>
            You retain 100% intellectual property ownership of all presentations, prompts, and exported files created using NOVA DECK AI. We do not use your proprietary documents or presentations to train public foundation models without explicit organizational consent.
          </p>
          <h2 className="text-xl font-bold text-nova-softWhite pt-4">Data Persistence & Encryption</h2>
          <p>
            All presentations, slides, and workspace tokens are encrypted at rest and in transit using TLS 1.3. You can permanently destroy your presentations and associated snapshots anytime from your workspace trash.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
