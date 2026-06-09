import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { googleAuthReady } from "@/lib/google-auth";
import { ensureUserWorkspace } from "@/lib/tenant";
import { Role } from "@prisma/client";

function platformAdminEmails(): Set<string> {
  const raw = process.env.PLATFORM_ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: googleAuthReady()
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: { params: { prompt: "consent", access_type: "offline" } },
        }),
      ]
    : [],
  pages: {
    signIn: "/login",
  },
  // JWT sessions are required for auth() in Edge middleware (database sessions only work in Node).
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/auth/continue`;
    },
    async signIn({ user }) {
      if (!user.email) return false;
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Only query Prisma on initial sign-in or explicit session update (Node handlers).
      // Middleware runs on Edge — Prisma is unavailable there; re-read the cached role from token.
      if (user?.id) {
        token.sub = user.id;
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.role = (dbUser?.role ?? Role.USER) as Role;
      } else if (trigger === "update" && typeof token.sub === "string") {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        token.role = (dbUser?.role ?? Role.USER) as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.sub === "string") {
        session.user.id = token.sub;
        session.user.role = (token.role as Role) ?? Role.USER;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (!user.id || !user.email) return;
      await ensureUserWorkspace(user.id, user.name ?? user.email.split("@")[0]);
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: isNewUser ? "customer.signup" : "customer.signin",
          target: user.email,
        },
      });
    },
    async createUser({ user }) {
      if (!user.email || !user.id) return;
      const admins = platformAdminEmails();
      if (admins.has(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: Role.PLATFORM_ADMIN },
        });
      }
    },
  },
});