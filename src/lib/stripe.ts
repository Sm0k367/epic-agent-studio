import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

export const PLANS = {
  weekly: {
    id: "weekly",
    name: "Weekly",
    priceLabel: "$9.99",
    cadence: "per week",
    priceEnv: "STRIPE_PRICE_WEEKLY",
    features: [
      "Full Epic Agent Studio access",
      "Text, image, audio & video generations",
      "Agent templates library",
      "Generation history (last 50)",
    ],
    highlight: false,
  },
  monthly: {
    id: "monthly",
    name: "Monthly",
    priceLabel: "$29.99",
    cadence: "per month",
    priceEnv: "STRIPE_PRICE_MONTHLY",
    features: [
      "Everything in Weekly",
      "Unlimited generation history",
      "Priority model routing",
      "Billing portal access",
    ],
    highlight: true,
  },
  yearly: {
    id: "yearly",
    name: "Yearly",
    priceLabel: "$299",
    cadence: "per year",
    savings: "Save $60 vs monthly",
    priceEnv: "STRIPE_PRICE_YEARLY",
    features: [
      "Everything in Monthly",
      "Lowest effective rate",
      "Lock in your studio workspace",
      "Annual invoice in Stripe",
    ],
    highlight: false,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export const PAID_PLANS: PlanId[] = ["weekly", "monthly", "yearly"];

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
}

export function priceIdForPlan(plan: PlanId) {
  return process.env[PLANS[plan].priceEnv];
}

export function planFromPriceId(priceId: string | undefined | null): PlanId | "inactive" {
  if (!priceId) return "inactive";
  for (const plan of PAID_PLANS) {
    if (priceId === process.env[PLANS[plan].priceEnv]) return plan;
  }
  return "inactive";
}

export function stripeBillingReady() {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONTHLY);
}

export function isPaidPlan(plan: string | null | undefined) {
  if (!plan) return false;
  if (PAID_PLANS.includes(plan as PlanId)) return true;
  return plan === "desk" || plan === "pro";
}

export function formatPlanLabel(plan: string) {
  if (plan === "inactive") return "No subscription";
  if (plan === "desk") return "Desk (legacy)";
  if (plan === "pro") return "Pro (legacy)";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}