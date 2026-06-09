import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStripe, siteUrl } from "@/lib/stripe";
import { logStripeSecurity } from "@/lib/stripe-security";
import { getWorkspaceForUser, getWorkspaceMeta } from "@/lib/tenant";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const portalAttempts = await prisma.auditLog.count({
    where: {
      actorId: session.user.id,
      action: "stripe.portal",
      createdAt: { gte: windowStart },
    },
  });
  if (portalAttempts >= 10) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  const integrations = getWorkspaceMeta(workspace?.meta);
  const customerId = integrations.stripeCustomerId;

  if (!customerId) {
    return NextResponse.json({ error: "No billing account yet — subscribe first" }, { status: 400 });
  }

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted || customer.metadata?.workspaceId !== workspace?.id) {
    return NextResponse.json({ error: "Billing account mismatch" }, { status: 403 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl()}/pricing`,
  });

  await logStripeSecurity("stripe.portal", { customerId }, session.user.id, workspace?.id);

  return NextResponse.json({ url: portal.url });
}