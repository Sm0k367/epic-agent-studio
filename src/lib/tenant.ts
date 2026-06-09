import { prisma } from "@/lib/db";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return base || "workspace";
}

export function getWorkspaceMeta(meta: unknown): Record<string, string> {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

export async function ensureUserWorkspace(userId: string, displayName: string) {
  const existing = await prisma.workspace.findUnique({ where: { userId } });
  if (existing) return existing;

  let slug = slugify(displayName);
  let attempt = 0;
  while (await prisma.workspace.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${slugify(displayName)}-${attempt}`;
  }

  return prisma.workspace.create({
    data: {
      userId,
      name: `${displayName}'s Studio`,
      slug,
      plan: "inactive",
      meta: {},
    },
  });
}

export async function getWorkspaceForUser(userId: string) {
  let ws = await prisma.workspace.findUnique({
    where: { userId },
    include: { user: true },
  });
  if (!ws) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    ws = await ensureUserWorkspace(userId, user?.name ?? "User").then((w) =>
      prisma.workspace.findUnique({
        where: { id: w.id },
        include: { user: true },
      }),
    );
  }
  return ws;
}

export async function updateWorkspaceMeta(workspaceId: string, patch: Record<string, string>) {
  const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!ws) return;
  const current = getWorkspaceMeta(ws.meta);
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { meta: { ...current, ...patch } },
  });
}