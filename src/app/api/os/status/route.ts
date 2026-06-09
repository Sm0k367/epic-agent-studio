import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requirePaidWorkspace } from "@/lib/api-subscription-guard";
import { getWorkspaceForUser } from "@/lib/tenant";

export async function GET() {
  const session = await auth();
  const workspace = session?.user?.id ? await getWorkspaceForUser(session.user.id) : null;
  const blocked = requirePaidWorkspace(session, workspace?.plan);
  if (blocked) return blocked;

  return NextResponse.json({
    platform: "epic-agent-studio",
    workspace: workspace
      ? { id: workspace.id, name: workspace.name, plan: workspace.plan }
      : null,
    studio: { modalities: ["text", "image", "audio", "video"] },
  });
}