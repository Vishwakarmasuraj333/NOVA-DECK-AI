import { describe, it, expect } from "vitest";
import { TEMPLATES, getTemplateById, getAllCategories } from "../lib/templates/registry";

describe("Template Registry and Specifications", () => {
  it("should contain at least 24 distinct templates (implements 28)", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(24);
    expect(TEMPLATES.length).toBe(28);
  });

  it("every template must define unique id, slug, colors, and valid layouts", () => {
    const slugs = new Set<string>();
    const ids = new Set<string>();

    for (const t of TEMPLATES) {
      expect(t.id).toBeDefined();
      expect(t.slug).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.description).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.colorPalette).toBeDefined();
      expect(t.colorPalette.background).toMatch(/^#/);
      expect(t.colorPalette.primary).toMatch(/^#/);
      expect(t.colorPalette.accent).toMatch(/^#/);
      expect(t.colorPalette.text).toMatch(/^#/);
      expect(t.supportedLayouts.length).toBeGreaterThan(0);

      expect(slugs.has(t.slug)).toBe(false);
      expect(ids.has(t.id)).toBe(false);
      slugs.add(t.slug);
      ids.add(t.id);
    }
  });

  it("should have both free and premium templates defined", () => {
    const freeTemplates = TEMPLATES.filter((t) => !t.isPremium);
    const premiumTemplates = TEMPLATES.filter((t) => t.isPremium);

    expect(freeTemplates.length).toBeGreaterThan(0);
    expect(premiumTemplates.length).toBeGreaterThan(0);
  });

  it("getTemplateById should return the matching template or fallback", () => {
    const vrTemplate = getTemplateById("virtual-reality-lab");
    expect(vrTemplate).toBeDefined();
    expect(vrTemplate?.name).toBe("Virtual Reality Lab");

    const vivaTemplate = getTemplateById("msc-it-viva");
    expect(vivaTemplate).toBeDefined();
    expect(vivaTemplate?.name).toBe("MSc IT Viva");
  });

  it("getAllCategories should include 'All' and distinct categories", () => {
    const categories = getAllCategories();
    expect(categories).toContain("All");
    expect(categories).toContain("Technology");
    expect(categories).toContain("Business");
    expect(categories).toContain("Academic");
  });
});
