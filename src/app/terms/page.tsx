import Link from "next/link";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { COMPANY, siteBaseUrl } from "@/lib/company";

export default function TermsPage() {
  const site = siteBaseUrl();

  return (
    <LegalDocument title="Terms of Service">
      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of {COMPANY.product}, operated
          by {COMPANY.name} at{" "}
          <a href={site} className="text-[#22d3ee] hover:underline">
            {site}
          </a>
          . By creating an account, subscribing, or using the service, you agree to these Terms and our{" "}
          <Link href="/privacy" className="text-[#22d3ee] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">2. The service</h2>
        <p>
          {COMPANY.product} is a cloud-based operating environment providing workspaces, applications, deploy
          tools, and integrations. Features may change as we improve the product. We strive for high
          availability but do not guarantee uninterrupted access.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">3. Accounts</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>You must sign in with a valid Google account and provide accurate information.</li>
          <li>You are responsible for activity under your account and keeping credentials secure.</li>
          <li>One person per account unless we explicitly authorize team features.</li>
          <li>Notify us immediately at {COMPANY.email} if you suspect unauthorized access.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">4. Subscriptions &amp; payment</h2>
        <p>
          {COMPANY.product} is a paid subscription service. There is no free tier. Plans are billed weekly,
          monthly, or yearly through Stripe. By subscribing you authorize recurring charges until you cancel.
          See our{" "}
          <Link href="/legal/billing" className="text-[#22d3ee] hover:underline">
            Billing &amp; Refunds Policy
          </Link>{" "}
          for pricing, renewals, and refunds.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Violate any law or third-party rights</li>
          <li>Upload malware, spam, or abusive content</li>
          <li>Attempt to breach, scrape, or overload our systems</li>
          <li>Resell or sublicense access without written permission</li>
          <li>Use the service for illegal surveillance, harassment, or fraud</li>
          <li>Circumvent subscription or access controls</li>
        </ul>
        <p>We may suspend or terminate accounts that violate these rules.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">6. Your content</h2>
        <p>
          You retain ownership of content and configuration in your workspace. You grant us a limited license to
          host, process, and display that content solely to provide the service. You are responsible for ensuring
          you have rights to any data you store or deploy through {COMPANY.product}.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">7. Intellectual property</h2>
        <p>
          {COMPANY.name}, {COMPANY.product}, the Epic OS Platform, all source code, UI/UX, documentation,
          marketing media, and trademarks are owned exclusively by {COMPANY.name} ({COMPANY.copyright}).
          Subscription grants access to the hosted service only — not a license to our repository, source code,
          or branding.
        </p>
        <p>
          You may not copy, modify, distribute, sublicense, resell, white-label, scrape, mirror, or reverse
          engineer the platform or any part of it except where law expressly permits. Public visibility of our
          GitHub repository does not grant any license to use our code. Report infringement at{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">8. Third-party services</h2>
        <p>
          The platform integrates with third parties (Google, Stripe, cloud deploy targets, APIs). Your use of
          those services is subject to their terms. We are not responsible for third-party outages or policies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">9. Disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR MEET YOUR REQUIREMENTS.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">10. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {COMPANY.name.toUpperCase()} AND ITS AFFILIATES SHALL NOT BE
          LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
          DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT
          EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS BEFORE THE CLAIM.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">11. Termination</h2>
        <p>
          You may cancel your subscription at any time via the Stripe billing portal. We may suspend or
          terminate access for breach of these Terms, non-payment, or legal requirements. Upon termination, your
          right to use the service ends; provisions that should survive (payment obligations, liability limits,
          IP) will survive.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">12. Governing law</h2>
        <p>
          These Terms are governed by the laws of the United States and the State of Delaware, without regard to
          conflict-of-law principles, except where mandatory consumer protections in your jurisdiction apply.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">13. Contact</h2>
        <p>
          {COMPANY.name} ·{" "}
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