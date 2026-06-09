import { isPaidPlan } from "@/lib/stripe";

export function isActivePlan(plan: string | null | undefined) {
  return isPaidPlan(plan);
}

export function bypassesSubscription(role: string | undefined) {
  return role === "PLATFORM_ADMIN" || role === "ADMIN";
}