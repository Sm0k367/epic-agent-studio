import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getStripe, priceIdForPlan, siteUrl, PAID_PLANS } from "@/lib/stripe";
import {
  enforceCheckoutRateLimit,
  hasActiveStripeSubscription,
  logStripeSecurity,
} from "@/lib/stripe-security";
import { referralCodeFromCookieHeader } from "@/lib/referral";
import { getWorkspaceForUser, getWorkspaceMeta, updateWorkspaceMeta } from "@/lib/tenant";

const bodySchema = z.object({
  plan: z.enum(["weekly", "monthly", "yearly"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  if (!(await enforceCheckoutRateLimit(session.user.id))) {
    return NextResponse.json({ error: "Too many checkout attempts. Try again later." }, { status: 429 });
  }

  const { plan } = bodySchema.parse(await req.json());
  if (!PAID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: `Price not configured for ${plan}` }, { status: 503 });
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const integrations = getWorkspaceMeta(workspace.meta);
  const existingSubId = integrations.stripeSubscriptionId;
  if (await hasActiveStripeSubscription(stripe, existingSubId)) {
    return NextResponse.json(
      { error: "You already have an active subscription. Use Billing to manage it." },
      { status: 409 },
    );
  }

  let customerId = integrations.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
      metadata: {
        userId: session.user.id,
        workspaceId: workspace.id,
      },
    });
    customerId = customer.id;
    await updateWorkspaceMeta(workspace.id, { stripeCustomerId: customerId });
  } else {
    await stripe.customers.update(customerId, {
      email: session.user.email,
      metadata: {
        userId: session.user.id,
        workspaceId: workspace.id,
      },
    });
  }

  const base = siteUrl();
  const referral = referralCodeFromCookieHeader(req.headers.get("cookie"));
  const idempotencyKey = `checkout-${session.user.id}-${plan}-${Math.floor(Date.now() / 300_000)}`;

  const attribution = {
    userId: session.user.id,
    workspaceId: workspace.id,
    plan,
    ...(referral ? { referral } : {}),
  };

  const checkout = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/studio?welcome=1`,
      cancel_url: `${base}/pricing?canceled=1`,
      client_reference_id: session.user.id,
      allow_promotion_codes: false,
      billing_address_collection: "required",
      customer_update: { address: "auto", name: "auto" },
      payment_method_options: {
        card: { request_three_d_secure: "automatic" },
      },
      metadata: attribution,
      subscription_data: {
        metadata: attribution,
      },
    },
    { idempotencyKey },
  );

  await logStripeSecurity(
    "stripe.checkout",
    { plan, sessionId: checkout.id },
    session.user.id,
    workspace.id,
  );

  return NextResponse.json({ url: checkout.url });
}