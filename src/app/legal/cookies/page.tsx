import Link from "next/link";
import { LegalDocument } from "@/components/layout/LegalDocument";
import { COMPANY } from "@/lib/company";

export default function CookiePolicyPage() {
  return (
    <LegalDocument title="Cookie Policy">
      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">1. What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. We use cookies and
          similar technologies (local storage, session tokens) to operate {COMPANY.product}, keep you signed in,
          and protect the platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">2. Cookies we use</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-[#eeeef8]">Essential (required)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Authentication session cookies (Auth.js / NextAuth)</li>
              <li>Security and CSRF protection tokens</li>
              <li>Load-balancing or routing cookies from our host</li>
            </ul>
            <p className="mt-2">These are necessary for sign-in and core functionality. The service cannot work without them.</p>
          </div>
          <div>
            <p className="font-medium text-[#eeeef8]">Payment (required when subscribing)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Stripe may set cookies during checkout and billing portal sessions</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[#eeeef8]">Third-party sign-in</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Google OAuth may set cookies when you authenticate with Google</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">3. Analytics</h2>
        <p>
          We do not currently use third-party advertising or cross-site tracking cookies. If we add analytics in
          the future, we will update this policy and provide appropriate notice or consent where required.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">4. Managing cookies</h2>
        <p>
          You can control cookies through your browser settings. Blocking essential cookies may prevent you from
          signing in or using {COMPANY.product}. To sign out and clear your session, use Sign out in the app or
          clear site data for our domain in your browser.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#eeeef8]">5. More information</h2>
        <p>
          See our{" "}
          <Link href="/privacy" className="text-[#22d3ee] hover:underline">
            Privacy Policy
          </Link>{" "}
          for how we handle personal data. Questions:{" "}
          <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
            {COMPANY.email}
          </a>
        </p>
      </section>
    </LegalDocument>
  );
}