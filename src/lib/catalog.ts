import defaultCatalog from "@/data/default-catalog.json";
import type { AppRuntime } from "@/lib/actions";

export type CatalogApp = {
  id: string;
  name: string;
  icon: string;
  category: string;
  runtime: AppRuntime;
  target: string;
  desc: string;
  enabled: boolean;
  sortOrder: number;
};

const CLOUD_ACTION_URLS: Record<string, string> = {
  deploy: "https://vercel.com/new",
  "deploy.hub": "/deploy-hub",
  "session.continue": "/studio",
  "os.shell": "/studio",
  "sys.first_run": "/studio",
  "widgets.refresh": "/api-hub",
  validate: "/api/health",
  "sys.health": "/api/health",
};

type RawApp = {
  id: string;
  name: string;
  icon: string;
  category: string;
  action?: string;
  url?: string;
  desc?: string;
  enabled?: boolean;
};

function sanitizeRawApp(app: RawApp, siteUrl: string): CatalogApp {
  let runtime: AppRuntime = "DESKTOP_ONLY";
  let target = app.url ?? "#";

  if (app.url) {
    runtime = "CLOUD_URL";
    target = app.url.replace("{{SITE_URL}}", siteUrl);
  } else if (app.action) {
    runtime = "CLOUD_ACTION";
    target = CLOUD_ACTION_URLS[app.action] ?? `/api/os/run?action=${app.action}`;
  }

  return {
    id: app.id,
    name: app.name,
    icon: app.icon,
    category: app.category,
    runtime,
    target,
    desc: app.desc ?? "",
    enabled: app.enabled !== false,
    sortOrder: 0,
  };
}

export function buildDefaultCatalog(siteUrl: string): CatalogApp[] {
  return (defaultCatalog.apps as RawApp[]).map((app, i) => ({
    ...sanitizeRawApp(app, siteUrl),
    sortOrder: i,
  }));
}

export async function getUserCatalog(workspaceId: string) {
  void workspaceId;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const apps = buildDefaultCatalog(siteUrl).filter((a) => a.enabled);
  return {
    apps,
    dockFavorites: defaultCatalog.dock_favorites as string[],
    categories: [...new Set(apps.map((a) => a.category))],
    onboardingDone: true,
  };
}