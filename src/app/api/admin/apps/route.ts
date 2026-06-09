import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

/** Legacy OS catalog admin — deprecated in Epic Agent Studio. */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ apps: [], message: "Catalog admin removed — use Generations tab." });
}

export async function POST() {
  return NextResponse.json({ error: "Catalog admin removed in Epic Agent Studio" }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Catalog admin removed in Epic Agent Studio" }, { status: 410 });
}