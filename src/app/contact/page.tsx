import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen bg-[#07070f] px-6 py-16 text-[#eeeef8]">
        <div className="mx-auto max-w-2xl text-center">
          <Link href="/" className="text-sm text-[#7a7a9a] hover:text-[#22d3ee]">
            ← Epic OS
          </Link>
          <h1 className="mt-6 text-4xl font-bold">Contact {COMPANY.name}</h1>
          <p className="mt-4 text-[#7a7a9a]">
            Support, billing questions, partnerships, or press — we&apos;re here.
          </p>

          <div className="mt-12 space-y-4 text-left">
            <a
              href={COMPANY.emailHref}
              className="block rounded-2xl border border-[#2a2a45] bg-[#111122] p-6 transition hover:border-[#a855f7]"
            >
              <p className="text-xs uppercase tracking-wider text-[#7a7a9a]">Email</p>
              <p className="mt-2 text-lg font-semibold text-[#22d3ee]">{COMPANY.email}</p>
              <p className="mt-2 text-sm text-[#7a7a9a]">Best for account, billing, and privacy requests.</p>
            </a>

            <a
              href={COMPANY.x.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-[#2a2a45] bg-[#111122] p-6 transition hover:border-[#a855f7]"
            >
              <p className="text-xs uppercase tracking-wider text-[#7a7a9a]">X (Twitter)</p>
              <p className="mt-2 text-lg font-semibold text-[#22d3ee]">{COMPANY.x.handle}</p>
              <p className="mt-2 text-sm text-[#7a7a9a]">Updates, announcements, and public support.</p>
            </a>
          </div>

          <div className="mt-10 rounded-xl border border-[#2a2a45] bg-[#111122]/50 p-6 text-sm text-[#7a7a9a]">
            <p>
              For data privacy requests (access, correction, deletion), email{" "}
              <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
                {COMPANY.email}
              </a>{" "}
              with the subject line <strong className="text-[#eeeef8]">Privacy Request</strong>. See our{" "}
              <Link href="/privacy" className="text-[#22d3ee] hover:underline">
                Privacy Policy
              </Link>{" "}
              for details.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}