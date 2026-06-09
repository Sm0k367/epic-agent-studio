"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OnboardingWizard } from "@/components/os/OnboardingWizard";

type App = {
  id: string;
  name: string;
  icon: string;
  category: string;
  runtime: string;
  target: string;
  desc: string;
};

type CatalogResponse = {
  apps: App[];
  dockFavorites: string[];
  categories: string[];
  workspace: { id: string; name: string; plan: string };
  user: { id: string; name?: string | null; email?: string | null; role: string };
  onboardingDone: boolean;
};

export function Shell() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);
  const [status, setStatus] = useState<Record<string, unknown>>({});

  const showToast = useCallback((msg: string, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const load = useCallback(async () => {
    const [catRes, stRes] = await Promise.all([
      fetch("/api/os/catalog"),
      fetch("/api/os/status"),
    ]);
    if (!catRes.ok) throw new Error("Failed to load catalog");
    setCatalog(await catRes.json());
    if (stRes.ok) setStatus(await stRes.json());
  }, []);

  useEffect(() => {
    load().catch((e) => showToast(String(e), true));
  }, [load, showToast]);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const q = query.toLowerCase();
    return catalog.apps.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      );
    });
  }, [catalog, category, query]);

  const dockApps = useMemo(() => {
    if (!catalog) return [];
    return catalog.apps.filter((a) => catalog.dockFavorites.includes(a.id));
  }, [catalog]);

  async function saveDock(dockFavorites: string[]) {
    const res = await fetch("/api/os/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dockFavorites }),
    });
    if (!res.ok) throw new Error("Failed to save dock");
    setCatalog((c) => (c ? { ...c, dockFavorites } : c));
  }

  async function finishOnboarding() {
    const res = await fetch("/api/os/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingDone: true }),
    });
    if (!res.ok) throw new Error("Failed to finish onboarding");
    setCatalog((c) => (c ? { ...c, onboardingDone: true } : c));
  }

  async function runApp(id: string) {
    const res = await fetch("/api/os/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    showToast(data.message ?? (data.ok ? "Launched" : "Failed"), !data.ok);
    if (data.openUrl) window.open(data.openUrl, "_blank", "noopener,noreferrer");
  }

  if (!catalog) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#07070f] text-[#7a7a9a]">
        Loading your OS…
      </div>
    );
  }

  const isAdmin = ["ADMIN", "PLATFORM_ADMIN"].includes(catalog.user.role);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#07070f] text-[#eeeef8]">
      <header className="flex shrink-0 items-center gap-4 border-b border-[#2a2a45] bg-[#111122] px-5 py-2.5">
        <div className="bg-gradient-to-br from-[#a855f7] to-[#22d3ee] bg-clip-text text-xl font-extrabold text-transparent">
          Epic OS
        </div>
        <div className="flex flex-1 flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[#166534] px-2.5 py-1 text-[#4ade80]">Cloud</span>
          <span className="rounded-full border border-[#2a2a45] bg-[#1a1a2e] px-2.5 py-1">
            {String(status.session && typeof status.session === "object" && "focus" in status.session ? (status.session as { focus?: string }).focus : catalog.workspace.name)}
          </span>
          <span className="rounded-full border border-[#2a2a45] bg-[#1a1a2e] px-2.5 py-1 capitalize">
            {catalog.workspace.plan}
          </span>
        </div>
        <input
          className="w-72 rounded-lg border border-[#2a2a45] bg-[#1a1a2e] px-3 py-2 text-sm outline-none focus:border-[#a855f7]"
          placeholder="Search apps…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center gap-3 text-sm">
          <Link href="/api-hub" className="text-[#22d3ee] hover:underline">
            API Hub
          </Link>
          <Link href="/contact" className="text-[#7a7a9a] hover:text-white">
            Contact
          </Link>
          <Link href="/os/billing" className="text-[#7a7a9a] hover:text-white">
            Billing
          </Link>
          <Link href="/os/settings" className="text-[#7a7a9a] hover:text-white">
            Settings
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-[#a855f7] hover:underline">
              Admin
            </Link>
          )}
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-[#7a7a9a] hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-52 shrink-0 overflow-y-auto border-r border-[#2a2a45] bg-[#111122] py-2">
          {["All", ...catalog.categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`block w-full border-l-[3px] px-4 py-2 text-left text-sm transition ${
                category === c
                  ? "border-[#a855f7] bg-[#252540] font-semibold text-[#22d3ee]"
                  : "border-transparent text-[#7a7a9a] hover:bg-[#252540] hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto px-6 py-5 pb-24">
          <h2 className="mb-4 text-sm font-medium text-[#7a7a9a]">
            {category === "All" ? "All Apps" : category} ({filtered.length})
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-3">
            {filtered.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => runApp(app.id)}
                title={app.desc}
                className="rounded-2xl border border-[#2a2a45] bg-[#111122] p-4 text-center transition hover:-translate-y-0.5 hover:border-[#a855f7] hover:shadow-[0_8px_28px_rgba(168,85,247,0.25)]"
              >
                <div className="mb-2 text-3xl leading-tight">{app.icon}</div>
                <div className="text-xs font-semibold leading-tight">{app.name}</div>
                {app.runtime === "DESKTOP_ONLY" && (
                  <div className="mt-1 text-[10px] text-[#7a7a9a]">Desktop</div>
                )}
                {app.desc && <div className="mt-1 text-[10px] text-[#7a7a9a]">{app.desc}</div>}
              </button>
            ))}
          </div>
          {!filtered.length && (
            <p className="py-8 text-center text-[#7a7a9a]">No apps match.</p>
          )}
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-[#07070f] to-transparent px-4 py-3">
        <div className="pointer-events-auto flex gap-2 rounded-2xl border border-[#2a2a45] bg-[rgba(17,17,34,0.92)] p-2 backdrop-blur">
          {dockApps.map((app) => (
            <button
              key={app.id}
              type="button"
              title={app.name}
              onClick={() => runApp(app.id)}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2a2a45] bg-[#1a1a2e] text-2xl transition hover:-translate-y-1 hover:border-[#a855f7]"
            >
              {app.icon}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed right-4 top-16 z-50 max-w-xs rounded-xl border px-4 py-3 text-sm transition ${
            toast.err ? "border-[#f87171]" : "border-[#a855f7]"
          } bg-[#1a1a2e]`}
        >
          {toast.msg}
        </div>
      )}

      {catalog && !catalog.onboardingDone && (
        <OnboardingWizard
          onSaveDock={saveDock}
          onFinish={finishOnboarding}
          referralCode={catalog.user.id}
        />
      )}
    </div>
  );
}