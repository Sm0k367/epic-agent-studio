"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  workspace: { plan: string; name: string } | null;
};

type Flag = { key: string; enabled: boolean; description: string };

type Generation = {
  id: string;
  modality: string;
  prompt: string;
  status: string;
  createdAt: string;
  workspace: {
    name: string;
    user: { email: string; name: string | null };
  };
};

export function AdminPanel({ isPlatformAdmin }: { isPlatformAdmin: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [flags, setFlags] = useState<Flag[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [tab, setTab] = useState<"users" | "generations" | "flags">("generations");

  useEffect(() => {
    if (isPlatformAdmin) {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((d) => setUsers(d.users ?? []));
      fetch("/api/admin/feature-flags")
        .then((r) => r.json())
        .then((d) => setFlags(d.flags ?? []));
      fetch("/api/admin/generations")
        .then((r) => r.json())
        .then((d) => setGenerations(d.generations ?? []));
    }
  }, [isPlatformAdmin]);

  async function setRole(userId: string, role: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  }

  async function toggleFlag(key: string, enabled: boolean) {
    await fetch("/api/admin/feature-flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)));
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-[#eeeef8]">
      <header className="flex items-center justify-between border-b border-[#2a2a45] bg-[#111122] px-6 py-4">
        <h1 className="text-xl font-bold">Epic Agent Studio Admin</h1>
        <Link href="/studio" className="text-[#22d3ee] hover:underline">
          ← Back to Studio
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex gap-2">
          {isPlatformAdmin && (
            <button
              type="button"
              onClick={() => setTab("users")}
              className={`rounded-lg px-4 py-2 ${tab === "users" ? "bg-[#a855f7]" : "bg-[#1a1a2e]"}`}
            >
              Users
            </button>
          )}
          {isPlatformAdmin && (
            <button
              type="button"
              onClick={() => setTab("generations")}
              className={`rounded-lg px-4 py-2 ${tab === "generations" ? "bg-[#a855f7]" : "bg-[#1a1a2e]"}`}
            >
              Generations
            </button>
          )}
          {isPlatformAdmin && (
            <button
              type="button"
              onClick={() => setTab("flags")}
              className={`rounded-lg px-4 py-2 ${tab === "flags" ? "bg-[#a855f7]" : "bg-[#1a1a2e]"}`}
            >
              Feature Flags
            </button>
          )}
        </div>

        {tab === "users" && isPlatformAdmin && (
          <div className="overflow-x-auto rounded-xl border border-[#2a2a45]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111122] text-[#7a7a9a]">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Workspace</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[#2a2a45]">
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.workspace?.name ?? "—"}</td>
                    <td className="p-3 capitalize">{u.workspace?.plan ?? "inactive"}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => setRole(u.id, e.target.value)}
                        className="rounded border border-[#2a2a45] bg-[#1a1a2e] px-2 py-1"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "generations" && isPlatformAdmin && (
          <div className="overflow-x-auto rounded-xl border border-[#2a2a45]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111122] text-[#7a7a9a]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Modality</th>
                  <th className="p-3">Prompt</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((g) => (
                  <tr key={g.id} className="border-t border-[#2a2a45]">
                    <td className="p-3 whitespace-nowrap text-xs text-[#7a7a9a]">
                      {new Date(g.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3">{g.workspace.user.email}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-[#a855f7]/20 px-2 py-0.5 text-xs uppercase">
                        {g.modality}
                      </span>
                    </td>
                    <td className="max-w-xs truncate p-3 text-[#7a7a9a]">{g.prompt}</td>
                    <td className="p-3 capitalize">{g.status}</td>
                  </tr>
                ))}
                {generations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#7a7a9a]">
                      No generations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "flags" && isPlatformAdmin && (
          <div className="grid gap-2">
            {flags.map((flag) => (
              <label
                key={flag.key}
                className="flex items-center justify-between rounded-lg border border-[#2a2a45] bg-[#111122] px-4 py-3"
              >
                <span>
                  <strong>{flag.key}</strong>
                  <span className="ml-2 text-xs text-[#7a7a9a]">{flag.description}</span>
                </span>
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={(e) => toggleFlag(flag.key, e.target.checked)}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}