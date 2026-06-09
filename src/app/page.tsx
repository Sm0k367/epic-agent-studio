import { auth } from "@/auth";
import { redirectAuthenticatedUser } from "@/lib/auth-routing";
import Link from "next/link";
import { Sparkles, Image, Music, Video, Zap, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/company";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Text Generation",
    desc: "Cinematic creative direction powered by Groq LLMs — vivid, production-ready copy in seconds.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Image,
    title: "Image Generation",
    desc: "Pixio & Hugging Face backends turn prompts into stunning visuals — cyberpunk to photoreal.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Music,
    title: "Audio Generation",
    desc: "Synthwave, ambient, and custom soundscapes from a single prompt via Hugging Face models.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Video,
    title: "Video Generation",
    desc: "Cinematic AI video concepts and clips — Pixio video models ready when keys are set.",
    color: "from-rose-500 to-pink-600",
  },
];

const MODALITIES = ["Groq", "Pixio", "Hugging Face"];

export default async function HomePage() {
  const session = await auth();
  if (session?.user) await redirectAuthenticatedUser();

  return (
    <main className="min-h-screen bg-[#07070f] text-[#eeeef8] overflow-hidden">
      <div className="intro-aurora pointer-events-none fixed inset-0 opacity-50" />
      <div className="intro-grid pointer-events-none fixed inset-0 opacity-20" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-[#2a2a45]/60 bg-[#07070f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#ec4899]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">{COMPANY.product}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#7a7a9a]">by {COMPANY.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-[#7a7a9a] transition hover:text-[#c084fc]">
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-5 py-2 text-sm font-semibold shadow-[0_0_30px_rgba(168,85,247,0.3)] transition hover:brightness-110"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-16 text-center md:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 px-4 py-1.5">
          <Zap className="h-3 w-3 text-emerald-400" />
          <span className="font-mono text-xs uppercase tracking-[2px] text-emerald-400">
            Multimodal AI Studio · Live
          </span>
        </div>

        <h1 className="mb-6 bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#22d3ee] bg-clip-text text-5xl font-extrabold leading-none tracking-tighter text-transparent md:text-7xl">
          One prompt.
          <br />
          Every modality.
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-xl text-[#c4c4d4] md:text-2xl">
          {COMPANY.product} — {COMPANY.tagline} by {COMPANY.name}.
        </p>
        <p className="mx-auto mb-10 max-w-xl text-[#7a7a9a]">
          Generate text, images, audio, and video from a single creative prompt. Subscribe, sign in
          with Google, and open your private studio.
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {MODALITIES.map((m) => (
            <span
              key={m}
              className="rounded-full border border-[#2a2a45] px-4 py-1 font-mono text-xs uppercase tracking-widest text-[#7a7a9a]"
            >
              {m}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#a855f7] bg-[length:200%_100%] px-8 py-4 text-lg font-semibold text-white shadow-[0_0_50px_rgba(168,85,247,0.4)] transition hover:bg-[position:100%_0] hover:brightness-110"
          >
            Get started
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/studio"
            className="rounded-2xl border border-[#a855f7]/40 bg-[#111122]/80 px-8 py-4 text-lg font-semibold backdrop-blur transition hover:border-[#a855f7] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            Open Studio
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-t border-[#2a2a45]/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-sm uppercase tracking-[0.3em] text-[#22d3ee]">
            Capabilities
          </h2>
          <p className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Four modalities. One studio.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group rounded-3xl border border-[#2a2a45] bg-[#111122]/60 p-6 backdrop-blur transition hover:border-[#a855f7]/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-[#c084fc]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#7a7a9a]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-[#2a2a45]/60 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#22d3ee] bg-clip-text text-transparent">
              create?
            </span>
          </h2>
          <p className="mb-10 text-[#7a7a9a]">
            Weekly from $9.99. Sign in with Google, pick a plan, and start generating in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-8 py-3.5 font-semibold shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:brightness-110"
            >
              Sign in with Google
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-[#2a2a45] px-8 py-3.5 font-semibold transition hover:border-[#a855f7]"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2a2a45]/60 py-10 text-center text-xs text-[#7a7a9a]">
        <p>
          {COMPANY.product} · {COMPANY.copyright}
        </p>
        <p className="mt-2">
          <a href={COMPANY.x.url} className="text-[#22d3ee] hover:underline">
            {COMPANY.x.handle}
          </a>
          {" · "}
          <Link href="/terms" className="hover:text-[#eeeef8]">
            Terms
          </Link>
          {" · "}
          <Link href="/legal" className="hover:text-[#eeeef8]">
            Legal
          </Link>
        </p>
      </footer>
    </main>
  );
}