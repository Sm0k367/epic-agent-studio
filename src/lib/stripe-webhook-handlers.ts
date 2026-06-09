import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import {
  hasActiveStripeSubscription,
  logStripeSecurity,
  planFromSubscription,
  resolveWorkspaceForStripe,
  setWorkspacePlanSecure,
  subscriptionGrantsAccess,
  subscriptionIdFromInvoice,
  suspendWorkspace,
} from "@/lib/stripe-security";
import { getWorkspaceMeta } from "@/lib/tenant";

async function workspaceFromSubscription(stripe: Stripe, sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  return resolveWorkspaceForStripe(stripe, sub.metadata?.workspaceId, customerId);
}

async function workspaceFromCustomerId(stripe: Stripe, customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return resolveWorkspaceForStripe(stripe, customer.metadata?.workspaceId, customerId);
}

export async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription") return;
  if (session.payment_status !== "paid") return;

  const workspaceId = session.metadata?.workspaceId;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const workspace = await resolveWorkspaceForStripe(stripe, workspaceId, customerId);
  if (!workspace) {
    await logStripeSecurity("stripe.webhook.rejected", {
      event: "checkout.session.completed",
      reason: "workspace_mismatch",
      workspaceId,
      customerId,
    });
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!subscriptionId) return;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  if (!subscriptionGrantsAccess(sub.status)) return;

  const plan = planFromSubscription(sub) ?? session.metadata?.plan ?? "monthly";
  await setWorkspacePlanSecure(workspace.id, plan, sub.id);

  const userId = session.metadata?.userId ?? session.client_reference_id;
  await prisma.auditLog.create({
    data: {
      actorId: userId ?? undefined,
      action: "billing.checkout_completed",
      target: workspace.id,
      meta: { plan, subscriptionId: sub.id, sessionId: session.id },
    },
  });
}

export async function handleSubscriptionChange(stripe: Stripe, sub: Stripe.Subscription) {
  const workspace = await workspaceFromSubscription(stripe, sub);
  if (!workspace) return;

  const plan = planFromSubscription(sub);
  if (!plan) {
    await suspendWorkspace(workspace.id, "unknown_price");
    return;
  }

  if (subscriptionGrantsAccess(sub.status)) {
    await setWorkspacePlanSecure(workspace.id, plan, sub.id);
    return;
  }

  await suspendWorkspace(workspace.id, `subscription_${sub.status}`);
}

export async function handleSubscriptionDeleted(stripe: Stripe, sub: Stripe.Subscription) {
  const workspace = await workspaceFromSubscription(stripe, sub);
  if (!workspace) return;
  await suspendWorkspace(workspace.id, "subscription_deleted");
}

export async function handleInvoicePaymentFailed(stripe: Stripe, invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const workspace = await workspaceFromSubscription(stripe, sub);
  if (!workspace) return;

  await suspendWorkspace(workspace.id, "payment_failed");
}

export async function handleDisputeCreated(stripe: Stripe, dispute: Stripe.Dispute) {
  const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
  if (!chargeId) return;

  const charge = await stripe.charges.retrieve(chargeId);
  const customerId = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
  if (!customerId) return;

  const workspace = await workspaceFromCustomerId(stripe, customerId);
  if (!workspace) return;

  await suspendWorkspace(workspace.id, `dispute_${dispute.id}`);

  const customer = await stripe.customers.retrieve(customerId);
  if (!customer.deleted) {
    await logStripeSecurity(
      "stripe.dispute",
      { disputeId: dispute.id, amount: dispute.amount, reason: dispute.reason },
      customer.metadata?.userId,
      workspace.id,
    );
  }
}

export async function handleEarlyFraudWarning(stripe: Stripe, warning: Stripe.Radar.EarlyFraudWarning) {
  const chargeId = typeof warning.charge === "string" ? warning.charge : warning.charge?.id;
  if (!chargeId) return;

  const charge = await stripe.charges.retrieve(chargeId);
  const customerId = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
  if (!customerId) return;

  const workspace = await workspaceFromCustomerId(stripe, customerId);
  if (!workspace) return;

  await suspendWorkspace(workspace.id, `fraud_warning_${warning.id}`);

  const customer = await stripe.customers.retrieve(customerId);
  if (!customer.deleted) {
    await logStripeSecurity(
      "stripe.fraud_warning",
      { warningId: warning.id, fraudType: warning.fraud_type },
      customer.metadata?.userId,
      workspace.id,
    );
  }
}

export async function handleDisputeClosed(stripe: Stripe, dispute: Stripe.Dispute) {
  if (dispute.status !== "won") return;

  const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
  if (!chargeId) return;

  const charge = await stripe.charges.retrieve(chargeId);
  const customerId = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
  if (!customerId) return;

  const workspace = await workspaceFromCustomerId(stripe, customerId);
  if (!workspace) return;

  const integrations = getWorkspaceMeta(workspace.meta);
  const subscriptionId = integrations.stripeSubscriptionId;

  if (!(await hasActiveStripeSubscription(stripe, subscriptionId))) return;

  const sub = await stripe.subscriptions.retrieve(subscriptionId!);
  const plan = planFromSubscription(sub);
  if (plan) await setWorkspacePlanSecure(workspace.id, plan, sub.id);
}