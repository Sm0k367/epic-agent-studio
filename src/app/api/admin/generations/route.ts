import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePlatformAdmin } from "@/lib/admin";

export async function GET() {
  try {
    await requirePlatformAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const generations = await prisma.generation.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json({ generations });
}