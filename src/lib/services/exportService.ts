import pptxgen from "pptxgenjs";
import { jsPDF } from "jspdf";
import { PresentationDocument, TemplateDefinition } from "@/types";

/**
 * Generates an authentic Microsoft PowerPoint (.pptx) file with editable text,
 * shapes, background colors, bullet lists, charts, and speaker notes.
 */
export async function exportToPptx(
  presentation: PresentationDocument,
  template?: TemplateDefinition
): Promise<Blob> {
  const pptx = new pptxgen();

  // Set layout
  if (presentation.aspectRatio === "4:3") {
    pptx.layout = "LAYOUT_4x3";
  } else {
    pptx.layout = "LAYOUT_16x9";
  }

  pptx.title = presentation.title;
  pptx.subject = presentation.description || "NOVA DECK AI Presentation";
  pptx.author = "NOVA DECK AI";

  const palette = template?.colorPalette || {
    background: "#10091F",
    surface: "#1B1230",
    primary: "#E82DA8",
    accent: "#43D5E8",
    text: "#F8F5FF",
    muted: "#B7AEC9",
  };

  // Convert hex color to clean 6-digit hex without #
  const cleanHex = (hex: string) => hex.replace("#", "").slice(0, 6);

  const bgHex = cleanHex(palette.background);
  const textHex = cleanHex(palette.text);
  const primaryHex = cleanHex(palette.primary);
  const accentHex = cleanHex(palette.accent);
  const mutedHex = cleanHex(palette.muted);

  for (const slideDoc of presentation.slides) {
    const slide = pptx.addSlide();
    slide.background = { color: bgHex };

    // Slide Title
    slide.addText(slideDoc.title, {
      x: 0.8,
      y: 0.6,
      w: 8.4,
      h: 0.9,
      fontSize: slideDoc.layoutType === "cover" ? 36 : 24,
      fontFace: "Arial",
      bold: true,
      color: slideDoc.layoutType === "cover" ? accentHex : textHex,
      align: slideDoc.layoutType === "cover" ? "center" : "left",
    });

    // Subtitle if available
    if (slideDoc.subtitle) {
      slide.addText(slideDoc.subtitle, {
        x: 0.8,
        y: slideDoc.layoutType === "cover" ? 1.6 : 1.4,
        w: 8.4,
        h: 0.6,
        fontSize: slideDoc.layoutType === "cover" ? 18 : 14,
        fontFace: "Arial",
        italic: true,
        color: primaryHex,
        align: slideDoc.layoutType === "cover" ? "center" : "left",
      });
    }

    // Body paragraph
    if (slideDoc.body) {
      slide.addText(slideDoc.body, {
        x: 0.8,
        y: slideDoc.layoutType === "cover" ? 2.5 : 2.0,
        w: slideDoc.bulletPoints && slideDoc.bulletPoints.length > 0 ? 4.2 : 8.4,
        h: 2.8,
        fontSize: 13,
        fontFace: "Arial",
        color: textHex,
        lineSpacing: 18,
      });
    }

    // Bullet points
    if (slideDoc.bulletPoints && slideDoc.bulletPoints.length > 0) {
      const items = slideDoc.bulletPoints.map((bp) => ({
        text: bp,
        options: {
          bullet: true,
          color: textHex,
          fontSize: 13,
          fontFace: "Arial",
        },
      }));

      const startX = slideDoc.body ? 5.2 : 0.8;
      const width = slideDoc.body ? 4.0 : 8.4;

      slide.addText(items, {
        x: startX,
        y: 2.0,
        w: width,
        h: 3.0,
        lineSpacing: 22,
      });
    }

    // Chart if layoutType is chart and chartData exists
    if (slideDoc.layoutType === "chart" && slideDoc.chartData?.data) {
      const chartDataLabels = slideDoc.chartData.data.map((d) => d.label);
      const chartDataValues = slideDoc.chartData.data.map((d) => d.value);

      slide.addChart(pptx.ChartType.bar, [
        {
          name: slideDoc.chartData.title || "Metrics",
          labels: chartDataLabels,
          values: chartDataValues,
        },
      ], {
        x: 1.0,
        y: 2.2,
        w: 8.0,
        h: 3.0,
        barDir: "col",
        chartColors: [primaryHex, accentHex],
      });
    }

    // Speaker notes
    if (slideDoc.speakerNotes) {
      slide.addNotes(slideDoc.speakerNotes);
    }
  }

  // Export as ArrayBuffer Blob
  const buffer = await pptx.write({ outputType: "blob" });
  return buffer as Blob;
}

/**
 * Generates an authentic multi-page PDF document representing the presentation.
 */
export async function exportToPdf(
  presentation: PresentationDocument,
  template?: TemplateDefinition
): Promise<Blob> {
  const is4x3 = presentation.aspectRatio === "4:3";
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: is4x3 ? [800, 600] : [960, 540],
  });

  const width = is4x3 ? 800 : 960;
  const height = is4x3 ? 600 : 540;

  const palette = template?.colorPalette || {
    background: "#10091F",
    surface: "#1B1230",
    primary: "#E82DA8",
    accent: "#43D5E8",
    text: "#F8F5FF",
    muted: "#B7AEC9",
  };

  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substring(0, 2), 16) || 16,
      g: parseInt(clean.substring(2, 4), 16) || 9,
      b: parseInt(clean.substring(4, 6), 16) || 31,
    };
  };

  const bgRgb = hexToRgb(palette.background);
  const textRgb = hexToRgb(palette.text);
  const primaryRgb = hexToRgb(palette.primary);
  const accentRgb = hexToRgb(palette.accent);
  const mutedRgb = hexToRgb(palette.muted);

  presentation.slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage(is4x3 ? [800, 600] : [960, 540], "landscape");
    }

    // Draw background
    doc.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
    doc.rect(0, 0, width, height, "F");

    // Decorative brand banner top
    doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    doc.rect(0, 0, width, 4, "F");

    // Slide Number & Watermark
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
    doc.text(`NOVA DECK AI  |  Slide ${index + 1} of ${presentation.slides.length}`, 40, height - 20);

    // Slide Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(slide.layoutType === "cover" ? 30 : 22);
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    doc.text(slide.title, 40, slide.layoutType === "cover" ? height * 0.35 : 60);

    // Subtitle
    if (slide.subtitle) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(slide.layoutType === "cover" ? 16 : 13);
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.text(slide.subtitle, 40, slide.layoutType === "cover" ? height * 0.35 + 32 : 90);
    }

    // Body
    if (slide.body) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
      const splitBody = doc.splitTextToSize(slide.body, width - 80);
      doc.text(splitBody, 40, slide.layoutType === "cover" ? height * 0.35 + 80 : 130);
    }

    // Bullet points
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      let yOffset = slide.body ? 200 : 130;

      slide.bulletPoints.forEach((bp) => {
        // Bullet circle
        doc.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b);
        doc.circle(46, yOffset - 3, 2, "F");
        const lines = doc.splitTextToSize(bp, width - 110);
        doc.text(lines, 56, yOffset);
        yOffset += lines.length * 16 + 6;
      });
    }
  });

  return doc.output("blob");
}
