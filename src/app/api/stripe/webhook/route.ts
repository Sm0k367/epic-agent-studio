import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { claimWebhookEvent } from "@/lib/stripe-security";
import {
  handleCheckoutCompleted,
  handleDisputeClosed,
  handleDisputeCreated,
  handleEarlyFraudWarning,
  handleInvoicePaymentFailed,
  handleSubscriptionChange,
  handleSubscriptionDeleted,
} from "@/lib/stripe-webhook-handlers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const claimed = await claimWebhookEvent(event.id, event.type);
  if (!claimed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.created":
        await handleSubscriptionChange(stripe, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(stripe, event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(stripe, event.data.object as Stripe.Invoice);
        break;
      case "charge.dispute.created":
        await handleDisputeCreated(stripe, event.data.object as Stripe.Dispute);
        break;
      case "charge.dispute.closed":
        await handleDisputeClosed(stripe, event.data.object as Stripe.Dispute);
        break;
      case "radar.early_fraud_warning.created":
        await handleEarlyFraudWarning(stripe, event.data.object as Stripe.Radar.EarlyFraudWarning);
        break;
      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}