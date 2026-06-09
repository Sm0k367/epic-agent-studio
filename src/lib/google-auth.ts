export function googleAuthReady() {
  const id = process.env.GOOGLE_CLIENT_ID?.trim();
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return !!(id && secret && id.endsWith(".apps.googleusercontent.com"));
}

export function googleOAuthRedirectUri() {
  const base = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/auth/callback/google`;
}