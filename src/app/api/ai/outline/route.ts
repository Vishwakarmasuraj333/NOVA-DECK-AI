import { NextResponse } from "next/server";
import { generateOutlineWithAI, getAIProviderStatus } from "@/lib/services/aiService";
import { CreatePresentationInput } from "@/types";

export async function POST(req: Request) {
  try {
    const body: CreatePresentationInput = await req.json();

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: "Presentation prompt or topic is required" }, { status: 400 });
    }

    const status = getAIProviderStatus();
    if (!status.isConfigured) {
      return NextResponse.json(
        {
          error: "MISSING_GEMINI_CREDENTIALS",
          message:
            "Google Gemini API key is missing. To generate presentation outlines with real AI, please configure GEMINI_API_KEY in your .env file or project environment.",
          setupUrl: "https://aistudio.google.com/",
        },
        { status: 503 }
      );
    }

    const { title, outline } = await generateOutlineWithAI(body);
    return NextResponse.json({ success: true, title, outline });
  } catch (error: any) {
    console.error("AI Outline error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate outline" },
      { status: 500 }
    );
  }
}
