import { describe, it, expect } from "vitest";
import {
  getUserEntitlements,
  canUseTemplate,
  canExportPresentation,
  canUseFeature,
} from "../lib/auth/entitlements";
import { getTemplateById, TEMPLATES } from "../lib/templates/registry";
import { UserSession } from "../types";

describe("Entitlements & Access Control", () => {
  const freeUser: UserSession = {
    id: "usr_free",
    email: "free@example.com",
    name: "Free User",
    role: "USER",
  };

  const proUser: UserSession = {
    id: "usr_pro",
    email: "pro@example.com",
    name: "Pro User",
    role: "PRO",
  };

  const freeTemplate = TEMPLATES.find((t) => !t.isPremium)!;
  const premiumTemplate = TEMPLATES.find((t) => t.isPremium)!;

  it("should return correct tier and limits for free users", () => {
    const entitlements = getUserEntitlements(freeUser);
    expect(entitlements.tier).toBe("FREE");
    expect(entitlements.canAccessPremiumTemplates).toBe(false);
    expect(entitlements.canExportPptx).toBe(false);
    expect(entitlements.canExportPdf).toBe(true);
  });

  it("should return PRO privileges for pro users", () => {
    const entitlements = getUserEntitlements(proUser);
    expect(entitlements.tier).toBe("PRO");
    expect(entitlements.canAccessPremiumTemplates).toBe(true);
    expect(entitlements.canExportPptx).toBe(true);
    expect(entitlements.canExportPdf).toBe(true);
  });

  it("canUseTemplate should allow free templates for everyone", () => {
    expect(canUseTemplate(null, freeTemplate).allowed).toBe(true);
    expect(canUseTemplate(freeUser, freeTemplate).allowed).toBe(true);
    expect(canUseTemplate(proUser, freeTemplate).allowed).toBe(true);
  });

  it("canUseTemplate should block premium templates for free/unauthenticated users", () => {
    const unauthedCheck = canUseTemplate(null, premiumTemplate);
    expect(unauthedCheck.allowed).toBe(false);
    expect(unauthedCheck.reason).toContain("locked PRO design");

    const freeCheck = canUseTemplate(freeUser, premiumTemplate);
    expect(freeCheck.allowed).toBe(false);
    expect(freeCheck.reason).toContain("locked PRO design");

    const proCheck = canUseTemplate(proUser, premiumTemplate);
    expect(proCheck.allowed).toBe(true);
  });

  it("canExportPresentation should gate PPTX exports", () => {
    expect(canExportPresentation(freeUser, "pdf")).toBe(true);
    expect(canExportPresentation(freeUser, "pptx")).toBe(false);
    expect(canExportPresentation(proUser, "pptx")).toBe(true);
  });

  it("canUseFeature should return correct feature gating", () => {
    expect(canUseFeature(freeUser, "premium_templates")).toBe(false);
    expect(canUseFeature(proUser, "premium_templates")).toBe(true);
  });
});
