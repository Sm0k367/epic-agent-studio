import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePlatformAdmin } from "@/lib/admin";
import { Role } from "@prisma/client";

export async function GET() {
  await requirePlatformAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { workspace: true },
  });
  return NextResponse.json({ users });
}

const patchSchema = z.object({
  userId: z.string(),
  role: z.nativeEnum(Role).optional(),
  plan: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await requirePlatformAdmin();
  const body = patchSchema.parse(await req.json());

  if (body.role) {
    await prisma.user.update({ where: { id: body.userId }, data: { role: body.role } });
  }
  if (body.plan) {
    await prisma.workspace.updateMany({
      where: { userId: body.userId },
      data: { plan: body.plan },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "admin.user.update",
      target: body.userId,
      meta: body,
    },
  });

  return NextResponse.json({ ok: true });
}