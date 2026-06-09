"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { COMPANY, PUBLIC_URL } from "@/lib/company";
import { captureReferralFromSearch } from "@/lib/referral";
import { ShareEpicOs } from "@/components/marketing/ShareEpicOs";

const STATS = [
  ["88+", "Apps & tools"],
  ["3", "Billing tiers"],
  ["1", "Your workspace"],
];

const PILLARS = [
  {
    title: "Your workspace",
    desc: "Every subscriber gets an isolated OS — dock, apps, and preferences are yours alone.",
    icon: "🖥️",
  },
  {
    title: "Deploy anywhere",
    desc: "Vercel, Railway, Supabase, Cloudflare — ship from your shell in one click.",
    icon: "🚀",
  },
  {
    title: "Built for builders",
    desc: "AI agents, dev tools, and media apps — curated for creators who ship daily.",
    icon: "⚡",
  },
];

const STEPS = [
  { n: "1", title: "Sign in with Google", desc: "One tap — no passwords to remember." },
  { n: "2", title: "Pick your plan", desc: "Weekly $9.99 · Monthly $29.99 · Yearly $299." },
  { n: "3", title: "Open your OS", desc: "Customize your dock and start deploying." },
];

export function HomeLanding() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureReferralFromSearch(searchParams);
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#07070f] text-[#eeeef8]">
      <div className="intro-aurora pointer-events-none fixed inset-0 opacity-40" />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#22d3ee]">{COMPANY.name}</p>
        <h1 className="mb-6 bg-gradient-to-br from-[#a855f7] via-[#c084fc] to-[#22d3ee] bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl">
          Epic OS
        </h1>
        <p className="mx-auto mb-4 max-w-2xl text-xl text-[#eeeef8] md:text-2xl">
          Your personal AI operating system in the cloud.
        </p>
        <p className="mx-auto mb-10 max-w-xl text-[#7a7a9a]">
          Subscribe, sign in, and get a workspace with 88 apps, deploy tools, and a dock tailored
          to how you build.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-8 py-3.5 font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:brightness-110"
          >
            Sign in with Google
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-[#2a2a45] bg-[#111122]/80 px-8 py-3.5 font-semibold backdrop-blur transition hover:border-[#a855f7]"
          >
            See pricing
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {STATS.map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-[#22d3ee]">{val}</p>
              <p className="text-xs uppercase tracking-wider text-[#7a7a9a]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <ShareEpicOs />
        </div>
      </div>

      <section className="relative border-y border-[#2a2a45] bg-[#0a0a14]/60 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold">How customers use Epic OS</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-[#2a2a45] bg-[#111122] p-6 text-left"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#a855f7]/20 text-sm font-bold text-[#a855f7]">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-[#22d3ee]">{s.title}</h3>
                <p className="mt-2 text-sm text-[#7a7a9a]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto grid max-w-5xl gap-4 px-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[#2a2a45] bg-[#111122] p-6 text-left transition hover:border-[#a855f7]/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]"
            >
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mb-2 mt-3 font-semibold text-[#22d3ee]">{p.title}</h3>
              <p className="text-sm text-[#7a7a9a]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2a45] bg-gradient-to-b from-[#111122] to-[#07070f] py-16 text-center">
        <h2 className="text-2xl font-bold">Ready to open your OS?</h2>
        <p className="mt-3 text-[#7a7a9a]">From $9.99/week — cancel anytime from billing.</p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-10 py-3.5 font-semibold text-white transition hover:brightness-110"
        >
          Get started
        </Link>
        <p className="mt-6 text-xs text-[#7a7a9a]">
          Share:{" "}
          <span className="text-[#22d3ee]">{PUBLIC_URL}</span>
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}