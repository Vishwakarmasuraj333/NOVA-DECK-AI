import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />
      <main className="pt-16 flex-1">
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
