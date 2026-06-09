import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requirePaidWorkspace } from "@/lib/api-subscription-guard";
import { getUserCatalog } from "@/lib/catalog";
import { getWorkspaceForUser } from "@/lib/tenant";

export async function GET() {
  const session = await auth();
  const workspace = session?.user?.id ? await getWorkspaceForUser(session.user.id) : null;
  const blocked = requirePaidWorkspace(session, workspace?.plan);
  if (blocked) return blocked;

  if (!workspace || !session?.user) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const catalog = await getUserCatalog(workspace.id);
  return NextResponse.json({
    ...catalog,
    workspace: { id: workspace.id, name: workspace.name, plan: workspace.plan },
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    },
  });
}