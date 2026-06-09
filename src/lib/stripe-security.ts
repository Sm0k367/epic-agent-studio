import type { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { PAID_PLANS, planFromPriceId } from "@/lib/stripe";
import { getWorkspaceMeta, updateWorkspaceMeta } from "@/lib/tenant";

/** Subscription states that grant platform access. */
export const GRANT_ACCESS_STATUSES = new Set<Stripe.Subscription.Status>(["active", "trialing"]);

export function subscriptionGrantsAccess(status: Stripe.Subscription.Status) {
  return GRANT_ACCESS_STATUSES.has(status);
}

export function isKnownPriceId(priceId: string | undefined | null) {
  if (!priceId) return false;
  return planFromPriceId(priceId) !== "inactive";
}

export async function claimWebhookEvent(eventId: string, eventType: string) {
  try {
    await prisma.stripeWebhookEvent.create({
      data: { id: eventId, type: eventType },
    });
    return true;
  } catch {
    return false;
  }
}

export async function resolveWorkspaceForStripe(
  stripe: Stripe,
  workspaceId: string | undefined | null,
  customerId: string | undefined | null,
) {
  if (!workspaceId) return null;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) return null;

  if (!customerId) return workspace;

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;

  const linkedWorkspace = customer.metadata?.workspaceId;
  if (linkedWorkspace && linkedWorkspace !== workspaceId) return null;

  return workspace;
}

export async function enforceCheckoutRateLimit(userId: string) {
  const windowStart = new Date(Date.now() - 60 * 60 * 1000);
  const attempts = await prisma.auditLog.count({
    where: {
      actorId: userId,
      action: "stripe.checkout",
      createdAt: { gte: windowStart },
    },
  });
  return attempts < 8;
}

export async function logStripeSecurity(
  action: string,
  meta: Prisma.InputJsonValue,
  actorId?: string | null,
  target?: string | null,
) {
  await prisma.auditLog.create({
    data: {
      actorId: actorId ?? undefined,
      action,
      target: target ?? undefined,
      meta,
    },
  });
}

export async function suspendWorkspace(workspaceId: string, reason: string) {
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { plan: "inactive" },
  });
  await logStripeSecurity("stripe.suspend", { reason }, null, workspaceId);
}

export async function setWorkspacePlanSecure(
  workspaceId: string,
  plan: string,
  subscriptionId?: string,
) {
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { plan },
  });

  if (subscriptionId) {
    await updateWorkspaceMeta(workspaceId, { stripeSubscriptionId: subscriptionId });
  }
}

export function planFromSubscription(sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price?.id;
  if (!isKnownPriceId(priceId)) return null;
  const fromMeta = sub.metadata?.plan;
  if (fromMeta && PAID_PLANS.includes(fromMeta as (typeof PAID_PLANS)[number])) {
    return fromMeta;
  }
  return planFromPriceId(priceId);
}

export function subscriptionIdFromInvoice(invoice: Stripe.Invoice) {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

export async function hasActiveStripeSubscription(
  stripe: Stripe,
  subscriptionId: string | undefined,
) {
  if (!subscriptionId) return false;
  try {
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    return subscriptionGrantsAccess(sub.status);
  } catch {
    return false;
  }
}

export function stripeMetaFromWorkspace(meta: unknown) {
  return getWorkspaceMeta(meta);
}