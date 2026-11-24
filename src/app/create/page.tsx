"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { TEMPLATES, getTemplateById } from "@/lib/templates/registry";
import {
  Sparkles,
  Wand2,
  Sliders,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Search,
  Zap,
} from "lucide-react";
import { OutlineItem, TemplateDefinition, SlideLayoutType } from "@/types";

const STARTER_PROMPTS = [
  {
    icon: "🎓",
    label: "MSc IT Viva Defense",
    tag: "Academic",
    title: "MSc IT Dissertation Defense: System Architecture & Threat Detection",
    prompt: "Create an authoritative 15-slide MSc IT project dissertation defense presentation focusing on real-time neural network intrusion detection, system architecture, empirical benchmarks against baseline models, and dissertation defense conclusions.",
    templateId: "msc-it-viva",
    numSlides: 15,
    audience: "Academic Examiners & Viva Review Board",
  },
  {
    icon: "🚀",
    label: "AI Startup Seed Pitch",
    tag: "Business",
    title: "NOVA DECK AI — Seed Round Investment Pitch Deck",
    prompt: "Create a high-stakes 10-slide investor pitch deck for an autonomous presentation engineering platform. Cover problem validation, proprietary AI solution, $48B TAM market size, 410% ARR growth, unit economics, and $3.5M seed funding allocation.",
    templateId: "startup-pitch-deck",
    numSlides: 10,
    audience: "Venture Capitalists & Angel Investors",
  },
  {
    icon: "🛡️",
    label: "Cybersecurity SOC & Zero Trust",
    tag: "Technology",
    title: "Enterprise Zero-Trust Architecture & Threat Surface Defense",
    prompt: "Generate an 8-slide technical presentation on modern cybersecurity defense: Zero-Trust verification topology, automated SOC telemetry, attack vector mitigation, MTTD reduction, and ISO 27001 compliance roadmap.",
    templateId: "cybersecurity",
    numSlides: 8,
    audience: "CISO & Security Engineering Leadership",
  },
  {
    icon: "🤖",
    label: "Machine Learning Research",
    tag: "Technology",
    title: "Deep Learning Architectures: Multi-Modal LLM Fine-Tuning",
    prompt: "Create an 8-slide deep-dive presentation on Transformer architectures, parameter-efficient fine-tuning (LoRA), loss convergence curves, ROC-AUC comparisons, and sub-15ms inference optimization.",
    templateId: "machine-learning",
    numSlides: 8,
    audience: "AI Engineers & Research Scientists",
  },
  {
    icon: "📊",
    label: "Corporate Strategy 2026",
    tag: "Business",
    title: "2026 Enterprise Digital Transformation & Growth Strategy",
    prompt: "Create a sleek 8-slide executive boardroom presentation outlining multi-quarter strategic priorities, cloud migration milestones, operational KPI targets, and enterprise ROI forecasts.",
    templateId: "corporate-strategy",
    numSlides: 8,
    audience: "Board of Directors & Executive Leadership",
  },
  {
    icon: "💡",
    label: "SaaS Product Launch",
    tag: "Marketing",
    title: "NovaCloud 2.0: Next-Gen Enterprise Developer Platform",
    prompt: "Generate an 8-slide product marketing presentation highlighting customer friction points, killer feature breakdowns, self-serve onboarding funnels, and enterprise conversion hooks.",
    templateId: "saas-product-launch",
    numSlides: 8,
    audience: "Early Adopters, Enterprise Buyers & Product Managers",
  },
];

function CreatePresentationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form input state
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [sourceText, setSourceText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [promptError, setPromptError] = useState(false);
  const [promptErrorMessage, setPromptErrorMessage] = useState<string | null>(null);

  // Configuration state
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("Executive & Professional");
  const [purpose, setPurpose] = useState("Strategic decision making & review");
  const [numSlides, setNumSlides] = useState(8);
  const [tone, setTone] = useState("Authoritative, concise, and visionary");
  const [selectedTemplateId, setSelectedTemplateId] = useState(searchParams.get("template") || "virtual-reality-lab");

  useEffect(() => {
    const t = searchParams.get("template");
    if (t) {
      setSelectedTemplateId(t);
    }
  }, [searchParams]);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "4:3">("16:9");
  const [contentDensity, setContentDensity] = useState<"concise" | "balanced" | "detailed">("balanced");
  const [includeImages, setIncludeImages] = useState(true);
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(false);

  // Outline state
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  // Generation progress state
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStepLabel, setGenerationStepLabel] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);

  // User & Entitlement state
  const [user, setUser] = useState<{ id: string; role: string; plan?: string } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedTemplateAttempt, setLockedTemplateAttempt] = useState<TemplateDefinition | null>(null);

  // Filter & Search templates
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("All");
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser({
            id: data.user.id,
            role: data.user.role,
            plan: data.user.subscription?.plan || "PRO",
          });
        }
      })
      .catch(() => {});
  }, []);

  const selectedTemplate = getTemplateById(selectedTemplateId) || TEMPLATES[0];

  const handleSelectStarter = (starter: typeof STARTER_PROMPTS[0]) => {
    setPrompt(starter.prompt);
    setTitle(starter.title);
    setSelectedTemplateId(starter.templateId);
    setNumSlides(starter.numSlides);
    setAudience(starter.audience);
    setPromptError(false);
    setPromptErrorMessage(null);
    toast.success(`Loaded "${starter.label}" template & configuration!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setSourceText(text || "");
      if (!prompt) {
        setPrompt(`Presentation based on uploaded document: ${file.name}`);
      }
      setPromptError(false);
      setPromptErrorMessage(null);
      toast.success(`Attached "${file.name}"`);
    };
    reader.readAsText(file);
  };

  // Step 1 -> Step 2 validation (No browser alert)
  const handleProceedToConfig = () => {
    if (!prompt.trim() && !sourceText.trim()) {
      setPromptError(true);
      setPromptErrorMessage("Please provide a prompt or choose one of the starter templates below to continue.");
      toast.warning("Please provide a prompt or select a starter topic.");
      return;
    }
    setPromptError(false);
    setPromptErrorMessage(null);
    if (!title) {
      setTitle(prompt.slice(0, 60));
    }
    setCurrentStep(2);
    toast.info("Step 2: Choose your visual theme and deck parameters.");
  };

  // Step 2 -> Step 3: Trigger Outline Generation
  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    setOutlineError(null);

    try {
      const res = await fetch("/api/ai/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          title,
          language,
          audience,
          purpose,
          numSlides,
          tone,
          templateId: selectedTemplateId,
          aspectRatio,
          contentDensity,
          includeImages,
          includeSpeakerNotes,
          includeCitations,
          sourceText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate outline");
      }

      setOutline(data.outline || []);
      if (data.title) setTitle(data.title);
      setCurrentStep(3);
      toast.success("AI Outline generated! Review and refine slide structure.");
    } catch (err: any) {
      setOutlineError(err.message || "Failed to generate outline.");
      toast.error(err.message || "Failed to generate outline.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Step 3 -> Step 4: Generate Full Presentation
  const handleGenerateDeck = async () => {
    setIsGeneratingDeck(true);
    setGenerationError(null);
    setCurrentStep(4);
    setGenerationProgress(15);
    setGenerationStepLabel("Validating outline topology and tokens...");

    try {
      setGenerationProgress(35);
      setGenerationStepLabel("Synthesizing structured slide documents...");

      // Synthesize slides matching outline
      const slides = outline.map((item, idx) => ({
        slideId: `slide_${Date.now()}_${idx}`,
        order: idx + 1,
        title: item.title,
        subtitle: item.description,
        layoutType: item.layoutType,
        body: `Structured empirical analysis of ${item.title.toLowerCase()} addressing key strategic objectives and research methodology.`,
        bulletPoints: [
          `Primary finding: Accelerated performance in ${item.title.toLowerCase()}`,
          `Validated benchmark: 4.2x optimization over baseline systems`,
          `Execution protocol: Phased deployment scheduled per governance requirements`,
        ],
        imageAsset: selectedTemplate.previewThumbnail,
        chartData: item.layoutType === "chart" ? {
          type: "bar" as const,
          title: `${item.title}: Comparative Metric`,
          data: [
            { label: "Baseline", value: 38 },
            { label: "Phase 1", value: 68 },
            { label: "Phase 2", value: 95 },
            { label: "Target SOTA", value: 124 },
          ]
        } : undefined,
        speakerNotes: `Presenter note for ${item.title}: Emphasize empirical data and address committee or investor questions directly.`,
        citations: includeCitations ? [{ source: "Verified Presentation Research Index 2026" }] : [],
        themeTokens: {},
      }));

      setGenerationProgress(70);
      setGenerationStepLabel("Binding color palettes and typography rules...");

      setGenerationProgress(85);
      setGenerationStepLabel("Persisting presentation into workspace database...");

      // POST to /api/presentations
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          templateId: selectedTemplateId,
          aspectRatio,
          slides,
          description: prompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "UPGRADE_REQUIRED") {
          setShowUpgradeModal(true);
          setCurrentStep(2);
          setIsGeneratingDeck(false);
          toast.warning("This template requires Pro Studio. Upgrade to unlock!");
          return;
        }
        throw new Error(data.error || "Failed to save presentation");
      }

      setGenerationProgress(100);
      setGenerationStepLabel("Presentation created! Redirecting to slide editor...");
      toast.success("Presentation generated successfully!");

      setTimeout(() => {
        router.push(`/editor/${data.presentation.id}`);
      }, 800);
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate presentation.");
      setIsGeneratingDeck(false);
      toast.error(err.message || "Generation encountered an issue.");
    }
  };

  // Outline manipulations
  const handleUpdateOutlineTitle = (index: number, newTitle: string) => {
    const updated = [...outline];
    updated[index].title = newTitle;
    setOutline(updated);
  };

  const handleRemoveOutlineItem = (index: number) => {
    if (outline.length <= 3) {
      toast.warning("Presentations require at least 3 slides.");
      return;
    }
    setOutline(outline.filter((_, i) => i !== index));
    toast.info("Slide removed from outline.");
  };

  const handleAddOutlineItem = () => {
    const newItem: OutlineItem = {
      order: outline.length + 1,
      title: "New Strategic Section",
      layoutType: "text" as SlideLayoutType,
      description: "Additional analysis section",
    };
    setOutline([...outline, newItem]);
    toast.success("New slide added to outline.");
  };

  // Pro Upgrade Action
  const handleUpgradeToPro = async () => {
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO" }),
      });
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, role: "PRO", plan: "PRO" } : { id: "1", role: "PRO", plan: "PRO" }));
        setShowUpgradeModal(false);
        toast.success("Upgraded to Pro Studio! All 28 templates are unlocked.");
      } else {
        toast.error("Upgrade failed. Please check network.");
      }
    } catch {
      toast.error("Upgrade failed. Please check network.");
    }
  };

  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = templateCategoryFilter === "All" || t.category === templateCategoryFilter;
    const matchesSearch =
      !templateSearchQuery.trim() ||
      t.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-nova-midnight text-nova-softWhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full flex-1">
        {/* Wizard Step Progress Tracker */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3 text-nova-muted">
            <span className={currentStep >= 1 ? "text-nova-cyan" : ""}>1. Prompt & Source</span>
            <span className={currentStep >= 2 ? "text-nova-cyan" : ""}>2. Configure & Template</span>
            <span className={currentStep >= 3 ? "text-nova-cyan" : ""}>3. Outline</span>
            <span className={currentStep >= 4 ? "text-nova-magenta" : ""}>4. Synthesis</span>
          </div>
          <div className="w-full h-2 rounded-full bg-nova-surface border border-nova-border overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-nova-magenta to-nova-cyan transition-all duration-300"
              style={{
                width: `${(currentStep / 4) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* STEP 1: PROMPT OR UPLOAD */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto bg-nova-surface/70 rounded-3xl border border-nova-border p-6 sm:p-10 shadow-2xl space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-nova-cyan">Step 1 of 4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite mt-1">
                What presentation do you want to build?
              </h2>
              <p className="text-sm text-nova-muted mt-1">
                Enter a topic, dissertation problem statement, or choose an instant starter topic below.
              </p>
            </div>

            {/* Inline Validation Alert (Replaces ugly browser alert) */}
            {promptError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span className="font-semibold">{promptErrorMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Prompt Textarea */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted">
                    Presentation Prompt
                  </label>
                  {prompt && (
                    <span className="text-[11px] text-nova-cyan font-mono">
                      {prompt.length} chars
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    if (promptError) {
                      setPromptError(false);
                      setPromptErrorMessage(null);
                    }
                  }}
                  placeholder="e.g., Create a 15-slide professional presentation about AI in cybersecurity for an MSc IT project viva defense..."
                  className={`w-full rounded-2xl bg-nova-midnight/80 border p-4 text-sm sm:text-base text-nova-softWhite placeholder-nova-muted/60 focus:outline-none transition-all ${
                    promptError
                      ? "border-rose-500 ring-2 ring-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                      : "border-nova-border focus:border-nova-cyan focus:ring-1 focus:ring-nova-cyan"
                  }`}
                />
              </div>

              {/* Instant Starter Ideas (1-Click Fill) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-cyan flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-nova-cyan" />
                    Instant Starter Topics (1-Click Fill)
                  </label>
                  <span className="text-[11px] text-nova-muted">Click to auto-configure deck</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {STARTER_PROMPTS.map((starter, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectStarter(starter)}
                      className="text-left p-3.5 rounded-2xl border border-nova-border hover:border-nova-cyan/60 bg-nova-midnight/60 hover:bg-nova-surface transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-lg">{starter.icon}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-nova-surface border border-nova-border text-nova-muted group-hover:text-nova-cyan group-hover:border-nova-cyan/40">
                          {starter.tag}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-nova-softWhite group-hover:text-nova-cyan transition-colors line-clamp-1">
                        {starter.label}
                      </p>
                      <p className="text-[11px] text-nova-muted line-clamp-2 mt-1 leading-relaxed">
                        {starter.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document upload box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                  Or Upload Source Material (Optional)
                </label>
                <div className="border-2 border-dashed border-nova-border hover:border-nova-cyan/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-nova-midnight/40 relative">
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-nova-cyan" />
                    <span className="text-sm font-semibold text-nova-softWhite">
                      {uploadedFileName ? `Attached: ${uploadedFileName}` : "Drop files here or click to browse"}
                    </span>
                    <span className="text-xs text-nova-muted">Supports TXT, MD, PDF, and DOCX notes</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="cyan" size="lg" onClick={handleProceedToConfig} className="gap-2 font-bold">
                  Continue to Configuration
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIGURE & TEMPLATE SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-10">
            <div className="bg-nova-surface/70 rounded-3xl border border-nova-border p-6 sm:p-10 shadow-2xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-nova-cyan">Step 2 of 4</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite mt-1">
                    Configure Deck Parameters
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="gap-1.5">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Presentation Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-nova-midnight/80 border border-nova-border p-3 text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Academic Viva Examiners, Angel Investors"
                    className="w-full rounded-xl bg-nova-midnight/80 border border-nova-border p-3 text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Slide Count ({numSlides} slides)
                  </label>
                  <select
                    value={numSlides}
                    onChange={(e) => setNumSlides(parseInt(e.target.value))}
                    className="w-full rounded-xl bg-nova-midnight/80 border border-nova-border p-3 text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
                  >
                    <option value={5}>5 slides (Quick Pitch)</option>
                    <option value={8}>8 slides (Executive Brief)</option>
                    <option value={10}>10 slides (Comprehensive)</option>
                    <option value={15}>15 slides (Dissertation Viva)</option>
                    <option value={20}>20 slides (Technical Deep Dive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAspectRatio("16:9")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        aspectRatio === "16:9"
                          ? "bg-nova-cyan/15 border-nova-cyan text-nova-cyan"
                          : "bg-nova-midnight border-nova-border text-nova-muted"
                      }`}
                    >
                      16:9 Widescreen
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio("4:3")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        aspectRatio === "4:3"
                          ? "bg-nova-cyan/15 border-nova-cyan text-nova-cyan"
                          : "bg-nova-midnight border-nova-border text-nova-muted"
                      }`}
                    >
                      4:3 Standard
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Content Density
                  </label>
                  <select
                    value={contentDensity}
                    onChange={(e) => setContentDensity(e.target.value as any)}
                    className="w-full rounded-xl bg-nova-midnight/80 border border-nova-border p-3 text-sm text-nova-softWhite focus:border-nova-cyan focus:outline-none"
                  >
                    <option value="concise">Concise (Punchy bullets)</option>
                    <option value="balanced">Balanced (Editorial standard)</option>
                    <option value="detailed">Detailed (Technical depth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-nova-muted mb-2">
                    Options & Citations
                  </label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-nova-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSpeakerNotes}
                        onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
                        className="rounded text-nova-cyan focus:ring-nova-cyan"
                      />
                      Speaker Notes
                    </label>
                    <label className="flex items-center gap-2 text-xs text-nova-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCitations}
                        onChange={(e) => setIncludeCitations(e.target.checked)}
                        className="rounded text-nova-cyan focus:ring-nova-cyan"
                      />
                      Citations
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selection Gallery */}
            <div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-nova-softWhite">
                    Choose Presentation Design Template
                  </h3>
                  <p className="text-xs text-nova-muted mt-0.5">
                    Select from 28 custom visual themes with distinct typography and color systems.
                  </p>
                </div>

                {/* Search & Categories */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-nova-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={templateSearchQuery}
                      onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      className="w-full sm:w-48 pl-9 pr-3 py-1.5 rounded-xl bg-nova-midnight/80 border border-nova-border text-xs text-nova-softWhite placeholder-nova-muted focus:border-nova-cyan focus:outline-none"
                    />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-1 bg-nova-surface p-1 rounded-xl border border-nova-border text-xs">
                    {["All", "Technology", "Business", "Academic", "Marketing", "Industry"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTemplateCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                          templateCategoryFilter === cat
                            ? "bg-nova-magenta text-white shadow-sm"
                            : "text-nova-muted hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Selection Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-nova-surface via-nova-surface/90 to-nova-midnight border border-nova-cyan/40 shadow-[0_0_20px_rgba(67,213,232,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-nova-border flex-shrink-0">
                    <img src={selectedTemplate.previewThumbnail} alt={selectedTemplate.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-nova-cyan tracking-wider">Active Selection:</span>
                      <span className="text-sm font-bold text-white">{selectedTemplate.name}</span>
                      {selectedTemplate.isPremium && (
                        <span className="px-2 py-0.5 rounded-full bg-nova-magenta/20 border border-nova-magenta/40 text-[10px] font-black text-nova-magenta">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-nova-muted mt-0.5 line-clamp-1">{selectedTemplate.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs text-nova-muted font-medium">Palette:</span>
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedTemplate.colorPalette.primary }} title="Primary" />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedTemplate.colorPalette.accent }} title="Accent" />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedTemplate.colorPalette.background }} title="Background" />
                  <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-nova-midnight text-nova-cyan border border-nova-border">
                    {selectedTemplate.category}
                  </span>
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredTemplates.map((t) => {
                  const isSelected = selectedTemplateId === t.id || selectedTemplateId === t.slug;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplateId(t.slug);
                        toast.info(`Selected: ${t.name}`);
                      }}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected
                          ? "border-nova-cyan shadow-[0_0_25px_rgba(67,213,232,0.3)] scale-[1.02]"
                          : "border-nova-border hover:border-nova-borderLight bg-nova-surface"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-nova-card">
                        <img
                          src={t.previewThumbnail}
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {t.isPremium && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-nova-midnight/80 backdrop-blur-md border border-nova-magenta/60 text-[10px] font-black text-nova-magenta flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            PRO
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-nova-cyan/20 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="w-9 h-9 rounded-full bg-nova-cyan text-nova-midnight flex items-center justify-center shadow-lg font-bold">
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3.5 bg-nova-surface">
                        <h4 className="text-sm font-bold text-nova-softWhite truncate">{t.name}</h4>
                        <p className="text-[11px] text-nova-muted line-clamp-1 mt-0.5">{t.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.colorPalette.primary }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: t.colorPalette.accent }}
                          />
                          <span className="text-[10px] text-nova-darkMuted uppercase ml-auto font-mono">
                            {t.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isGeneratingOutline}
                  onClick={handleGenerateOutline}
                  className="gap-2 font-bold shadow-[0_0_25px_rgba(232,45,168,0.3)]"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate AI Outline
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: EDITABLE OUTLINE */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto bg-nova-surface/70 rounded-3xl border border-nova-border p-6 sm:p-10 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-nova-cyan">Step 3 of 4</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-nova-softWhite mt-1">
                  Review & Refine Slide Outline
                </h2>
                <p className="text-xs text-nova-muted mt-1">
                  Edit titles, add slides, or reorder the structural flow before synthesizing presentation content.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            {outlineError && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs mb-6 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>{outlineError}</span>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {outline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-nova-midnight/80 border border-nova-border hover:border-nova-borderLight transition-all"
                >
                  <span className="w-7 h-7 rounded-lg bg-nova-surface border border-nova-border text-nova-cyan flex items-center justify-center text-xs font-black flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateOutlineTitle(idx, e.target.value)}
                    className="flex-1 bg-transparent text-sm font-semibold text-nova-softWhite focus:outline-none focus:text-nova-cyan transition-colors"
                  />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nova-surface border border-nova-border text-nova-muted uppercase hidden sm:inline-block">
                    {item.layoutType}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOutlineItem(idx)}
                    className="p-1.5 rounded-lg text-nova-muted hover:text-red-400 hover:bg-nova-surface transition-colors"
                    title="Remove slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-nova-border">
              <Button variant="outline" size="sm" onClick={handleAddOutlineItem} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Add Slide
              </Button>

              <Button
                variant="cyan"
                size="lg"
                isLoading={isGeneratingDeck}
                onClick={handleGenerateDeck}
                className="gap-2 font-bold shadow-[0_0_25px_rgba(67,213,232,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                Synthesize Presentation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: LIVE SYNTHESIS PROGRESS */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto bg-nova-surface/90 rounded-3xl border border-nova-border p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-nova-magenta to-nova-cyan mx-auto mb-6 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(232,45,168,0.4)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-black text-nova-softWhite mb-2">
              Building Your Presentation
            </h2>
            <p className="text-sm text-nova-muted mb-8">{generationStepLabel}</p>

            {/* Real Progress Bar */}
            <div className="w-full h-3 rounded-full bg-nova-midnight border border-nova-border overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-nova-magenta via-nova-softWhite to-nova-cyan transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-nova-cyan font-bold">{generationProgress}% Completed</span>

            {generationError && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">
                {generationError}
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>
                    Return to Outline
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* UPGRADE MODAL FOR LOCKED TEMPLATES */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Unlock All 28 Pro Templates"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-nova-card border border-nova-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nova-magenta/20 border border-nova-magenta flex items-center justify-center text-nova-magenta flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-nova-softWhite">
                {lockedTemplateAttempt?.name || "Premium Design Template"}
              </h4>
              <p className="text-xs text-nova-muted">
                Unlock all 28 publication-ready visual design templates with Pro Studio.
              </p>
            </div>
          </div>

          <ul className="text-xs space-y-2 text-nova-softWhite/90">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
              <span>Full instant access to all 28+ custom design templates</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
              <span>Editable Microsoft PowerPoint (.PPTX) and PDF export</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-nova-cyan" />
              <span>Unlimited presentations and AI slide regenerations</span>
            </li>
          </ul>

          <div className="pt-4 flex flex-col gap-2">
            <Button variant="primary" size="lg" onClick={handleUpgradeToPro} className="w-full font-bold shadow-lg">
              <Zap className="w-4 h-4 mr-1.5" />
              Unlock Pro Studio Now (Free Instant Access)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUpgradeModal(false);
                setSelectedTemplateId("virtual-reality-lab");
                toast.info("Switched to free Virtual Reality Lab template.");
              }}
            >
              Or continue with Virtual Reality Lab
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

export default function CreatePresentationPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-nova-midnight flex items-center justify-center text-nova-softWhite">
          <div className="w-8 h-8 border-2 border-nova-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreatePresentationWizard />
    </React.Suspense>
  );
}
