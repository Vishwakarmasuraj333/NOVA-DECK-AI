"use client";

import { TemplatesMarketplace } from "@/components/templates/TemplatesMarketplace";

export default function PremiumTemplatesPage() {
  return (
    <TemplatesMarketplace
      defaultTier="premium"
      pageTitle="PRO Premium Templates"
      pageSubtitle="Unlock world-class investor pitch decks, corporate annual reports, cybersecurity topologies, and executive slide architectures."
    />
  );
}
