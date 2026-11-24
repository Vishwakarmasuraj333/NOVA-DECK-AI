import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { SlideDocument } from "@/types";
import { generateId } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const presentation = await prisma.presentation.findUnique({
      where: { id: params.id },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!presentation) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    // Parse JSON fields in slides
    const parsedSlides: SlideDocument[] = presentation.slides.map((s) => ({
      slideId: s.slideId,
      order: s.order,
      title: s.title,
      subtitle: s.subtitle || undefined,
      layoutType: s.layoutType as any,
      body: s.body || undefined,
      bulletPoints: s.bulletPoints ? JSON.parse(s.bulletPoints) : [],
      imagePrompt: s.imagePrompt || undefined,
      imageAsset: s.imageAsset || undefined,
      chartData: s.chartData ? JSON.parse(s.chartData) : undefined,
      speakerNotes: s.speakerNotes || undefined,
      citations: s.citations ? JSON.parse(s.citations) : [],
      themeTokens: s.themeTokens ? JSON.parse(s.themeTokens) : {},
    }));

    return NextResponse.json({
      presentation: {
        ...presentation,
        slides: parsedSlides,
        themeTokens: presentation.themeTokens ? JSON.parse(presentation.themeTokens) : {},
      },
    });
  } catch (error: any) {
    console.error("Get presentation error:", error);
    return NextResponse.json({ error: error.message || "Failed to load presentation" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { title, description, aspectRatio, themeTokens, slides } = body;

    const existing = await prisma.presentation.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    // Update in transaction with version increment
    const updated = await prisma.$transaction(async (tx) => {
      const nextVersion = existing.version + 1;

      const p = await tx.presentation.update({
        where: { id: params.id },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
          aspectRatio: aspectRatio ?? existing.aspectRatio,
          themeTokens: themeTokens ? JSON.stringify(themeTokens) : existing.themeTokens,
          version: nextVersion,
        },
      });

      // If slides are provided, replace them atomically
      if (Array.isArray(slides)) {
        await tx.slide.deleteMany({ where: { presentationId: params.id } });

        for (let i = 0; i < slides.length; i++) {
          const s: SlideDocument = slides[i];
          await tx.slide.create({
            data: {
              presentationId: params.id,
              order: i + 1,
              slideId: s.slideId || generateId("slide"),
              title: s.title || `Slide ${i + 1}`,
              subtitle: s.subtitle || "",
              layoutType: s.layoutType || "text",
              body: s.body || "",
              bulletPoints: s.bulletPoints ? JSON.stringify(s.bulletPoints) : null,
              imagePrompt: s.imagePrompt || null,
              imageAsset: s.imageAsset || null,
              chartData: s.chartData ? JSON.stringify(s.chartData) : null,
              speakerNotes: s.speakerNotes || null,
              citations: s.citations ? JSON.stringify(s.citations) : null,
              themeTokens: s.themeTokens ? JSON.stringify(s.themeTokens) : null,
            },
          });
        }

        // Save version snapshot
        await tx.presentationVersion.create({
          data: {
            presentationId: params.id,
            version: nextVersion,
            snapshot: JSON.stringify({ presentation: p, slides }),
            changeSummary: `Autosaved revision v${nextVersion}`,
          },
        });
      }

      return p;
    });

    return NextResponse.json({ success: true, presentation: updated });
  } catch (error: any) {
    console.error("Update presentation error:", error);
    return NextResponse.json({ error: error.message || "Failed to update presentation" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      await prisma.presentation.delete({ where: { id: params.id } });
      return NextResponse.json({ success: true, message: "Permanently deleted" });
    }

    // Soft delete / Move to trash
    await prisma.presentation.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Moved to trash" });
  } catch (error: any) {
    console.error("Delete presentation error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
