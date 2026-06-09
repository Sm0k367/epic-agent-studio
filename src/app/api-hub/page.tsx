import Link from "next/link";

const APIS = [
  { name: "CoinGecko", url: "https://api.coingecko.com/api/v3/ping", desc: "Crypto prices" },
  { name: "Open-Meteo", url: "https://api.open-meteo.com/v1/forecast?latitude=40.7&longitude=-74&current_weather=true", desc: "Weather" },
  { name: "GitHub", url: "https://api.github.com/zen", desc: "Dev zen" },
  { name: "Cat Facts", url: "https://catfact.ninja/fact", desc: "Random facts" },
  { name: "Public APIs", url: "https://github.com/public-apis/public-apis", desc: "Full catalog" },
];

export default function ApiHubPage() {
  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-10 text-[#eeeef8]">
      <div className="mx-auto max-w-4xl">
        <Link href="/studio" className="text-[#22d3ee] hover:underline">
          ← Back to OS
        </Link>
        <h1 className="mt-4 text-3xl font-bold">API Gold Mine</h1>
        <p className="mt-2 text-[#7a7a9a]">Free public APIs wired into your Epic OS cloud shell.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {APIS.map((api) => (
            <a
              key={api.name}
              href={api.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#2a2a45] bg-[#111122] p-5 transition hover:border-[#a855f7]"
            >
              <h2 className="font-semibold text-[#22d3ee]">{api.name}</h2>
              <p className="mt-1 text-sm text-[#7a7a9a]">{api.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}