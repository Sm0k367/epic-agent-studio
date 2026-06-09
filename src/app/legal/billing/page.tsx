import Link from "next/link";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { COMPANY } from "@/lib/company";

export default function BillingPolicyPage() {
  return (
    <LegalDocument title="Billing & Refunds Policy">
      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">1. Overview</h2>
        <p>
          {COMPANY.product} is a subscription-only service operated by {COMPANY.name}. Access requires an active
          paid plan. This policy describes pricing, billing cycles, cancellations, and refunds.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">2. Plans &amp; pricing</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#eeeef8]">Weekly:</strong> $9.99 USD per week, billed every week
          </li>
          <li>
            <strong className="text-[#eeeef8]">Monthly:</strong> $29.99 USD per month, billed every month
          </li>
          <li>
            <strong className="text-[#eeeef8]">Yearly:</strong> $299 USD per year, billed annually
          </li>
        </ul>
        <p>
          Prices are shown on our{" "}
          <Link href="/pricing" className="text-[#22d3ee] hover:underline">
            pricing page
          </Link>{" "}
          and at checkout. We may change prices for new subscriptions with notice; existing subscriptions are
          honored through the current billing period unless we notify you otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">3. Payment processing</h2>
        <p>
          All payments are processed securely by Stripe. By subscribing, you authorize {COMPANY.name} and Stripe
          to charge your payment method on a recurring basis until you cancel. You are responsible for keeping
          payment information current.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">4. Renewals</h2>
        <p>
          Subscriptions renew automatically at the end of each weekly, monthly, or yearly period. You will be
          charged unless you cancel before the renewal date. Manage or cancel anytime from{" "}
          <Link href="/os/billing" className="text-[#22d3ee] hover:underline">
            Billing
          </Link>{" "}
          via the Stripe customer portal.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">5. Cancellation</h2>
        <p>
          You may cancel at any time. Cancellation stops future charges. Access continues through the end of
          your current paid period, after which your workspace becomes inactive until you resubscribe. We do not
          provide prorated refunds for partial periods when you cancel mid-cycle, except where required by law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">6. Refunds</h2>
        <p>
          Subscriptions are generally non-refundable. We may issue a refund at our discretion for duplicate
          charges, verified billing errors, or extended service outages caused solely by us. Refund requests
          must be sent to{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>{" "}
          within 14 days of the charge with your account email and transaction details.
        </p>
        <p>
          Chargebacks filed without contacting us first may result in account suspension pending resolution.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">7. Failed payments</h2>
        <p>
          If a payment fails, Stripe may retry. Repeated failures may suspend your workspace until payment is
          resolved. You are responsible for any fees charged by your bank or card issuer.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">8. Taxes</h2>
        <p>
          Prices may exclude applicable sales, VAT, or similar taxes unless stated otherwise. You are responsible
          for any taxes associated with your purchase where required by law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">9. Contact</h2>
        <p>
          Billing questions:{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>{" "}
          ·{" "}
          <a href={COMPANY.x.url} className="text-[#22d3ee] hover:underline">
            {COMPANY.x.handle}
          </a>
        </p>
      </section>
    </LegalDocument>
  );
}