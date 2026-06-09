import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (/connect_timeout|connection_limit|pool_timeout/.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}connect_timeout=10&pool_timeout=10&connection_limit=5`;
}

const dbUrl = databaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;