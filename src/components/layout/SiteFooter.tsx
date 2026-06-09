import Link from "next/link";
import { COMPANY } from "@/lib/company";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`border-t border-[#2a2a45] bg-[#0a0a14] text-[#7a7a9a] ${compact ? "py-6" : "py-10"}`}>
      <div className="mx-auto max-w-5xl px-6">
        <div className={`grid gap-8 ${compact ? "md:grid-cols-2" : "md:grid-cols-4"}`}>
          <div className={compact ? "" : "md:col-span-2"}>
            <p className="font-semibold text-[#eeeef8]">{COMPANY.name}</p>
            <p className="mt-2 text-sm">{COMPANY.product} — cloud AI operating system for builders.</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
                {COMPANY.email}
              </a>
              <a
                href={COMPANY.x.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#22d3ee] hover:underline"
              >
                {COMPANY.x.handle}
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#eeeef8]">Legal</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-[#22d3ee]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#22d3ee]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/billing" className="hover:text-[#22d3ee]">
                  Billing &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-[#22d3ee]">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#eeeef8]">Company</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-[#22d3ee]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#22d3ee]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-[#22d3ee]">
                  Legal hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-[#2a2a45] pt-6 text-center text-xs">
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. Proprietary — see{" "}
          <Link href="/terms" className="hover:text-[#22d3ee]">
            Terms
          </Link>
          .
          <span className="mt-1 block text-[#7a7a9a]">
            Engineered by{" "}
            <a
              href={COMPANY.engineeringUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22d3ee] hover:underline"
            >
              {COMPANY.engineering}
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}