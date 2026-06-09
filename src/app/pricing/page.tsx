import Link from "next/link";
import { auth } from "@/auth";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { ShareEpicOs } from "@/components/marketing/ShareEpicOs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PLANS, PAID_PLANS, stripeBillingReady } from "@/lib/stripe";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ required?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const billingReady = stripeBillingReady();

  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-16 text-[#eeeef8]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <Link href="/" className="text-sm text-[#7a7a9a] hover:text-[#22d3ee]">
            ← Epic OS
          </Link>
          <h1 className="mt-6 text-4xl font-bold">Subscribe to Epic OS</h1>
          <p className="mt-3 text-[#7a7a9a]">
            {params.required === "1"
              ? "An active subscription is required to use your workspace."
              : "No free tier — pick weekly, monthly, or yearly and start building."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PAID_PLANS.map((planId) => {
            const plan = PLANS[planId];
            const highlighted = "highlight" in plan && plan.highlight;

            return (
              <div
                key={planId}
                className={`rounded-2xl border bg-[#111122] p-8 text-left ${
                  highlighted
                    ? "border-[#a855f7] shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                    : "border-[#2a2a45]"
                }`}
              >
                {highlighted && (
                  <span className="mb-3 inline-block rounded-full bg-[#a855f7]/20 px-3 py-1 text-xs font-semibold text-[#a855f7]">
                    Most popular
                  </span>
                )}
                {"savings" in plan && plan.savings && (
                  <span className="mb-3 inline-block rounded-full bg-[#22d3ee]/10 px-3 py-1 text-xs font-semibold text-[#22d3ee]">
                    {plan.savings}
                  </span>
                )}
                <h2 className={`text-xl font-bold ${highlighted ? "text-[#a855f7]" : "text-[#22d3ee]"}`}>
                  {plan.name}
                </h2>
                <p className="mt-2">
                  <span className="text-3xl font-semibold">{plan.priceLabel}</span>
                  <span className="ml-1 text-sm text-[#7a7a9a]">{plan.cadence}</span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-[#7a7a9a]">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                {billingReady && session?.user ? (
                  <CheckoutButton
                    plan={planId}
                    label={`Subscribe ${plan.name}`}
                    className={
                      highlighted
                        ? "mt-6 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-6 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
                        : "mt-6 w-full rounded-xl border border-[#2a2a45] px-6 py-3 font-semibold transition hover:border-[#a855f7] disabled:opacity-60"
                    }
                  />
                ) : billingReady ? (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/pricing`)}`}
                    className="mt-6 block w-full rounded-xl border border-[#2a2a45] px-6 py-3 text-center font-semibold transition hover:border-[#a855f7]"
                  >
                    Sign in to subscribe
                  </Link>
                ) : (
                  <p className="mt-6 text-center text-sm text-[#7a7a9a]">Billing activating soon</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#7a7a9a]">Love Epic OS? Share your invite link.</p>
          <div className="mt-4 flex justify-center">
            <ShareEpicOs />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-[#7a7a9a]">
          Cancel anytime from your{" "}
          <Link href="/os/billing" className="text-[#22d3ee] hover:underline">
            billing portal
          </Link>
          . All plans include the full Epic OS experience.
        </p>
        <p className="mt-4 text-center text-xs text-[#7a7a9a]">
          By subscribing you agree to our{" "}
          <Link href="/terms" className="text-[#22d3ee] hover:underline">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/legal/billing" className="text-[#22d3ee] hover:underline">
            Billing &amp; Refunds
          </Link>
          , and{" "}
          <Link href="/privacy" className="text-[#22d3ee] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}