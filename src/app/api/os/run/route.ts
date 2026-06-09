import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requirePaidWorkspace } from "@/lib/api-subscription-guard";
import { executeCloudApp } from "@/lib/actions";
import { getUserCatalog } from "@/lib/catalog";
import { getWorkspaceForUser } from "@/lib/tenant";

export async function POST(req: Request) {
  const session = await auth();
  const { id } = (await req.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing app id" }, { status: 400 });
  }

  const workspace = session?.user?.id ? await getWorkspaceForUser(session.user.id) : null;
  const blocked = requirePaidWorkspace(session, workspace?.plan);
  if (blocked) return blocked;

  if (!workspace) {
    return NextResponse.json({ ok: false, message: "Workspace not found" }, { status: 404 });
  }

  const catalog = await getUserCatalog(workspace.id);
  const app = catalog.apps.find((a) => a.id === id);
  if (!app) {
    return NextResponse.json({ ok: false, message: `Unknown app: ${id}` }, { status: 404 });
  }

  const result = executeCloudApp(app);
  return NextResponse.json(result);
}