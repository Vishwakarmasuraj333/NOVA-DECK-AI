"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { getTemplateById } from "@/lib/templates/registry";
import { PresentationDocument, TemplateDefinition } from "@/types";
import { ChevronLeft, ChevronRight, X, Maximize, Minimize } from "lucide-react";

export default function PresentationPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [presentation, setPresentation] = useState<PresentationDocument | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch(`/api/presentations/${presentationId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.presentation) {
          setPresentation(data.presentation);
        }
      })
      .finally(() => setIsLoading(false));
  }, [presentationId]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Space, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setCurrentSlideIndex((prev) =>
          presentation ? Math.min(presentation.slides.length - 1, prev + 1) : prev
        );
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Escape") {
        router.push(`/editor/${presentationId}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentation, presentationId, router]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (isLoading || !presentation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <span className="text-sm font-semibold">Starting presentation...</span>
      </div>
    );
  }

  const activeSlide = presentation.slides[currentSlideIndex];
  const template: TemplateDefinition | undefined = getTemplateById(presentation.templateId);

  return (
    <div className="min-h-screen h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Floating control bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Link
          href={`/editor/${presentation.id}`}
          className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
          title="Exit presentation"
        >
          <X className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-semibold">
          <span>{currentSlideIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span>{presentation.slides.length}</span>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Slide Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-6xl shadow-2xl">
          {activeSlide && (
            <SlideRenderer
              slide={activeSlide}
              template={template}
              aspectRatio={presentation.aspectRatio}
              isInteractive={false}
            />
          )}
        </div>
      </div>

      {/* Floating Slide Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full opacity-30 hover:opacity-100 transition-opacity duration-300">
        <button
          disabled={currentSlideIndex === 0}
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          className="p-1 rounded-full text-white/80 hover:text-white disabled:opacity-20"
          title="Previous slide (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-xs font-mono font-bold px-2">
          {currentSlideIndex + 1} / {presentation.slides.length}
        </span>

        <button
          disabled={currentSlideIndex === presentation.slides.length - 1}
          onClick={() =>
            setCurrentSlideIndex((prev) =>
              Math.min(presentation.slides.length - 1, prev + 1)
            )
          }
          className="p-1 rounded-full text-white/80 hover:text-white disabled:opacity-20"
          title="Next slide (Right Arrow or Space)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
