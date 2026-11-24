import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in or create an account to upgrade." }, { status: 401 });
    }

    const { plan } = await req.json(); // "PRO" or "ENTERPRISE"
    if (!["PRO", "ENTERPRISE"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
    }

    // Update user role and subscription
    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id: user.id },
        data: { role: plan === "ENTERPRISE" ? "ADMIN" : "PRO" },
      });

      const sub = await tx.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        create: {
          userId: user.id,
          plan,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "SUBSCRIPTION_UPGRADED",
          resourceType: "SUBSCRIPTION",
          resourceId: sub.id,
          metadata: JSON.stringify({ previousPlan: "FREE", newPlan: plan }),
        },
      });

      return { user: u, subscription: sub };
    });

    return NextResponse.json({ success: true, ...updated });
  } catch (error: any) {
    console.error("Upgrade subscription error:", error);
    return NextResponse.json({ error: error.message || "Failed to process upgrade" }, { status: 500 });
  }
}
