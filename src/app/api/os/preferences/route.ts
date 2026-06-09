import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requirePaidWorkspace } from "@/lib/api-subscription-guard";
import { getWorkspaceForUser } from "@/lib/tenant";

/** Legacy OS preferences — returns minimal stub for backward compatibility. */
export async function GET() {
  const session = await auth();
  const workspace = session?.user?.id ? await getWorkspaceForUser(session.user.id) : null;
  const blocked = requirePaidWorkspace(session, workspace?.plan);
  if (blocked) return blocked;
  return NextResponse.json({
    theme: "dark",
    dockFavorites: [],
    hiddenApps: [],
    pinnedApps: [],
    customApps: [],
    integrations: {},
    onboardingDone: true,
  });
}

export async function PATCH() {
  return NextResponse.json({ ok: true, message: "Preferences stored in workspace meta in Agent Studio" });
}