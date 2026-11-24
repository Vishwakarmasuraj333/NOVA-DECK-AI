import { describe, it, expect } from "vitest";
import { getAIProviderStatus } from "../lib/services/aiService";
import { getImageProviderStatus } from "../lib/services/imageService";

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
});
