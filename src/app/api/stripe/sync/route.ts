import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncSubscriptionForUser } from "@/lib/stripe-sync";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncSubscriptionForUser(session.user.id);
  return NextResponse.json({ ok: true, ...result });
}