import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePlatformAdmin } from "@/lib/admin";

export async function GET() {
  await requirePlatformAdmin();
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ flags });
}

const flagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await requirePlatformAdmin();
  const body = flagSchema.parse(await req.json());
  const flag = await prisma.featureFlag.upsert({
    where: { key: body.key },
    create: { key: body.key, enabled: body.enabled, description: body.description ?? "" },
    update: { enabled: body.enabled, description: body.description },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "admin.flag.update", target: body.key, meta: body },
  });

  return NextResponse.json({ flag });
}