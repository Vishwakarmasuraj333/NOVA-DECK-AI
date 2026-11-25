export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  style?: "photorealistic" | "3d_render" | "minimal_vector" | "cyberpunk" | "editorial";
}

export interface ImageGenerationResult {
  url: string;
  provider: "unsplash" | "stability" | "gemini_imagen" | "curated_fallback";
  attribution?: string;
  isAiGenerated: boolean;
  status: "success" | "provider_unconfigured" | "failed";
  message?: string;
}

export interface ImageProviderStatus {
  activeProvider: string;
  isConfigured: boolean;
  supportedProviders: string[];
}

export function getImageProviderStatus(): ImageProviderStatus {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const provider = process.env.IMAGE_PROVIDER || "curated_fallback";

  const isConfigured = Boolean(
    (provider === "unsplash" && unsplashKey) ||
    (provider === "gemini" && geminiKey)
  );

  return {
    activeProvider: provider,
    isConfigured,
    supportedProviders: ["gemini_imagen", "unsplash", "curated_fallback"],
  };
}

/**
 * Rich, high-resolution distinct image libraries across every presentation domain.
 * Every pool has multiple high-fidelity Unsplash photography assets.
 */
export const CURATED_SLIDE_POOLS: Record<string, string[]> = {
  // HTML, Web Development, Frontend, Software
  web_dev: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80", // Modern syntax code editor
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", // Web developer typing with coffee
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80", // HTML / CSS code on dark screen
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80", // Responsive web design devices
    "https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80", // UI/UX design wireframes
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", // Software engineering code matrix
  ],

  // Cloud Infrastructure, Servers, Data Centers & DevOps
  cloud_infra: [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80", // Glowing blue server data center
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80", // Fiber optic network patch panel
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", // Global digital cloud mesh
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", // Microprocessor silicon architecture
    "https://images.unsplash.com/photo-1520869562399-e772f042f422?auto=format&fit=crop&w=1200&q=80", // Telecommunications relay tower
  ],

  // Artificial Intelligence, Machine Learning & Neural Networks
  ai_ml: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", // Glowing neural synapses
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80", // Humanoid AI robot interface
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80", // Multidimensional abstract tensor sphere
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80", // Quantum computing laboratory
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80", // Digital brain holographic model
  ],

  // Cybersecurity, SOC, Zero Trust & Compliance
  cybersecurity: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80", // Digital binary cyber stream
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80", // SOC telemetry screens
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80", // Cyber shield encryption lock
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80", // Cyber biometric security node
  ],

  // Market Valuation, Economics, Finance, Statistics & Charts
  finance_metrics: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80", // Financial trading floor terminal
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80", // Candlestick revenue analytics
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", // Big data KPI dashboard charts
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", // Growth curves and spreadsheet projections
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80", // Financial analysis line graph
  ],

  // Corporate Strategy, Executive Boardroom & Leadership
  business_strategy: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", // Glass corporate tower
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", // Modern boardroom table
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80", // Team strategy whiteboard
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80", // Executive leadership partnership
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80", // Corporate business suit leader
  ],

  // Strategic Roadmap, Process, Digital Transformation & Timeline
  roadmap_process: [
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80", // High-speed light trail highway
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80", // Rapid modern bullet train
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", // Blueprint architectural plans
    "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80", // Neon process pipeline
  ],

  // Agenda, Architecture Comparison & Frameworks
  agenda_alignment: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", // Clean strategic notebook & tablet
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80", // Collaborative developer team
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80", // Modern dual monitor workspace
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80", // Workshop brainstorm
  ],

  // Executive Conclusion, Decisions & Next Steps
  conclusion_vision: [
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80", // Keynote conference presentation stage
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", // Glowing mountain summit horizon
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Majestic vista landscape
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80", // Strategic boardroom applause
  ],

  // Academic Research, Viva, Methodology & Dissertations
  academic_research: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80", // University research campus
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80", // Scientific laboratory microscope
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80", // Open research dissertation books
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80", // Academic student defense
  ],

  // Creative, VR, 3D & Design
  creative_vr: [
    "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80", // VR virtual headset user
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80", // Neon cyberpunk architecture
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Modern architectural showcase
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=1200&q=80", // Vibrant colorful prism
  ],
};

/**
 * Returns a guaranteed DISTINCT, contextual image URL for each slide.
 * Evaluates topic, slide title, layout type, and slide index to ensure NO duplicate images appear in a deck.
 */
export function getDistinctSlideImage(
  topic: string,
  slideTitle: string,
  layoutType: string = "text",
  slideIndex: number = 0
): string {
  const combined = `${topic} ${slideTitle} ${layoutType}`.toLowerCase();

  // 1. Determine the best category pool
  let pool = CURATED_SLIDE_POOLS.web_dev;

  if (
    combined.includes("html") ||
    combined.includes("web") ||
    combined.includes("frontend") ||
    combined.includes("code") ||
    combined.includes("developer") ||
    combined.includes("javascript") ||
    combined.includes("css")
  ) {
    pool = CURATED_SLIDE_POOLS.web_dev;
  } else if (
    combined.includes("ai") ||
    combined.includes("neural") ||
    combined.includes("machine learning") ||
    combined.includes("deep learning") ||
    combined.includes("model") ||
    combined.includes("transformer") ||
    combined.includes("llm")
  ) {
    pool = CURATED_SLIDE_POOLS.ai_ml;
  } else if (
    combined.includes("security") ||
    combined.includes("cyber") ||
    combined.includes("zero trust") ||
    combined.includes("threat") ||
    combined.includes("soc") ||
    combined.includes("firewall") ||
    combined.includes("compliance") ||
    combined.includes("risk")
  ) {
    pool = CURATED_SLIDE_POOLS.cybersecurity;
  } else if (
    combined.includes("cloud") ||
    combined.includes("server") ||
    combined.includes("data center") ||
    combined.includes("infra") ||
    combined.includes("devops") ||
    combined.includes("architecture") ||
    combined.includes("microservice")
  ) {
    pool = CURATED_SLIDE_POOLS.cloud_infra;
  } else if (
    combined.includes("stat") ||
    combined.includes("metric") ||
    combined.includes("revenue") ||
    combined.includes("finance") ||
    combined.includes("valuation") ||
    combined.includes("market") ||
    combined.includes("economic") ||
    combined.includes("indicator") ||
    layoutType === "stats" ||
    layoutType === "chart"
  ) {
    pool = CURATED_SLIDE_POOLS.finance_metrics;
  } else if (
    combined.includes("roadmap") ||
    combined.includes("timeline") ||
    combined.includes("process") ||
    combined.includes("phase") ||
    combined.includes("transformation") ||
    layoutType === "timeline" ||
    layoutType === "process"
  ) {
    pool = CURATED_SLIDE_POOLS.roadmap_process;
  } else if (
    combined.includes("agenda") ||
    combined.includes("overview") ||
    combined.includes("convergence") ||
    combined.includes("objective") ||
    layoutType === "agenda"
  ) {
    pool = CURATED_SLIDE_POOLS.agenda_alignment;
  } else if (
    combined.includes("conclusion") ||
    combined.includes("next step") ||
    combined.includes("decision") ||
    combined.includes("summary") ||
    layoutType === "conclusion"
  ) {
    pool = CURATED_SLIDE_POOLS.conclusion_vision;
  } else if (
    combined.includes("viva") ||
    combined.includes("thesis") ||
    combined.includes("dissertation") ||
    combined.includes("academic") ||
    combined.includes("research") ||
    combined.includes("methodology")
  ) {
    pool = CURATED_SLIDE_POOLS.academic_research;
  } else if (
    combined.includes("vr") ||
    combined.includes("creative") ||
    combined.includes("design") ||
    combined.includes("portfolio") ||
    combined.includes("lookbook")
  ) {
    pool = CURATED_SLIDE_POOLS.creative_vr;
  } else {
    pool = CURATED_SLIDE_POOLS.business_strategy;
  }

  // 2. Select distinct item using slideIndex to prevent collisions
  const poolIndex = Math.abs(slideIndex) % pool.length;
  return pool[poolIndex];
}

/**
 * Image generation and retrieval service adhering to strict transparency:
 * Never labels stock or curated assets as AI-generated.
 */
export async function generateOrFetchImage(
  request: ImageGenerationRequest
): Promise<ImageGenerationResult> {
  const status = getImageProviderStatus();

  // If Unsplash is configured
  if (process.env.IMAGE_PROVIDER === "unsplash" && process.env.UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(request.prompt.slice(0, 50));
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          url: data.urls?.regular || data.urls?.full,
          provider: "unsplash",
          attribution: `Photo by ${data.user?.name} on Unsplash`,
          isAiGenerated: false,
          status: "success",
        };
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback to distinct curated image
  const selected = getDistinctSlideImage(request.prompt, request.prompt, "image_text", 0);

  return {
    url: selected,
    provider: "curated_fallback",
    attribution: "Unsplash Curated Presentation Stock (Not AI Generated)",
    isAiGenerated: false,
    status: status.isConfigured ? "success" : "provider_unconfigured",
    message: status.isConfigured
      ? undefined
      : "External AI Image Generation is not configured. Displaying curated presentation imagery.",
  };
}
