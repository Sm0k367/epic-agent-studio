/**
 * Railway production must use private Postgres (no egress fees).
 * Safe to call on every container start — exits only if a public proxy URL is detected.
 */
export function assertPrivateDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "";
  if (!url || !process.env.RAILWAY_ENVIRONMENT) return;

  const publicMarkers = ["proxy.rlwy.net", "rlwy.net:", "yamato.railway.app"];
  const isPrivate = url.includes(".railway.internal");

  if (!isPrivate || publicMarkers.some((m) => url.includes(m))) {
    console.error(
      "\n[epic-os] DATABASE_URL must use Railway private networking " +
        "(e.g. postgres.railway.internal).\n" +
        "Do NOT set DATABASE_PUBLIC_URL on the epicos service — that uses " +
        "RAILWAY_TCP_PROXY_DOMAIN and incurs egress fees.\n" +
        "On epicos set: DATABASE_URL=${{Postgres.DATABASE_URL}}\n",
    );
    process.exit(1);
  }

  console.log("[epic-os] DB: private Railway network (no egress fees)");
}