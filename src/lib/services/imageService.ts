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

  // Curated high-resolution fallback library with explicit labeling
  const CURATED_CATEGORY_IMAGES: Record<string, string> = {
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    vr: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=80",
    ai: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    cyber: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    finance: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  };

  const pLower = request.prompt.toLowerCase();
  let selected = CURATED_CATEGORY_IMAGES.tech;
  if (pLower.includes("vr") || pLower.includes("virtual") || pLower.includes("spatial")) {
    selected = CURATED_CATEGORY_IMAGES.vr;
  } else if (pLower.includes("ai") || pLower.includes("neural") || pLower.includes("machine")) {
    selected = CURATED_CATEGORY_IMAGES.ai;
  } else if (pLower.includes("cyber") || pLower.includes("security") || pLower.includes("threat")) {
    selected = CURATED_CATEGORY_IMAGES.cyber;
  } else if (pLower.includes("data") || pLower.includes("analytics") || pLower.includes("chart")) {
    selected = CURATED_CATEGORY_IMAGES.data;
  } else if (pLower.includes("finance") || pLower.includes("money") || pLower.includes("revenue")) {
    selected = CURATED_CATEGORY_IMAGES.finance;
  } else if (pLower.includes("health") || pLower.includes("medical") || pLower.includes("bio")) {
    selected = CURATED_CATEGORY_IMAGES.health;
  } else if (pLower.includes("corp") || pLower.includes("strategy") || pLower.includes("market")) {
    selected = CURATED_CATEGORY_IMAGES.business;
  }

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
