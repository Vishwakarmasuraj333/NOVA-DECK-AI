"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { TEMPLATES, getAllCategories, getTemplateById } from "@/lib/templates/registry";
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
  SlidersHorizontal,
  Flame,
  Clock,
  Palette,
  ExternalLink,
  Layers,
  Crown,
} from "lucide-react";

interface MarketplaceProps {
  defaultTier?: "all" | "free" | "premium";
  defaultCategory?: string;
  onlyFavorites?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function TemplatesMarketplace({
  defaultTier = "all",
  defaultCategory = "All",
  onlyFavorites = false,
  pageTitle,
  pageSubtitle,
}: MarketplaceProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "premium">(defaultTier);
  const [sortBy, setSortBy] = useState<"recommended" | "name" | "newest">("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Load favorites & recents on mount
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("novadeck_favorite_templates");
      if (storedFavs) {
        setFavorites(new Set(JSON.parse(storedFavs)));
      }
      const storedRecents = localStorage.getItem("novadeck_recent_templates");
      if (storedRecents) {
        setRecentlyViewed(JSON.parse(storedRecents));
      }
    } catch (e) {
      console.warn("Could not access localStorage:", e);
    }
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("novadeck_favorite_templates", JSON.stringify(Array.from(next)));
      } catch (err) {
        console.warn(err);
      }
      return next;
    });
  };

  const handleOpenPreview = (template: TemplateDefinition) => {
    setPreviewTemplate(template);
    setPreviewSlideIdx(0);

    // Save to recents
    try {
      const updated = [template.id, ...recentlyViewed.filter((id) => id !== template.id)].slice(0, 8);
      setRecentlyViewed(updated);
      localStorage.setItem("novadeck_recent_templates", JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUseTemplate = (template: TemplateDefinition) => {
    router.push(`/create?template=${template.slug}`);
  };

  const categories = getAllCategories();

  // Filter & Sort
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (onlyFavorites && !favorites.has(t.id)) {
        return false;
      }

      const matchesSearch =
        !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      return 0; // default recommended order
    });
  }, [searchQuery, selectedCategory, tierFilter, sortBy, favorites, onlyFavorites]);

  const recentTemplatesList = useMemo(() => {
    return recentlyViewed
      .map((id) => getTemplateById(id))
      .filter((t): t is TemplateDefinition => Boolean(t))
      .slice(0, 5);
  }, [recentlyViewed]);

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full flex-1">
        {/* Top Navigation Sub-Routes */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-nova-border/60 pb-4">
          <Link
            href="/templates"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              defaultTier === "all" && !onlyFavorites && defaultCategory === "All"
                ? "bg-gradient-to-r from-nova-primary to-nova-accent text-white shadow-lg shadow-nova-primary/20"
                : "bg-nova-surface/60 text-nova-muted hover:text-white hover:bg-nova-surface"
            }`}
          >
            All Templates (50)
          </Link>
          <Link
            href="/templates/free"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              defaultTier === "free"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-nova-surface/60 text-nova-muted hover:text-white hover:bg-nova-surface"
            }`}
          >
            Free Templates
          </Link>
          <Link
            href="/templates/premium"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              defaultTier === "premium"
                ? "bg-nova-magenta text-white shadow-lg shadow-nova-magenta/25"
                : "bg-nova-surface/60 text-nova-muted hover:text-white hover:bg-nova-surface"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            PRO Premium
          </Link>
          <Link
            href="/templates/presentations"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              defaultCategory === "Business"
                ? "bg-nova-cyan text-nova-midnight font-bold shadow-lg shadow-nova-cyan/25"
                : "bg-nova-surface/60 text-nova-muted hover:text-white hover:bg-nova-surface"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Curated Decks
          </Link>
          <Link
            href="/templates/favorites"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              onlyFavorites
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                : "bg-nova-surface/60 text-nova-muted hover:text-white hover:bg-nova-surface"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Favorites ({favorites.size})
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nova-surface border border-nova-border text-xs font-semibold text-nova-cyan mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>50 Production-Grade Visual Presentation Systems</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-nova-softWhite tracking-tight">
            {pageTitle || "Presentation Template Marketplace"}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-nova-muted">
            {pageSubtitle ||
              "Explore 50 meticulously engineered design systems across Business, AI, Academic Vivas, Creative Lookbooks, and Executive Data Reports."}
          </p>
        </div>

        {/* Recently Viewed Strip */}
        {recentTemplatesList.length > 0 && !onlyFavorites && (
          <div className="mb-8 p-3.5 rounded-2xl bg-nova-surface/40 border border-nova-border/50">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-nova-muted">
              <Clock className="w-3.5 h-3.5 text-nova-cyan" />
              <span>Recently Viewed</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {recentTemplatesList.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleOpenPreview(rec)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nova-surface hover:bg-nova-border border border-nova-border/60 text-xs text-white shrink-0 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: rec.colorPalette.primary }}
                  />
                  <span className="font-medium">{rec.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-nova-surface/80 rounded-2xl border border-nova-border p-4 mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-nova-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by template name, style, category, or tags..."
                className="w-full bg-nova-midnight border border-nova-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-nova-softWhite placeholder-nova-muted focus:outline-none focus:border-nova-cyan focus:ring-1 focus:ring-nova-cyan transition-all"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Tier Filter Pills */}
              <div className="flex items-center bg-nova-midnight border border-nova-border rounded-xl p-1 text-xs font-semibold">
                <button
                  onClick={() => setTierFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tierFilter === "all" ? "bg-nova-cyan text-nova-midnight font-bold" : "text-nova-muted hover:text-white"
                  }`}
                >
                  All Tiers
                </button>
                <button
                  onClick={() => setTierFilter("free")}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tierFilter === "free" ? "bg-emerald-500 text-white font-bold" : "text-nova-muted hover:text-white"
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setTierFilter("premium")}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    tierFilter === "premium" ? "bg-nova-magenta text-white font-bold" : "text-nova-muted hover:text-white"
                  }`}
                >
                  <Lock className="w-3 h-3" /> PRO
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort templates by"
                className="bg-nova-midnight border border-nova-border rounded-xl px-3 py-2 text-xs text-nova-softWhite focus:outline-none focus:border-nova-cyan"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="newest">Sort: Newest</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-nova-midnight border border-nova-border rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-nova-surface text-nova-cyan" : "text-nova-muted hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-nova-surface text-nova-cyan" : "text-nova-muted hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-nova-border/50">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-nova-primary to-nova-accent text-white shadow-md shadow-nova-primary/20"
                    : "bg-nova-midnight/80 text-nova-muted hover:text-white hover:bg-nova-midnight border border-nova-border/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Count Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-nova-muted font-medium">
          <span>
            Showing <strong className="text-white">{filteredTemplates.length}</strong> of 50 presentation systems
          </span>
          {onlyFavorites && (
            <button
              onClick={() => {
                setFavorites(new Set());
                localStorage.removeItem("novadeck_favorite_templates");
              }}
              className="text-rose-400 hover:underline"
            >
              Clear all favorites
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20 px-4 rounded-3xl bg-nova-surface/40 border border-nova-border">
            <Layers className="w-12 h-12 text-nova-muted mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No presentation templates found</h3>
            <p className="text-xs text-nova-muted mt-1 max-w-sm mx-auto">
              {onlyFavorites
                ? "You haven't favorited any templates yet. Click the heart icon on any card to add it here."
                : "No templates matched your current filters. Try resetting search query or category tabs."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setTierFilter("all");
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const isFav = favorites.has(template.id);

              return (
                <div
                  key={template.id}
                  onClick={() => handleOpenPreview(template)}
                  className="group relative rounded-2xl bg-nova-surface border border-nova-border hover:border-nova-cyan/50 hover:shadow-2xl hover:shadow-nova-cyan/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-nova-midnight overflow-hidden">
                    <img
                      src={template.previewThumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-nova-surface via-transparent to-transparent opacity-80" />

                    {/* Badge Strip */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-nova-softWhite border border-white/10">
                        {template.category}
                      </span>
                      {template.isPremium ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nova-magenta/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          <Lock className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
                          FREE
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(template.id, e)}
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isFav
                          ? "bg-rose-500/90 text-white border-rose-400"
                          : "bg-black/40 text-nova-muted hover:text-white border-white/10 hover:bg-black/60"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>

                    {/* Hover Quick Action */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-xl bg-nova-midnight/90 text-white text-xs font-semibold border border-nova-cyan flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-3.5 h-3.5 text-nova-cyan" /> Quick Preview
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-nova-cyan transition-colors line-clamp-1">
                          {template.name}
                        </h3>
                        {/* Palette Swatches */}
                        <div className="flex items-center -space-x-1 shrink-0">
                          <div
                            className="w-3 h-3 rounded-full ring-1 ring-black"
                            style={{ backgroundColor: template.colorPalette.primary }}
                            title={`Primary: ${template.colorPalette.primary}`}
                          />
                          <div
                            className="w-3 h-3 rounded-full ring-1 ring-black"
                            style={{ backgroundColor: template.colorPalette.accent }}
                            title={`Accent: ${template.colorPalette.accent}`}
                          />
                          <div
                            className="w-3 h-3 rounded-full ring-1 ring-black"
                            style={{ backgroundColor: template.colorPalette.background }}
                            title={`Background: ${template.colorPalette.background}`}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-nova-muted line-clamp-2 leading-relaxed mb-3">
                        {template.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Button */}
                    <div className="pt-3 border-t border-nova-border/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        {template.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-nova-midnight text-nova-muted border border-nova-border/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(template);
                        }}
                        className="text-xs font-bold text-nova-cyan hover:text-white flex items-center gap-1 group/btn"
                      >
                        Use Deck <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const isFav = favorites.has(template.id);

              return (
                <div
                  key={template.id}
                  onClick={() => handleOpenPreview(template)}
                  className="rounded-2xl bg-nova-surface border border-nova-border hover:border-nova-cyan/50 p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={template.previewThumbnail}
                      alt={template.name}
                      className="w-20 h-14 rounded-xl object-cover shrink-0 border border-nova-border"
                      loading="lazy"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm sm:text-base text-white hover:text-nova-cyan transition-colors">
                          {template.name}
                        </h3>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-nova-midnight text-nova-cyan border border-nova-border">
                          {template.category}
                        </span>
                        {template.isPremium ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nova-magenta/20 text-nova-magenta border border-nova-magenta/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> PRO
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-nova-muted line-clamp-1 max-w-xl">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Swatches */}
                  <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                    <div className="flex items-center -space-x-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-black"
                        style={{ backgroundColor: template.colorPalette.primary }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-black"
                        style={{ backgroundColor: template.colorPalette.accent }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full ring-1 ring-black"
                        style={{ backgroundColor: template.colorPalette.background }}
                      />
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(template.id, e)}
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                      className={`p-2 rounded-xl border transition-colors ${
                        isFav
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          : "bg-nova-midnight text-nova-muted hover:text-white border-nova-border"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>

                    <Button
                      variant="cyan"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template);
                      }}
                      className="text-xs"
                    >
                      Use Deck
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* RICH TEMPLATE PREVIEW MODAL */}
      <Modal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate ? previewTemplate.name : "Template Preview"}
        maxWidth="2xl"
      >
        {previewTemplate && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-nova-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-nova-surface text-nova-cyan border border-nova-border">
                    {previewTemplate.category}
                  </span>
                  {previewTemplate.isPremium ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-nova-magenta/20 text-nova-magenta border border-nova-magenta/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> PRO TEMPLATE
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      FREE TIER INCLUDED
                    </span>
                  )}
                </div>
                <p className="text-xs text-nova-muted max-w-lg">{previewTemplate.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/templates/${previewTemplate.slug}`}>
                  <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Full Spec Page
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Use Template
                </Button>
              </div>
            </div>

            {/* Interactive Live Slide Preview Canvas */}
            <div className="bg-nova-midnight rounded-2xl border border-nova-border p-4 shadow-inner">
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-nova-border/60">
                <SlideRenderer
                  slide={
                    (previewTemplate.sampleSlides[previewSlideIdx] as any) || {
                      order: 1,
                      title: previewTemplate.name,
                      subtitle: previewTemplate.description,
                      layoutType: "cover",
                      imageAsset: previewTemplate.previewThumbnail,
                    }
                  }
                  template={previewTemplate}
                  aspectRatio="16:9"
                />
              </div>

              {/* Sample Slide Carousel Strip */}
              {previewTemplate.sampleSlides.length > 1 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {previewTemplate.sampleSlides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewSlideIdx(idx)}
                      className={`relative w-24 aspect-video rounded-lg overflow-hidden border transition-all shrink-0 p-1 bg-nova-surface text-left ${
                        previewSlideIdx === idx
                          ? "border-nova-cyan ring-1 ring-nova-cyan"
                          : "border-nova-border/60 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="text-[9px] font-bold truncate text-white">{slide.title || `Slide ${idx + 1}`}</div>
                      <div className="text-[8px] text-nova-muted uppercase">{slide.layoutType}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Design Tokens & Palette */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-nova-surface/60 border border-nova-border space-y-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-nova-cyan" /> Color Palette: {previewTemplate.colorPalette.name}
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono text-nova-muted">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: previewTemplate.colorPalette.primary }} />
                    <span>{previewTemplate.colorPalette.primary}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: previewTemplate.colorPalette.accent }} />
                    <span>{previewTemplate.colorPalette.accent}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: previewTemplate.colorPalette.background }} />
                    <span>{previewTemplate.colorPalette.background}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-nova-surface/60 border border-nova-border space-y-2">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-nova-magenta" /> Supported Layout Compositions
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {previewTemplate.supportedLayouts.slice(0, 5).map((l) => (
                    <span key={l} className="text-[10px] px-2 py-0.5 rounded bg-nova-midnight text-nova-muted border border-nova-border/60">
                      {l}
                    </span>
                  ))}
                  {previewTemplate.supportedLayouts.length > 5 && (
                    <span className="text-[10px] text-nova-cyan">+{previewTemplate.supportedLayouts.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade to NovaDeck PRO"
      >
        <div className="space-y-4">
          <p className="text-sm text-nova-muted">
            This presentation system is reserved for PRO members. Unlock all 50 premium template systems, unlimited AI slide generations, and direct PowerPoint (.pptx) exports.
          </p>
          <div className="p-4 rounded-xl bg-nova-midnight border border-nova-magenta/30 space-y-2">
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All 50 Premium Presentation Systems Unlocked</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full High-Resolution PowerPoint (.pptx) & PDF Export</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>500+ AI Generations Per Month with Multi-Model Fallback</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowUpgradeModal(false)}>
              Cancel
            </Button>
            <Link href="/billing">
              <Button variant="primary">Upgrade to PRO - $19/mo</Button>
            </Link>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
