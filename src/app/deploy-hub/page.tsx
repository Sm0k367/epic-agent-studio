import Link from "next/link";

const PROVIDERS = [
  { name: "Vercel", url: "https://vercel.com/new", icon: "▲" },
  { name: "Railway", url: "https://railway.com/new", icon: "🚂" },
  { name: "Supabase", url: "https://supabase.com/dashboard", icon: "⚡" },
  { name: "Cloudflare", url: "https://dash.cloudflare.com/", icon: "☁️" },
  { name: "Netlify", url: "https://app.netlify.com/start", icon: "◆" },
  { name: "DigitalOcean", url: "https://cloud.digitalocean.com/apps/new", icon: "🌊" },
  { name: "Clerk", url: "https://dashboard.clerk.com/", icon: "🔐" },
];

export default function DeployHubPage() {
  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-10 text-[#eeeef8]">
      <div className="mx-auto max-w-4xl">
        <Link href="/studio" className="text-[#22d3ee] hover:underline">
          ← Back to OS
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Deploy Hub</h1>
        <p className="mt-2 text-[#7a7a9a]">Pick your cloud — hosting, database, and auth.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-[#2a2a45] bg-[#111122] p-5 transition hover:border-[#a855f7]"
            >
              <span className="text-3xl">{p.icon}</span>
              <span className="font-semibold">{p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}