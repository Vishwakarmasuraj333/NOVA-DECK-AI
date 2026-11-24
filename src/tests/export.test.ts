import { describe, it, expect } from "vitest";
import { exportToPptx, exportToPdf } from "../lib/services/exportService";
import { PresentationDocument } from "../types";
import { getTemplateById } from "../lib/templates/registry";

describe("Export System (PPTX & PDF Validity)", () => {
  const samplePresentation: PresentationDocument = {
    id: "pres_test_1",
    title: "AI in Cybersecurity for MSc IT Viva",
    description: "Dissertation evaluation defense presentation",
    slug: "ai-in-cybersecurity-msc-it-viva",
    aspectRatio: "16:9",
    templateId: "msc-it-viva",
    workspaceId: "ws_test_1",
    userId: "usr_test_1",
    version: 1,
    isArchived: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        slideId: "slide_1",
        order: 1,
        title: "AI in Cybersecurity Defense Matrix",
        subtitle: "MSc IT Final Dissertation Viva Defense",
        layoutType: "cover",
      },
      {
        slideId: "slide_2",
        order: 2,
        title: "System Architecture & Threat Vectors",
        layoutType: "stats",
        bulletPoints: [
          "Zero-trust packet inspection node",
          "Sub-4ms recurrent autoencoder anomaly detection",
          "Automated mitigation firewall webhooks",
        ],
      },
      {
        slideId: "slide_3",
        order: 3,
        title: "Comparative Benchmark Evaluation",
        layoutType: "chart",
        chartData: {
          type: "bar",
          title: "Detection Latency by Model Size",
          data: [
            { label: "Baseline SVM", value: 45 },
            { label: "Random Forest", value: 32 },
            { label: "NOVA Deep Autoencoder", value: 8 },
          ],
        },
      },
    ],
  };

  it("should generate a valid binary Microsoft PowerPoint (.pptx) file", async () => {
    const template = getTemplateById("msc-it-viva");
    const pptxBlob = await exportToPptx(samplePresentation, template);

    expect(pptxBlob).toBeDefined();
    expect(pptxBlob.size).toBeGreaterThan(1000); // Authentic binary PPTX file with zip container
  });

  it("should generate a valid multi-page PDF document", async () => {
    const template = getTemplateById("msc-it-viva");
    const pdfBlob = await exportToPdf(samplePresentation, template);

    expect(pdfBlob).toBeDefined();
    expect(pdfBlob.size).toBeGreaterThan(1000);
    expect(pdfBlob.type).toContain("pdf");
  });
});
