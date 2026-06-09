import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { bypassesSubscription, isActivePlan } from "@/lib/subscription";

export function requirePaidWorkspace(session: Session | null, plan: string | null | undefined) {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (bypassesSubscription(session.user.role)) return null;
  if (!isActivePlan(plan)) {
    return NextResponse.json({ error: "subscription_required" }, { status: 402 });
  }
  return null;
}