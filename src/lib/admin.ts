import { Role } from "@prisma/client";
import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (!["ADMIN", "PLATFORM_ADMIN"].includes(session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function requirePlatformAdmin() {
  const session = await requireAuth();
  if (session.user.role !== Role.PLATFORM_ADMIN) throw new Error("FORBIDDEN");
  return session;
}

export function isAdminRole(role: Role) {
  return role === Role.ADMIN || role === Role.PLATFORM_ADMIN;
}