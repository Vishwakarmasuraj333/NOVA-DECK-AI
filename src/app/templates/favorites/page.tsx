"use client";

import { TemplatesMarketplace } from "@/components/templates/TemplatesMarketplace";

export default function FavoriteTemplatesPage() {
  return (
    <TemplatesMarketplace
      onlyFavorites={true}
      pageTitle="Your Favorited Templates"
      pageSubtitle="Quick access to all your saved presentation design systems and frequently used visual formats."
    />
  );
}
