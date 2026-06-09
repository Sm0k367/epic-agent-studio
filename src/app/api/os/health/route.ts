import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
      platform: "epic-agent-studio",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, database: "error", message: String(e) },
      { status: 500 },
    );
  }
}