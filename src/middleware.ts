import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STALE_SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

const SESSION_COOKIES = STALE_SESSION_COOKIES;

function hasSessionCookie(req: NextRequest) {
  return SESSION_COOKIES.some((name) => req.cookies.has(name));
}

/**
 * Lightweight middleware — no Auth.js / Prisma on Edge (that broke Google sign-in).
 * Auth and subscription checks run in Node route handlers and server components.
 */
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/api/health" || path === "/api/stripe/webhook") {
    return NextResponse.next();
  }

  // Protect studio routes — require session cookie (full auth in server components)
  if (path.startsWith("/studio") && !hasSessionCookie(req)) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  // Clear broken session cookies when Auth.js sends user back with an error
  if (path === "/login" && req.nextUrl.searchParams.has("error")) {
    const res = NextResponse.next();
    for (const name of STALE_SESSION_COOKIES) {
      res.cookies.delete(name);
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/studio/:path*", "/api/health", "/api/stripe/webhook"],
};