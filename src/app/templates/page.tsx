"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TEMPLATES, getAllCategories } from "@/lib/templates/registry";
import { TemplateDefinition } from "@/types";
import {
  Search,
  LayoutGrid,
  List,
  Lock,
  Sparkles,
  Heart,
  Eye,
  ArrowRight,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function TemplatesGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "premium">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "name" | "newest">("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Favorites state
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const categories = getAllCategories();

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(favorites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setFavorites(next);
  };

  // Filter & Sort
  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesTier =
      tierFilter === "all" ||
      (tierFilter === "free" && !t.isPremium) ||
      (tierFilter === "premium" && t.isPremium);

    return matchesSearch && matchesCategory && matchesTier;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    return 0; // recommended order
  });

  const handleUseTemplate = (t: TemplateDefinition) => {
    router.push(`/create?template=${t.slug}`);
  };

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full flex-1">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-surface border border-nova-border text-xs font-semibold text-nova-cyan mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>28 Distinct Presentation Systems</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-nova-softWhite tracking-tight">
            Curated Visual Design Gallery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-nova-muted">
            Explore 28 genuinely distinct typographic and layout compositions tailored for research vivas, venture pitch decks, and technical architectures.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-nova-surface/80 rounded-2xl border border-nova-border p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by template name, tag, or topic (e.g. Viva, AI, Pitch)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-nova-midnight border border-nova-border text-sm text-nova-softWhite placeholder-nova-muted/60 focus:border-nova-cyan focus:outline-none"
              />
            </div>

            {/* View Mode & Sorter */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl bg-nova-midnight border border-nova-border px-3 py-2 text-xs font-semibold text-nova-softWhite focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="name">Alphabetical</option>
                <option value="newest">Recently Added</option>
              </select>

              <div className="flex items-center bg-nova-midnight rounded-xl border border-nova-border p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg ${viewMode === "grid" ? "bg-nova-surface text-nova-cyan" : "text-nova-muted"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg ${viewMode === "list" ? "bg-nova-surface text-nova-cyan" : "text-nova-muted"}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category & Tier Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-nova-border/50">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-nova-cyan text-nova-midnight font-bold shadow-sm"
                      : "text-nova-muted hover:text-white bg-nova-midnight/60 hover:bg-nova-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Free vs Premium Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setTierFilter("all")}
                className={`px-2.5 py-1 rounded-lg ${tierFilter === "all" ? "bg-nova-surface text-nova-softWhite font-bold" : "text-nova-muted"}`}
              >
                All (28)
              </button>
              <button
                onClick={() => setTierFilter("free")}
                className={`px-2.5 py-1 rounded-lg ${tierFilter === "free" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-nova-muted"}`}
              >
                Free
              </button>
              <button
                onClick={() => setTierFilter("premium")}
                className={`px-2.5 py-1 rounded-lg ${tierFilter === "premium" ? "bg-nova-magenta/20 text-nova-magenta font-bold" : "text-nova-muted"}`}
              >
                Pro Locked
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid / List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((t) => {
              const isFav = favorites.has(t.id);
              return (
                <div
                  key={t.id}
                  className="group rounded-2xl bg-nova-surface border border-nova-border hover:border-nova-cyan/50 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-nova-card">
                    <img
                      src={t.previewThumbnail}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge */}
                    {t.isPremium ? (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-nova-midnight/80 backdrop-blur-md border border-nova-magenta/60 text-[10px] font-black text-nova-magenta flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        PRO
                      </div>
                    ) : (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/60 text-[10px] font-bold text-emerald-300">
                        FREE
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(t.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? "bg-red-500/80 text-white"
                          : "bg-nova-midnight/60 text-nova-muted hover:text-white"
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-nova-softWhite truncate">
                          {t.name}
                        </h3>
                        <span className="text-[10px] font-mono text-nova-cyan uppercase px-1.5 py-0.5 rounded bg-nova-card border border-nova-border flex-shrink-0">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-xs text-nova-muted line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-nova-border/60">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-black/30"
                          style={{ backgroundColor: t.colorPalette.primary }}
                          title="Primary Color"
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-black/30"
                          style={{ backgroundColor: t.colorPalette.accent }}
                          title="Accent Color"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link href={`/templates/${t.slug}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Preview
                          </Button>
                        </Link>
                        <Button
                          variant={t.isPremium ? "secondary" : "cyan"}
                          size="sm"
                          onClick={() => handleUseTemplate(t)}
                          className="h-7 px-2.5 text-xs font-bold gap-1"
                        >
                          {t.isPremium && <Lock className="w-3 h-3 text-nova-magenta" />}
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-nova-surface border border-nova-border hover:border-nova-cyan/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-nova-card flex-shrink-0">
                    <img src={t.previewThumbnail} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-nova-softWhite">{t.name}</h3>
                      {t.isPremium ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-nova-magenta/20 text-nova-magenta border border-nova-magenta/40">
                          PRO
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-nova-muted max-w-xl line-clamp-1 mt-0.5">{t.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link href={`/templates/${t.slug}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                  <Button
                    variant={t.isPremium ? "secondary" : "cyan"}
                    size="sm"
                    onClick={() => handleUseTemplate(t)}
                    className="gap-1 font-bold"
                  >
                    {t.isPremium && <Lock className="w-3.5 h-3.5 text-nova-magenta" />}
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upgrade Modal for Locked Templates */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Pro Studio Template"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-nova-card border border-nova-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nova-magenta/20 border border-nova-magenta flex items-center justify-center text-nova-magenta flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-nova-softWhite">{previewTemplate?.name}</h4>
              <p className="text-xs text-nova-muted">
                This template requires an active Pro Studio or Enterprise subscription.
              </p>
            </div>
          </div>

          <p className="text-xs text-nova-muted leading-relaxed">
            Upgrade to Pro to unlock all 28+ cinematic presentation templates, high-res PowerPoint exports, and unlimited AI slide regenerations.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/pricing">
              <Button variant="primary" size="lg" className="w-full font-bold">
                View Pro Studio Plans ($19/mo)
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setShowUpgradeModal(false)}>
              Browse Free Templates
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
