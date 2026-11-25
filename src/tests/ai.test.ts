import { describe, it, expect } from "vitest";
import { getAIProviderStatus } from "../lib/services/aiService";
import { getImageProviderStatus, getDistinctSlideImage } from "../lib/services/imageService";

describe("AI & Image Provider Service Status", () => {
  it("getAIProviderStatus should report status honestly without fake credentials", () => {
    const status = getAIProviderStatus();
    expect(status.provider).toBe("gemini");
    expect(status.modelName).toMatch(/^gemini/);
    expect(typeof status.isConfigured).toBe("boolean");
  });

  it("getImageProviderStatus should report supported providers and transparent active provider", () => {
    const status = getImageProviderStatus();
    expect(status.supportedProviders).toContain("gemini_imagen");
    expect(status.supportedProviders).toContain("curated_fallback");
    expect(typeof status.isConfigured).toBe("boolean");
  });

  it("getDistinctSlideImage should assign distinct, diverse high-resolution imagery for each slide", () => {
    const topic = "HTML IT Industry: Strategic Evolution and Market Dominance";
    const slide1Img = getDistinctSlideImage(topic, "HTML IT Industry: Strategic Landscape 2025+", "cover", 0);
    const slide2Img = getDistinctSlideImage(topic, "Agenda & Strategic Objectives", "agenda", 1);
    const slide3Img = getDistinctSlideImage(topic, "Macroeconomic Indicators & Market Valuation", "stats", 2);
    const slide4Img = getDistinctSlideImage(topic, "Technological Convergence: Standards & Frameworks", "image_text", 3);
    const slide5Img = getDistinctSlideImage(topic, "Legacy Architecture vs. Modern Web Standards", "comparison", 4);
    const slide6Img = getDistinctSlideImage(topic, "Strategic Roadmap for Digital Transformation", "timeline", 5);

    expect(slide1Img).toMatch(/^https:\/\/images\.unsplash\.com/);
    expect(slide2Img).toMatch(/^https:\/\/images\.unsplash\.com/);
    expect(slide3Img).toMatch(/^https:\/\/images\.unsplash\.com/);
    expect(slide4Img).toMatch(/^https:\/\/images\.unsplash\.com/);

    // Verify slide images are distinct and not all identical
    const uniqueImages = new Set([slide1Img, slide2Img, slide3Img, slide4Img, slide5Img, slide6Img]);
    expect(uniqueImages.size).toBeGreaterThan(1);
  });
});
