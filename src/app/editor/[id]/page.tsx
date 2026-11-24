"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NovaLogo } from "@/components/brand/NovaLogo";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { getTemplateById } from "@/lib/templates/registry";
import { exportToPptx, exportToPdf } from "@/lib/services/exportService";
import { toast } from "@/components/ui/Toast";
import {
  PresentationDocument,
  SlideDocument,
  SlideLayoutType,
  TemplateDefinition,
} from "@/types";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Download,
  Share2,
  Play,
  Undo2,
  Redo2,
  Save,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Layers,
  Image,
  Palette,
  FileSpreadsheet,
  FileText,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowLeft,
  X,
  Menu,
} from "lucide-react";

export default function SlideEditorPage() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  // Presentation State
  const [presentation, setPresentation] = useState<PresentationDocument | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<SlideDocument[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Autosave State
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Canvas Zoom
  const [zoom, setZoom] = useState(1);

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // AI Refine Slide State
  const [isRefiningSlide, setIsRefiningSlide] = useState(false);
  const [aiRefineError, setAiRefineError] = useState<string | null>(null);

  // Mobile drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Fetch Presentation
  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/presentations/${presentationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load presentation");
        return res.json();
      })
      .then((data) => {
        if (data.presentation) {
          setPresentation(data.presentation);
          setHistory([data.presentation.slides]);
          setHistoryIndex(0);
          setLastSavedTime(new Date(data.presentation.updatedAt));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [presentationId]);

  const activeSlide: SlideDocument | undefined = presentation?.slides[activeSlideIndex];
  const template: TemplateDefinition | undefined = presentation
    ? getTemplateById(presentation.templateId)
    : undefined;

  // Push new state into history
  const pushHistory = (newSlides: SlideDocument[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newSlides);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setIsDirty(true);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      if (presentation) {
        setPresentation({ ...presentation, slides: history[prevIndex] });
        setIsDirty(true);
      }
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      if (presentation) {
        setPresentation({ ...presentation, slides: history[nextIndex] });
        setIsDirty(true);
      }
    }
  };

  // Save changes to DB
  const handleSave = useCallback(async () => {
    if (!presentation) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/presentations/${presentation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: presentation.title,
          description: presentation.description,
          aspectRatio: presentation.aspectRatio,
          themeTokens: presentation.themeTokens,
          slides: presentation.slides,
        }),
      });
      if (res.ok) {
        setIsDirty(false);
        setLastSavedTime(new Date());
      }
    } catch {
      // Save retry
    } finally {
      setIsSaving(false);
    }
  }, [presentation]);

  // Debounced Autosave
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      handleSave();
    }, 2500);
    return () => clearTimeout(timer);
  }, [isDirty, handleSave]);

  // Keyboard Shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleUndo, handleRedo]);

  // Update active slide field
  const handleUpdateSlideField = (field: keyof SlideDocument, value: any) => {
    if (!presentation || !activeSlide) return;
    const updatedSlides = [...presentation.slides];
    updatedSlides[activeSlideIndex] = {
      ...updatedSlides[activeSlideIndex],
      [field]: value,
    };
    setPresentation({ ...presentation, slides: updatedSlides });
    pushHistory(updatedSlides);
  };

  // Slide CRUD Actions
  const handleAddSlide = () => {
    if (!presentation) return;
    const newSlide: SlideDocument = {
      slideId: `slide_${Date.now()}`,
      order: presentation.slides.length + 1,
      title: "New Presentation Slide",
      subtitle: "Add context or narrative summary",
      layoutType: "text",
      body: "Describe key takeaways and strategic findings here.",
      bulletPoints: ["First key point", "Second critical metric", "Third action item"],
      themeTokens: {},
    };
    const updated = [...presentation.slides, newSlide];
    setPresentation({ ...presentation, slides: updated });
    setActiveSlideIndex(updated.length - 1);
    pushHistory(updated);
  };

  const handleDuplicateSlide = (index: number) => {
    if (!presentation) return;
    const target = presentation.slides[index];
    const duplicated: SlideDocument = {
      ...target,
      slideId: `slide_${Date.now()}`,
      title: `${target.title} (Copy)`,
      order: index + 2,
    };
    const updated = [
      ...presentation.slides.slice(0, index + 1),
      duplicated,
      ...presentation.slides.slice(index + 1),
    ].map((s, idx) => ({ ...s, order: idx + 1 }));

    setPresentation({ ...presentation, slides: updated });
    setActiveSlideIndex(index + 1);
    pushHistory(updated);
  };

  const handleDeleteSlide = (index: number) => {
    if (!presentation || presentation.slides.length <= 1) {
      toast.warning("Presentation must have at least one slide.");
      return;
    }
    const updated = presentation.slides
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    setPresentation({ ...presentation, slides: updated });
    setActiveSlideIndex(Math.max(0, index - 1));
    pushHistory(updated);
  };

  const handleMoveSlide = (fromIndex: number, direction: "up" | "down") => {
    if (!presentation) return;
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= presentation.slides.length) return;

    const updated = [...presentation.slides];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;

    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setPresentation({ ...presentation, slides: reordered });
    setActiveSlideIndex(toIndex);
    pushHistory(reordered);
  };

  // AI Refine Slide handler
  const handleAIRefine = async (instruction: "rewrite" | "shorten" | "expand" | "tone_formal" | "tone_persuasive") => {
    if (!activeSlide) return;
    setIsRefiningSlide(true);
    setAiRefineError(null);
    try {
      const res = await fetch("/api/ai/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: activeSlide, instruction }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "AI refinement failed");
      }
      if (data.updatedSlide) {
        handleUpdateSlideField("title", data.updatedSlide.title);
        handleUpdateSlideField("body", data.updatedSlide.body);
        handleUpdateSlideField("bulletPoints", data.updatedSlide.bulletPoints);
      }
    } catch (err: any) {
      setAiRefineError(err.message || "AI slide refinement requires configured Gemini API key.");
    } finally {
      setIsRefiningSlide(false);
    }
  };

  // Export handlers
  const handleExportPPTX = async () => {
    if (!presentation) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await exportToPptx(presentation, template);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation.title.replace(/\s+/g, "_")}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccessMessage("PowerPoint (.pptx) file downloaded successfully!");
    } catch (err: any) {
      setExportError(err.message || "Failed to generate PPTX file.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!presentation) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await exportToPdf(presentation, template);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentation.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccessMessage("PDF presentation file downloaded successfully!");
    } catch (err: any) {
      setExportError(err.message || "Failed to generate PDF document.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nova-midnight flex items-center justify-center text-nova-softWhite">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-nova-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading presentation canvas...</span>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen bg-nova-midnight flex items-center justify-center text-nova-softWhite p-6">
        <div className="max-w-md bg-nova-surface rounded-2xl border border-nova-border p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold">Presentation Not Found</h2>
          <p className="text-xs text-nova-muted">{error || "Could not retrieve the requested presentation document."}</p>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-nova-midnight text-nova-softWhite flex flex-col overflow-hidden">
      {/* TOP TOOLBAR */}
      <header className="h-14 border-b border-nova-border bg-nova-surface/90 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-1.5 rounded-lg text-nova-muted hover:text-white hover:bg-nova-surfaceHover" title="Back to Dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link href="/">
            <NovaLogo size="sm" showText={false} variant="simple" />
          </Link>

          {/* Inline editable presentation title */}
          <input
            type="text"
            value={presentation.title}
            onChange={(e) => {
              setPresentation({ ...presentation, title: e.target.value });
              setIsDirty(true);
            }}
            className="bg-transparent font-bold text-sm sm:text-base text-nova-softWhite hover:bg-white/5 focus:bg-white/10 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-nova-cyan/50 max-w-xs sm:max-w-md truncate"
            title="Click to rename presentation"
          />

          {/* Autosave Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-nova-darkMuted">
            {isSaving ? (
              <span className="flex items-center gap-1 text-nova-cyan">
                <span className="w-2 h-2 rounded-full bg-nova-cyan animate-pulse" />
                Saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400/80">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center gap-1 border-r border-nova-border pr-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded text-nova-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded text-nova-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Manual Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            className="hidden sm:inline-flex gap-1.5"
            title="Save presentation now (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>

          {/* Preview / Slideshow presentation mode */}
          <Link href={`/editor/${presentation.id}/preview`}>
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Play className="w-3.5 h-3.5 text-nova-cyan" />
              <span className="hidden sm:inline">Present</span>
            </Button>
          </Link>

          {/* Share */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          {/* Export */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="gap-1.5 font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </header>

      {/* 3-PANE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANE: SLIDE THUMBNAIL RAIL */}
        <aside className="w-64 border-r border-nova-border bg-nova-surface/60 flex flex-col justify-between hidden md:flex flex-shrink-0">
          <div className="p-3 border-b border-nova-border flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-nova-muted">
              Slides ({presentation.slides.length})
            </span>
            <Button variant="cyan" size="sm" onClick={handleAddSlide} className="h-7 px-2 text-xs gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>

          {/* Thumbnail list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {presentation.slides.map((s, idx) => {
              const isActive = activeSlideIndex === idx;
              return (
                <div
                  key={s.slideId}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative rounded-xl border-2 transition-all cursor-pointer p-2 ${
                    isActive
                      ? "border-nova-cyan bg-nova-surfaceHover shadow-sm"
                      : "border-nova-border hover:border-nova-borderLight bg-nova-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-nova-cyan">
                      0{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-1 hover:text-white text-nova-muted disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, "down");
                        }}
                        disabled={idx === presentation.slides.length - 1}
                        className="p-1 hover:text-white text-nova-muted disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlide(idx);
                        }}
                        className="p-1 hover:text-white text-nova-muted"
                        title="Duplicate"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="p-1 hover:text-red-400 text-nova-muted"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Micro mini slide preview */}
                  <div className="aspect-video w-full rounded-md bg-nova-midnight border border-white/10 p-2 flex flex-col justify-between overflow-hidden">
                    <span className="text-[11px] font-bold text-nova-softWhite line-clamp-1">
                      {s.title}
                    </span>
                    <span className="text-[8px] font-mono text-nova-muted uppercase">
                      {s.layoutType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER PANE: PRESENTATION CANVAS */}
        <main className="flex-1 bg-nova-midnight/60 flex flex-col items-center justify-center p-4 sm:p-8 overflow-auto relative">
          {/* Zoom & View Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-nova-surface/80 backdrop-blur-md border border-nova-border px-3 py-1.5 rounded-xl shadow-lg">
            <button
              onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.1))}
              className="p-1 rounded text-nova-muted hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-nova-softWhite px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(1.4, prev + 0.1))}
              className="p-1 rounded text-nova-muted hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 rounded text-nova-muted hover:text-white ml-1 border-l border-nova-border pl-2"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Slide Stage with transform zoom */}
          <div
            className="w-full max-w-5xl transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          >
            {activeSlide && (
              <SlideRenderer
                slide={activeSlide}
                template={template}
                aspectRatio={presentation.aspectRatio}
                isInteractive={true}
                onEditField={handleUpdateSlideField}
              />
            )}
          </div>

          {/* Bottom mobile slide selector bar */}
          <div className="md:hidden mt-4 w-full flex items-center justify-between bg-nova-surface p-2 rounded-xl border border-nova-border">
            <span className="text-xs font-bold text-nova-cyan">
              Slide {activeSlideIndex + 1} of {presentation.slides.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={activeSlideIndex === presentation.slides.length - 1}
                onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
              >
                Next
              </Button>
              <Button variant="cyan" size="sm" onClick={handleAddSlide}>
                + Add
              </Button>
            </div>
          </div>
        </main>

        {/* RIGHT PANE: CONTEXTUAL INSPECTOR */}
        <aside className="w-80 border-l border-nova-border bg-nova-surface/60 overflow-y-auto p-4 space-y-6 hidden lg:block flex-shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nova-muted block mb-2">
              Contextual Slide Inspector
            </span>
            <h3 className="text-sm font-bold text-nova-softWhite">
              Slide {activeSlideIndex + 1} Configuration
            </h3>
          </div>

          {/* Layout Type Switcher */}
          {activeSlide && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-nova-muted">
                Slide Layout Type
              </label>
              <select
                value={activeSlide.layoutType}
                onChange={(e) => handleUpdateSlideField("layoutType", e.target.value as SlideLayoutType)}
                className="w-full rounded-xl bg-nova-card border border-nova-border p-2.5 text-xs text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              >
                <option value="cover">Cover Slide</option>
                <option value="agenda">Agenda / Roadmap</option>
                <option value="text">Editorial Text</option>
                <option value="image_text">Image with Text</option>
                <option value="stats">Key Metrics / Stats</option>
                <option value="chart">Data Chart (Bar/Trend)</option>
                <option value="timeline">Milestone Timeline</option>
                <option value="process">Step Process</option>
                <option value="diagram">Architecture Diagram</option>
                <option value="quote">Editorial Quote</option>
                <option value="conclusion">Closing Takeaways</option>
                <option value="references">Citations & References</option>
              </select>
            </div>
          )}

          {/* AI Slide Refinement */}
          <div className="p-3.5 rounded-2xl bg-nova-card border border-nova-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-nova-cyan">
              <Sparkles className="w-4 h-4 text-nova-cyan" />
              <span>AI Slide Refinement</span>
            </div>

            {aiRefineError && (
              <p className="text-[11px] text-amber-300 leading-snug">{aiRefineError}</p>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefiningSlide}
                onClick={() => handleAIRefine("shorten")}
                className="text-[11px] h-8"
              >
                Shorten Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefiningSlide}
                onClick={() => handleAIRefine("expand")}
                className="text-[11px] h-8"
              >
                Expand Depth
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefiningSlide}
                onClick={() => handleAIRefine("tone_formal")}
                className="text-[11px] h-8"
              >
                Make Formal
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefiningSlide}
                onClick={() => handleAIRefine("tone_persuasive")}
                className="text-[11px] h-8"
              >
                Persuasive
              </Button>
            </div>
          </div>

          {/* Image & Asset Controls */}
          {activeSlide && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-nova-muted flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-nova-cyan" />
                Image Asset URL
              </label>
              <input
                type="text"
                value={activeSlide.imageAsset || ""}
                onChange={(e) => handleUpdateSlideField("imageAsset", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl bg-nova-card border border-nova-border p-2.5 text-xs text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              />
            </div>
          )}

          {/* Speaker Notes */}
          {activeSlide && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-nova-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-nova-cyan" />
                Speaker Notes
              </label>
              <textarea
                rows={3}
                value={activeSlide.speakerNotes || ""}
                onChange={(e) => handleUpdateSlideField("speakerNotes", e.target.value)}
                placeholder="Private presenter guidance for this slide..."
                className="w-full rounded-xl bg-nova-card border border-nova-border p-2.5 text-xs text-nova-softWhite focus:border-nova-cyan focus:outline-none"
              />
            </div>
          )}
        </aside>
      </div>

      {/* EXPORT MODAL (REAL PPTX & PDF DOWNLOADS) */}
      <Modal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportSuccessMessage(null);
          setExportError(null);
        }}
        title="Export Presentation"
        description="Download publication-quality Microsoft PowerPoint and multi-page PDF documents."
        maxWidth="md"
      >
        <div className="space-y-4">
          {exportSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
          )}

          {exportError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PowerPoint Export Card */}
            <div className="p-5 rounded-2xl bg-nova-card border border-nova-border hover:border-nova-cyan transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-400 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-nova-softWhite">PowerPoint (.PPTX)</h4>
                <p className="text-xs text-nova-muted mt-1 leading-relaxed">
                  Authentic editable PowerPoint deck with native shapes, formatted bullet lists, and charts.
                </p>
              </div>
              <Button
                variant="cyan"
                size="sm"
                isLoading={isExporting}
                onClick={handleExportPPTX}
                className="mt-4 w-full font-bold"
              >
                Download PPTX
              </Button>
            </div>

            {/* PDF Export Card */}
            <div className="p-5 rounded-2xl bg-nova-card border border-nova-border hover:border-nova-magenta transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-nova-magenta/15 border border-nova-magenta/40 text-nova-magenta flex items-center justify-center mb-3">
                  <FileCode className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-nova-softWhite">Printable PDF (.PDF)</h4>
                <p className="text-xs text-nova-muted mt-1 leading-relaxed">
                  High-fidelity multi-page PDF formatted precisely for widescreen projection and print distribution.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                isLoading={isExporting}
                onClick={handleExportPDF}
                className="mt-4 w-full font-bold"
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* SHARE MODAL */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Presentation"
        description="Anyone with this secure public link can view your presentation in presentation mode."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-nova-muted mb-2 block">
              Public Viewer Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? `${window.location.origin}/editor/${presentation.id}/preview` : ""}
                className="w-full rounded-xl bg-nova-midnight border border-nova-border p-3 text-xs text-nova-softWhite focus:outline-none"
              />
              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/editor/${presentation.id}/preview`);
                  toast.success("Presentation link copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
