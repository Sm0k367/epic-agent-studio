"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<{
    dockFavorites?: string[];
    hiddenApps?: string[];
    theme?: string;
  }>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/os/preferences")
      .then((r) => r.json())
      .then(setPrefs);
  }, []);

  async function save() {
    await fetch("/api/os/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...prefs, onboardingDone: true }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-10 text-[#eeeef8]">
      <div className="mx-auto max-w-2xl">
        <Link href="/studio" className="text-[#22d3ee] hover:underline">
          ← Back to OS
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Workspace Settings</h1>
        <p className="mt-2 text-sm text-[#7a7a9a]">
          Customize your dock and visibility. Desktop-only apps need the Epic OS Desktop agent.
        </p>

        <section className="mt-8 rounded-xl border border-[#2a2a45] bg-[#111122] p-6">
          <h2 className="font-semibold text-[#22d3ee]">Epic OS Desktop</h2>
          <p className="mt-2 text-sm text-[#7a7a9a]">
            Install the desktop shell for local folders, media pipelines, and Windows integrations.
          </p>
          <a
            href="https://github.com/Sm0k367/epic-os-platform/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-[#a855f7] px-4 py-2 text-sm font-semibold"
          >
            Get Desktop Agent
          </a>
        </section>

        <section className="mt-6 rounded-xl border border-[#2a2a45] bg-[#111122] p-6">
          <h2 className="font-semibold">Dock favorites (comma-separated app ids)</h2>
          <textarea
            className="mt-3 w-full rounded-lg border border-[#2a2a45] bg-[#1a1a2e] p-3 text-sm"
            rows={3}
            value={(prefs.dockFavorites ?? []).join(", ")}
            onChange={(e) =>
              setPrefs({
                ...prefs,
                dockFavorites: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </section>

        <button
          type="button"
          onClick={save}
          className="mt-6 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-6 py-3 font-semibold"
        >
          {saved ? "Saved!" : "Save preferences"}
        </button>
      </div>
    </main>
  );
}