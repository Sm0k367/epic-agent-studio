import { auth } from "@/auth";
import { bypassesSubscription, isActivePlan } from "@/lib/subscription";
import { getWorkspaceForUser } from "@/lib/tenant";
import { redirect } from "next/navigation";

/** Route signed-in users to Studio (paid/admin) or pricing (needs subscription). */
export async function redirectAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (bypassesSubscription(session.user.role)) {
    redirect("/studio");
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  if (workspace && isActivePlan(workspace.plan)) {
    redirect("/studio");
  }

  redirect("/pricing?required=1");
}