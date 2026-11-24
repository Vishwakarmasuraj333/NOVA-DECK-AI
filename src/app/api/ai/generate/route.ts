import { NextResponse } from "next/server";
import { generateSlidesWithAI, getAIProviderStatus } from "@/lib/services/aiService";
import { CreatePresentationInput, OutlineItem } from "@/types";

export async function POST(req: Request) {
  try {
    const body: { input: CreatePresentationInput; outline: OutlineItem[] } = await req.json();

    if (!body.input || !body.outline || !body.outline.length) {
      return NextResponse.json({ error: "Input configuration and outline are required" }, { status: 400 });
    }

    const status = getAIProviderStatus();
    if (!status.isConfigured) {
      return NextResponse.json(
        {
          error: "MISSING_GEMINI_CREDENTIALS",
          message:
            "Google Gemini API key is missing. Add GEMINI_API_KEY in .env to generate live presentation slides.",
          setupUrl: "https://aistudio.google.com/",
        },
        { status: 503 }
      );
    }

    const slides = await generateSlidesWithAI(body.input, body.outline);
    return NextResponse.json({ success: true, slides });
  } catch (error: any) {
    console.error("AI Slides Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate slides" },
      { status: 500 }
    );
  }
}
