import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateId, slugify } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const original = await prisma.presentation.findUnique({
      where: { id: params.id },
      include: { slides: { orderBy: { order: "asc" } } },
    });

    if (!original) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    const duplicated = await prisma.$transaction(async (tx) => {
      const newPres = await tx.presentation.create({
        data: {
          title: `Copy of ${original.title}`,
          description: original.description,
          slug: `${original.slug}-copy-${generateId().slice(-4)}`,
          aspectRatio: original.aspectRatio,
          templateId: original.templateId,
          themeTokens: original.themeTokens,
          workspaceId: original.workspaceId,
          userId: original.userId,
        },
      });

      for (const s of original.slides) {
        await tx.slide.create({
          data: {
            presentationId: newPres.id,
            order: s.order,
            slideId: generateId("slide"),
            title: s.title,
            subtitle: s.subtitle,
            layoutType: s.layoutType,
            body: s.body,
            bulletPoints: s.bulletPoints,
            imagePrompt: s.imagePrompt,
            imageAsset: s.imageAsset,
            chartData: s.chartData,
            speakerNotes: s.speakerNotes,
            citations: s.citations,
            themeTokens: s.themeTokens,
          },
        });
      }

      return newPres;
    });

    return NextResponse.json({ success: true, presentation: duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to duplicate" }, { status: 500 });
  }
}
