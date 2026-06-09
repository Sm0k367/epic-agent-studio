import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import {
  planFromSubscription,
  setWorkspacePlanSecure,
  subscriptionGrantsAccess,
} from "@/lib/stripe-security";
import { getWorkspaceForUser, getWorkspaceMeta } from "@/lib/tenant";

export async function syncSubscriptionForUser(userId: string) {
  const stripe = getStripe();
  if (!stripe) return { synced: false, plan: "inactive" as string };

  const workspace = await getWorkspaceForUser(userId);
  if (!workspace) return { synced: false, plan: "inactive" };

  const integrations = getWorkspaceMeta(workspace.meta);
  const customerId = integrations.stripeCustomerId;
  if (!customerId) return { synced: false, plan: workspace.plan };

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 5,
  });

  const active = subs.data.find((s) => subscriptionGrantsAccess(s.status));
  if (!active) return { synced: false, plan: workspace.plan };

  const plan = planFromSubscription(active);
  if (!plan) return { synced: false, plan: workspace.plan };

  await setWorkspacePlanSecure(workspace.id, plan, active.id);

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "billing.plan_activated",
      target: workspace.id,
      meta: { plan, subscriptionId: active.id, source: "sync" },
    },
  });

  return { synced: true, plan };
}