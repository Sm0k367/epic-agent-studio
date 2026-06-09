import Link from "next/link";
import { ReactNode } from "react";
import { COMPANY } from "@/lib/company";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <main className="min-h-screen bg-[#07070f] text-[#eeeef8]">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link href="/" className="text-sm text-[#7a7a9a] hover:text-[#22d3ee]">
            ← {COMPANY.product}
          </Link>
          <h1 className="mt-6 text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-[#7a7a9a]">
            {COMPANY.name} · Effective {COMPANY.effectiveDate}
          </p>
          <article className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-[#b8b8d0]">
            {children}
          </article>
          <p className="mt-12 text-sm text-[#7a7a9a]">
            Questions?{" "}
            <a href={COMPANY.emailHref} className="text-[#22d3ee] hover:underline">
              {COMPANY.email}
            </a>{" "}
            ·{" "}
            <a href={COMPANY.x.url} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] hover:underline">
              {COMPANY.x.handle}
            </a>
          </p>
        </div>
      </main>
      <SiteFooter compact />
    </>
  );
}