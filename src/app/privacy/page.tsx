import { LegalDocument } from "@/components/layout/LegalDocument";
import { COMPANY, siteBaseUrl } from "@/lib/company";

export default function PrivacyPage() {
  const site = siteBaseUrl();

  return (
    <LegalDocument title="Privacy Policy">
      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">1. Who we are</h2>
        <p>
          {COMPANY.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates {COMPANY.product}, a
          subscription cloud platform at{" "}
          <a href={site} className="text-[#22d3ee] hover:underline">
            {site}
          </a>
          . This Privacy Policy explains how we collect, use, and protect your information when you use our
          service.
        </p>
        <p>
          Contact:{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>{" "}
          ·{" "}
          <a href={COMPANY.x.url} className="text-[#22d3ee] hover:underline">
            {COMPANY.x.handle}
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">2. Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#eeeef8]">Account data:</strong> When you sign in with Google, we receive
            your name, email address, and profile image as provided by Google OAuth.
          </li>
          <li>
            <strong className="text-[#eeeef8]">Workspace data:</strong> App preferences, dock layout, hidden
            apps, custom apps, and settings you configure in your private workspace.
          </li>
          <li>
            <strong className="text-[#eeeef8]">Billing data:</strong> Subscription status and Stripe customer
            identifiers. Payment card details are processed by Stripe — we do not store full card numbers on
            our servers.
          </li>
          <li>
            <strong className="text-[#eeeef8]">Technical data:</strong> Session cookies, authentication tokens,
            IP address, browser type, and usage logs needed to operate and secure the platform.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">3. How we use your information</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and personalize your Epic OS workspace</li>
          <li>Process subscriptions and manage billing through Stripe</li>
          <li>Authenticate you and prevent fraud or abuse</li>
          <li>Respond to support requests and legal inquiries</li>
          <li>Improve reliability, security, and product features</li>
          <li>Comply with applicable law and enforce our Terms of Service</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">4. Third-party services</h2>
        <p>We use trusted processors to run {COMPANY.product}:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-[#eeeef8]">Google</strong> — OAuth sign-in (subject to Google&apos;s privacy
            policy)
          </li>
          <li>
            <strong className="text-[#eeeef8]">Stripe</strong> — payments and subscription management
          </li>
          <li>
            <strong className="text-[#eeeef8]">Hosting &amp; database providers</strong> — secure cloud
            infrastructure (e.g., Railway, Supabase/PostgreSQL)
          </li>
        </ul>
        <p>These providers process data only as needed to deliver the service and under their own privacy terms.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">5. Data retention</h2>
        <p>
          We retain account and workspace data while your subscription is active. If you cancel, we may retain
          certain records for billing, tax, fraud prevention, and legal compliance for a reasonable period,
          then delete or anonymize data where no longer required.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">6. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export your personal
          data, and to object to or restrict certain processing. To exercise these rights, email{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>{" "}
          with <strong className="text-[#eeeef8]">Privacy Request</strong> in the subject line. We will respond
          within a reasonable timeframe.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">7. Security</h2>
        <p>
          We use industry-standard measures including encrypted connections (HTTPS), environment-isolated
          secrets, per-user workspace isolation, and access controls. No method of transmission over the
          internet is 100% secure; we work continuously to protect your data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">8. Children</h2>
        <p>
          {COMPANY.product} is not directed to children under 13 (or 16 in the EEA). We do not knowingly
          collect personal information from children. Contact us if you believe a child has provided us data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">9. International users</h2>
        <p>
          Your information may be processed in the United States and other countries where our service providers
          operate. By using {COMPANY.product}, you consent to transfer and processing in those locations subject
          to applicable safeguards.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">10. Changes</h2>
        <p>
          We may update this policy. Material changes will be posted on this page with an updated effective
          date. Continued use after changes constitutes acceptance.
        </p>
      </section>
    </LegalDocument>
  );
}