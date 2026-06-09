import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { bypassesSubscription, isActivePlan } from "@/lib/subscription";
import { getWorkspaceForUser } from "@/lib/tenant";

export async function requireActiveSubscription(redirectTo = "/pricing?required=1") {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/studio");

  if (bypassesSubscription(session.user.role)) {
    return { session, workspace: await getWorkspaceForUser(session.user.id) };
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  if (!workspace || !isActivePlan(workspace.plan)) {
    redirect(redirectTo);
  }

  return { session, workspace };
}