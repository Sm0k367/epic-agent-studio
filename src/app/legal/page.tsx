import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { SiteFooter } from "@/components/layout/SiteFooter";

const POLICIES = [
  { href: "/terms", title: "Terms of Service", desc: "Rules for using Epic OS, accounts, subscriptions, and intellectual property." },
  {
    href: "https://github.com/Sm0k367/epic-os-platform/blob/main/LICENSE",
    title: "Source Code License",
    desc: "Proprietary — Epic Tech AI. No unauthorized copy, fork, or redistribution.",
  },
  { href: "/privacy", title: "Privacy Policy", desc: "How we collect, use, and protect your data." },
  { href: "/legal/billing", title: "Billing & Refunds", desc: "Pricing, renewals, cancellations, and refund policy." },
  { href: "/legal/cookies", title: "Cookie Policy", desc: "Cookies and similar technologies we use." },
];

export default function LegalHubPage() {
  return (
    <>
      <main className="min-h-screen bg-[#07070f] px-6 py-16 text-[#eeeef8]">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-[#7a7a9a] hover:text-[#22d3ee]">
            ← Epic OS
          </Link>
          <h1 className="mt-6 text-4xl font-bold">Legal</h1>
          <p className="mt-3 text-[#7a7a9a]">
            {COMPANY.name} operates {COMPANY.product} as a legitimate subscription business. Review our
            policies below.
          </p>

          <div className="mt-10 space-y-4">
            {POLICIES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block rounded-2xl border border-[#2a2a45] bg-[#111122] p-6 transition hover:border-[#a855f7]"
              >
                <h2 className="font-semibold text-[#22d3ee]">{p.title}</h2>
                <p className="mt-2 text-sm text-[#7a7a9a]">{p.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#2a2a45] bg-[#111122]/50 p-6 text-sm text-[#7a7a9a]">
            <p className="font-medium text-[#eeeef8]">Contact {COMPANY.name}</p>
            <p className="mt-2">
              <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
                {COMPANY.email}
              </a>
              {" · "}
              <a href={COMPANY.x.url} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
                {COMPANY.x.handle}
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}