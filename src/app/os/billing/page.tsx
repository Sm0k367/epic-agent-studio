"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PAID_PLANS, PLANS, formatPlanLabel, isPaidPlan } from "@/lib/stripe";

export default function BillingPage() {
  const [plan, setPlan] = useState("inactive");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const justPaid = params.get("success") === "1";
    setSuccess(justPaid);

    async function load() {
      if (justPaid) {
        await fetch("/api/stripe/sync", { method: "POST" });
      }
      const res = await fetch("/api/os/status");
      const d = await res.json();
      const activePlan = d.plan ?? "inactive";
      setPlan(activePlan);
      if (justPaid && activePlan !== "inactive") {
        window.location.replace("/studio?welcome=1");
      }
    }
    load();
  }, []);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Billing portal unavailable");
    } finally {
      setLoading(false);
    }
  }

  const active = isPaidPlan(plan);

  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-10 text-[#eeeef8]">
      <div className="mx-auto max-w-3xl">
        <Link href={active ? "/studio" : "/pricing"} className="text-[#22d3ee] hover:underline">
          ← {active ? "Back to OS" : "View plans"}
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Billing</h1>
        <p className="mt-2 text-[#7a7a9a]">
          Current plan: <span className="text-[#22d3ee]">{formatPlanLabel(plan)}</span>
        </p>

        {success && (
          <p className="mt-4 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-3 text-sm text-[#22d3ee]">
            Payment received — your workspace is activating. Refresh if apps don&apos;t load yet.
          </p>
        )}

        {!active && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PAID_PLANS.map((planId) => {
              const p = PLANS[planId];
              return (
                <div key={planId} className="rounded-xl border border-[#2a2a45] bg-[#111122] p-6">
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="mt-1 text-lg">
                    {p.priceLabel}
                    <span className="text-sm text-[#7a7a9a]"> {p.cadence}</span>
                  </p>
                  <CheckoutButton
                    plan={planId}
                    label={`Subscribe ${p.name}`}
                    className="mt-4 w-full rounded-lg bg-[#a855f7] px-4 py-2 font-semibold hover:brightness-110"
                  />
                </div>
              );
            })}
          </div>
        )}

        {active && (
          <button
            type="button"
            onClick={openPortal}
            disabled={loading}
            className="mt-8 rounded-xl border border-[#2a2a45] px-6 py-3 font-semibold hover:border-[#a855f7] disabled:opacity-60"
          >
            {loading ? "Opening…" : "Manage subscription in Stripe"}
          </button>
        )}

        <Link href="/pricing" className="mt-6 inline-block text-sm text-[#7a7a9a] hover:text-white">
          Compare all plans →
        </Link>
        <p className="mt-4 text-xs text-[#7a7a9a]">
          <Link href="/legal/billing" className="hover:text-[#22d3ee]">
            Billing policy
          </Link>
          {" · "}
          <Link href="/contact" className="hover:text-[#22d3ee]">
            Contact support
          </Link>
        </p>
      </div>
      <SiteFooter compact />
    </main>
  );
}