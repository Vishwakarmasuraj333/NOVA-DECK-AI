import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json(); // restore or delete

    if (action === "restore") {
      await prisma.presentation.update({
        where: { id: params.id },
        data: { isDeleted: false, deletedAt: null },
      });
      return NextResponse.json({ success: true, message: "Restored from trash" });
    }

    if (action === "delete_permanently") {
      await prisma.presentation.delete({ where: { id: params.id } });
      return NextResponse.json({ success: true, message: "Permanently destroyed" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Trash action failed" }, { status: 500 });
  }
}
