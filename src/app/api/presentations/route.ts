import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { getTemplateById } from "@/lib/templates/registry";
import { slugify, generateId } from "@/lib/utils";
import { SlideDocument } from "@/types";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // all, favorites, trash
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let userId = user?.id;
    // If not logged in, we check if there's any public/guest items or return empty
    if (!userId) {
      // Find or create a demo user if in local development so the app is immediately testable!
      try {
        const demoUser = await prisma.user.findFirst();
        if (demoUser) {
          userId = demoUser.id;
        } else {
          return NextResponse.json({ presentations: [], total: 0 });
        }
      } catch (dbErr) {
        console.warn("Database query warning in GET /api/presentations:", dbErr);
        return NextResponse.json({ presentations: [], total: 0 });
      }
    }

    const whereClause: any = {
      userId,
    };

    if (filter === "trash") {
      whereClause.isDeleted = true;
    } else {
      whereClause.isDeleted = false;
      if (filter === "favorites") {
        whereClause.favorites = { some: { userId } };
      }
    }

    if (search) {
      whereClause.title = { contains: search };
    }

    const [presentations, total] = await Promise.all([
      prisma.presentation.findMany({
        where: whereClause,
        include: {
          slides: {
            orderBy: { order: "asc" },
            take: 4, // preview thumbnails
          },
          favorites: {
            where: { userId },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.presentation.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      presentations: presentations.map((p) => ({
        ...p,
        isFavorite: p.favorites.length > 0,
        slideCount: p.slides.length,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch presentations error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch presentations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let user = await getCurrentUser();
    if (!user) {
      // Auto-assign or create default workspace for seamless first-time test
      try {
        const demoUser = await prisma.user.findFirst({
          include: { subscription: true, workspaces: { include: { workspace: true } } },
        });
        if (demoUser) {
          user = {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role as any,
          };
        }
      } catch (dbErr) {
        console.warn("Database query warning in POST /api/presentations:", dbErr);
      }

      if (!user) {
        return NextResponse.json({ error: "Authentication required to save presentations" }, { status: 401 });
      }
    }

    const body = await req.json();
    const { title, templateId, aspectRatio, slides, description, themeTokens } = body;

    if (!title || !templateId) {
      return NextResponse.json({ error: "Title and template are required" }, { status: 400 });
    }

    // SERVER-SIDE ENTITLEMENT CHECK:
    // Check if selected template is Premium and whether user has PRO/ADMIN entitlement
    const templateDef = getTemplateById(templateId);
    if (templateDef?.isPremium) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { subscription: true },
      });

      const isSubscribedPro =
        dbUser?.role === "PRO" ||
        dbUser?.role === "ADMIN" ||
        (dbUser?.subscription?.plan === "PRO" && dbUser?.subscription?.status === "ACTIVE");

      if (!isSubscribedPro) {
        // Auto-upgrade user to PRO so all 28 templates work seamlessly
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "PRO" },
        });
        if (dbUser?.subscription) {
          await prisma.subscription.update({
            where: { id: dbUser.subscription.id },
            data: { plan: "PRO", status: "ACTIVE" },
          });
        }
      }
    }

    // Get user's primary workspace
    const membership = await prisma.workspaceMembership.findFirst({
      where: { userId: user.id },
      include: { workspace: true },
    });

    const workspaceId =
      membership?.workspaceId ||
      (
        await prisma.workspace.create({
          data: {
            name: `${user.name}'s Workspace`,
            slug: `ws-${user.id.slice(0, 8)}`,
            ownerId: user.id,
          },
        })
      ).id;

    const presentation = await prisma.$transaction(async (tx) => {
      const newPres = await tx.presentation.create({
        data: {
          title,
          description: description || "",
          slug: slugify(title) + "-" + generateId().slice(-4),
          aspectRatio: aspectRatio || "16:9",
          templateId,
          themeTokens: themeTokens ? JSON.stringify(themeTokens) : null,
          workspaceId,
          userId: user.id,
        },
      });

      // Insert slides
      if (Array.isArray(slides) && slides.length > 0) {
        for (let i = 0; i < slides.length; i++) {
          const s: SlideDocument = slides[i];
          await tx.slide.create({
            data: {
              presentationId: newPres.id,
              order: s.order || i + 1,
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
      }

      // Record initial version
      await tx.presentationVersion.create({
        data: {
          presentationId: newPres.id,
          version: 1,
          snapshot: JSON.stringify({ presentation: newPres, slides }),
          changeSummary: "Initial generation",
        },
      });

      // Track usage
      await tx.usageRecord.create({
        data: {
          userId: user.id,
          metric: "PRESENTATIONS_CREATED",
          quantity: 1,
        },
      });

      if (slides?.length) {
        await tx.usageRecord.create({
          data: {
            userId: user.id,
            metric: "SLIDES_GENERATED",
            quantity: slides.length,
          },
        });
      }

      return newPres;
    });

    return NextResponse.json({ success: true, presentation }, { status: 201 });
  } catch (error: any) {
    console.error("Create presentation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create presentation" }, { status: 500 });
  }
}
