import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between selection:bg-nova-magenta selection:text-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
