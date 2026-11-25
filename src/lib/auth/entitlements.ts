import { UserSession, TemplateDefinition } from "@/types";

export interface UserEntitlements {
  tier: "FREE" | "PRO" | "ENTERPRISE";
  canAccessPremiumTemplates: boolean;
  canExportPdf: boolean;
  canExportPptx: boolean;
  canExportJson: boolean;
  canUseCustomBranding: boolean;
  canUseAiGeneration: boolean;
  maxSlidesPerDeck: number;
  monthlyAiGenerations: number;
}

/**
 * Returns comprehensive capability flags for the given user session.
 */
export function getUserEntitlements(user: UserSession | null): UserEntitlements {
  const isPro = user?.role === "PRO" || user?.role === "ADMIN";
  const isAdmin = user?.role === "ADMIN";

  if (isAdmin) {
    return {
      tier: "ENTERPRISE",
      canAccessPremiumTemplates: true,
      canExportPdf: true,
      canExportPptx: true,
      canExportJson: true,
      canUseCustomBranding: true,
      canUseAiGeneration: true,
      maxSlidesPerDeck: 100,
      monthlyAiGenerations: 9999,
    };
  }

  if (isPro) {
    return {
      tier: "PRO",
      canAccessPremiumTemplates: true,
      canExportPdf: true,
      canExportPptx: true,
      canExportJson: true,
      canUseCustomBranding: true,
      canUseAiGeneration: true,
      maxSlidesPerDeck: 50,
      monthlyAiGenerations: 500,
    };
  }

  // Free Tier Defaults
  return {
    tier: "FREE",
    canAccessPremiumTemplates: false,
    canExportPdf: true,
    canExportPptx: false,
    canExportJson: true,
    canUseCustomBranding: false,
    canUseAiGeneration: true,
    maxSlidesPerDeck: 12,
    monthlyAiGenerations: 10,
  };
}

/**
 * Validates whether a user can create or use a specific presentation template.
 */
export function canUseTemplate(
  user: UserSession | null,
  template: TemplateDefinition
): { allowed: boolean; reason?: string } {
  if (!template.isPremium) {
    return { allowed: true };
  }

  const entitlements = getUserEntitlements(user);
  if (entitlements.canAccessPremiumTemplates) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `The template "${template.name}" is a locked PRO design. Upgrade to NovaDeck PRO to unlock all 50 high-impact presentation templates, unlimited AI generation, and PowerPoint (.pptx) exports.`,
  };
}

/**
 * Validates whether a user can export to a specific format.
 */
export function canExportPresentation(
  user: UserSession | null,
  format: "pdf" | "pptx" | "json"
): boolean {
  const entitlements = getUserEntitlements(user);
  if (format === "pptx") return entitlements.canExportPptx;
  if (format === "pdf") return entitlements.canExportPdf;
  if (format === "json") return entitlements.canExportJson;
  return false;
}

/**
 * Validates specific platform capability gating.
 */
export function canUseFeature(user: UserSession | null, feature: string): boolean {
  const entitlements = getUserEntitlements(user);
  switch (feature) {
    case "premium_templates":
      return entitlements.canAccessPremiumTemplates;
    case "export_pptx":
      return entitlements.canExportPptx;
    case "custom_branding":
      return entitlements.canUseCustomBranding;
    case "ai_generation":
      return entitlements.canUseAiGeneration;
    default:
      return true;
  }
}
