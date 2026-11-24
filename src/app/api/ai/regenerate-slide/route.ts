import { NextResponse } from "next/server";
import { regenerateSlideWithAI, getAIProviderStatus } from "@/lib/services/aiService";
import { SlideDocument } from "@/types";

export async function POST(req: Request) {
  try {
    const { slide, instruction, customInstruction } = await req.json();

    if (!slide || !instruction) {
      return NextResponse.json({ error: "Slide and instruction are required" }, { status: 400 });
    }

    const status = getAIProviderStatus();
    if (!status.isConfigured) {
      return NextResponse.json(
        {
          error: "MISSING_GEMINI_CREDENTIALS",
          message:
            "Google Gemini API key is required for AI slide refinement.",
        },
        { status: 503 }
      );
    }

    const updatedFields = await regenerateSlideWithAI(slide, instruction, customInstruction);
    return NextResponse.json({ success: true, updatedSlide: { ...slide, ...updatedFields } });
  } catch (error: any) {
    console.error("AI Slide regeneration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to regenerate slide" },
      { status: 500 }
    );
  }
}
