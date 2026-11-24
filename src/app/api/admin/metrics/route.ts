import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { getAIProviderStatus } from "@/lib/services/aiService";
import { getImageProviderStatus } from "@/lib/services/imageService";

export async function GET() {
  try {
    const user = await getCurrentUser();
    // In production, enforce admin check:
    // if (user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [
      userCount,
      presentationCount,
      slideCount,
      auditCount,
      users,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.presentation.count({ where: { isDeleted: false } }),
      prisma.slide.count(),
      prisma.auditLog.count(),
      prisma.user.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          subscription: true,
          _count: { select: { presentations: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    const aiStatus = getAIProviderStatus();
    const imageStatus = getImageProviderStatus();

    return NextResponse.json({
      metrics: {
        totalUsers: userCount,
        totalPresentations: presentationCount,
        totalSlides: slideCount,
        totalAuditEvents: auditCount,
      },
      providers: {
        ai: {
          name: "Google Gemini",
          model: aiStatus.modelName,
          isConfigured: aiStatus.isConfigured,
          envVarName: "GEMINI_API_KEY",
        },
        image: {
          activeProvider: imageStatus.activeProvider,
          isConfigured: imageStatus.isConfigured,
          supported: imageStatus.supportedProviders,
        },
      },
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        plan: u.subscription?.plan || "FREE",
        presentationCount: u._count.presentations,
        createdAt: u.createdAt,
      })),
      auditLogs: recentAuditLogs,
    });
  } catch (error: any) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch metrics" }, { status: 500 });
  }
}
