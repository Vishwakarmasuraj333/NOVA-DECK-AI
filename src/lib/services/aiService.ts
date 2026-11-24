import { GoogleGenerativeAI } from "@google/generative-ai";
import { CreatePresentationInput, OutlineItem, SlideDocument, SlideLayoutType } from "@/types";
import { getTemplateById } from "@/lib/templates/registry";
import { generateId } from "@/lib/utils";

export interface AIProviderStatus {
  isConfigured: boolean;
  provider: "gemini";
  modelName: string;
}

export function getAIProviderStatus(): AIProviderStatus {
  const key = process.env.GEMINI_API_KEY?.trim();
  return {
    isConfigured: Boolean(key && key.length > 5 && !key.includes("your_api_key")),
    provider: "gemini",
    modelName: "gemini-1.5-flash",
  };
}

function getGeminiClient() {
  const status = getAIProviderStatus();
  if (!status.isConfigured) {
    throw new Error(
      "GEMINI_API_KEY is not configured in your environment variables. Please add a valid Google AI Studio key to your .env file or host environment."
    );
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

/**
 * Generates an editable presentation outline based on topic, tone, audience, and slide count.
 */
export async function generateOutlineWithAI(
  input: CreatePresentationInput
): Promise<{ title: string; outline: OutlineItem[] }> {
  const status = getAIProviderStatus();

  // If Gemini is configured, use real Gemini 1.5
  if (status.isConfigured) {
    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = `You are a world-class presentation strategist and principal UX designer at NOVA DECK AI.
Generate a structured presentation outline for:
Topic: "${input.prompt}"
Target Audience: ${input.audience || "Professional / Industry stakeholders"}
Purpose: ${input.purpose || "Executive presentation and strategic decision making"}
Slide Count: ${input.numSlides || 8}
Tone: ${input.tone || "Authoritative, concise, and visionary"}
Template: ${input.templateId}
Language: ${input.language || "English"}
${input.sourceText ? `Source Material provided:\n${input.sourceText.slice(0, 3000)}\n` : ""}

Available layout types:
- cover (Slide 1 must always be cover)
- agenda (Slide 2 is typically agenda)
- section_divider
- text
- image_text
- full_image
- comparison
- stats
- timeline
- process
- chart
- diagram
- quote
- case_study
- conclusion
- references (Final slide if citations requested)

Return a JSON object strictly conforming to this schema:
{
  "title": "Comprehensive professional title",
  "outline": [
    {
      "order": 1,
      "title": "Slide Title",
      "layoutType": "cover",
      "description": "Short summary of what this slide will articulate"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || input.title || input.prompt.slice(0, 50),
      outline: parsed.outline,
    };
  }

  // If no Gemini key is provided, throw actionable configuration error as required
  throw new Error(
    "MISSING_GEMINI_CREDENTIALS: GEMINI_API_KEY environment variable is not configured. Add your Google Gemini API key to .env to use real AI generation."
  );
}

/**
 * Generates all slides based on user input and approved outline.
 */
export async function generateSlidesWithAI(
  input: CreatePresentationInput,
  outline: OutlineItem[],
  onProgress?: (step: string, percent: number) => void
): Promise<SlideDocument[]> {
  const status = getAIProviderStatus();

  if (!status.isConfigured) {
    throw new Error(
      "MISSING_GEMINI_CREDENTIALS: GEMINI_API_KEY environment variable is not configured. Add your Google Gemini API key to .env to use real AI generation."
    );
  }

  onProgress?.("Contacting Google Gemini API...", 20);

  const ai = getGeminiClient();
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.6,
    },
  });

  const template = getTemplateById(input.templateId);

  const prompt = `You are a master presentation designer for NOVA DECK AI.
Generate the complete content for each slide in the following outline.

Topic: "${input.prompt}"
Audience: ${input.audience || "General Professional"}
Purpose: ${input.purpose || "Strategic brief"}
Tone: ${input.tone || "Professional"}
Density: ${input.contentDensity || "balanced"}
Include Speaker Notes: ${input.includeSpeakerNotes ? "true" : "false"}
Include Citations: ${input.includeCitations ? "true" : "false"}
Selected Template: "${template?.name || "Virtual Reality Lab"}" (${template?.category})
${input.sourceText ? `Source Text Material:\n${input.sourceText.slice(0, 4000)}\n` : ""}

Outline to generate:
${JSON.stringify(outline, null, 2)}

Strict Requirements:
1. For each outline item, generate realistic, detailed, high-impact content.
2. If citations are requested, only cite real verifiable references or mark clearly as "[Unverified industry estimate]".
3. For slides with chart layout, generate 3-6 realistic data points with label and value.
4. For image_text or full_image layouts, provide a detailed, cinematic imagePrompt suitable for modern presentation photography or 3D render.
5. Speaker notes should provide articulate presenter speech guidance.

Return a JSON array of slide objects strictly following this schema:
[
  {
    "order": 1,
    "title": "Title",
    "subtitle": "Subtitle or context tagline",
    "layoutType": "cover",
    "body": "Paragraph explanation where relevant",
    "bulletPoints": ["Key point 1", "Key point 2", "Key point 3"],
    "imagePrompt": "Cinematic visual description for image generation",
    "chartData": {
      "type": "bar",
      "title": "Chart Title",
      "data": [{"label": "Q1", "value": 45}, {"label": "Q2", "value": 72}]
    },
    "speakerNotes": "Presenter talking notes",
    "citations": [
      {"source": "IEEE Spatial Systems Review 2024", "url": "https://doi.org/..."}
    ]
  }
]`;

  onProgress?.("Generating structured slide content and layouts...", 50);

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const rawSlides: Array<Partial<SlideDocument>> = JSON.parse(text);

  onProgress?.("Synthesizing typography and layout tokens...", 85);

  const slides: SlideDocument[] = rawSlides.map((raw, idx) => ({
    slideId: generateId("slide"),
    order: idx + 1,
    title: raw.title || outline[idx]?.title || `Slide ${idx + 1}`,
    subtitle: raw.subtitle || "",
    layoutType: (raw.layoutType as SlideLayoutType) || outline[idx]?.layoutType || "text",
    body: raw.body || "",
    bulletPoints: Array.isArray(raw.bulletPoints) ? raw.bulletPoints : [],
    imagePrompt: raw.imagePrompt || undefined,
    imageAsset: raw.imageAsset || template?.previewThumbnail || undefined,
    chartData: raw.chartData || undefined,
    speakerNotes: raw.speakerNotes || "",
    citations: raw.citations || [],
    themeTokens: {},
  }));

  onProgress?.("Completed", 100);
  return slides;
}

/**
 * Regenerates or improves a single slide using Gemini AI.
 */
export async function regenerateSlideWithAI(
  slide: SlideDocument,
  instruction: "rewrite" | "shorten" | "expand" | "tone_formal" | "tone_persuasive" | "translate",
  customInstruction?: string
): Promise<Partial<SlideDocument>> {
  const status = getAIProviderStatus();
  if (!status.isConfigured) {
    throw new Error(
      "MISSING_GEMINI_CREDENTIALS: GEMINI_API_KEY environment variable is not configured."
    );
  }

  const ai = getGeminiClient();
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `You are a presentation copywriter and editor for NOVA DECK AI.
Current Slide Content:
${JSON.stringify(slide, null, 2)}

Instruction: ${instruction}
${customInstruction ? `Custom instruction details: ${customInstruction}` : ""}

Return the updated slide fields in a JSON object strictly conforming to:
{
  "title": "Updated Title",
  "subtitle": "Updated Subtitle",
  "body": "Updated body text",
  "bulletPoints": ["Point 1", "Point 2"],
  "speakerNotes": "Updated speaker notes"
}`;

  const result = await model.generateContent(prompt);
  const updated = JSON.parse(result.response.text());
  return updated;
}
