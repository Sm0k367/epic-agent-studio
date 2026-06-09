"use client";

import { useState } from "react";
import { ShareEpicOs } from "@/components/marketing/ShareEpicOs";

const DOCK_PRESETS = [
  { id: "builder", label: "Builder", apps: ["deploy.oneclick", "deploy.vercel", "deploy.supabase", "ai.continue", "files.epic_os"] },
  { id: "creator", label: "Creator", apps: ["media.reel.custom", "web.canva", "web.spotify", "ai.continue", "deploy.hub"] },
  { id: "default", label: "Balanced", apps: ["deploy.oneclick", "deploy.hub", "ai.continue", "deploy.vercel", "eco.plans"] },
];

export function OnboardingWizard({
  onSaveDock,
  onFinish,
  referralCode,
}: {
  onSaveDock: (dockFavorites: string[]) => Promise<void>;
  onFinish: () => Promise<void>;
  referralCode?: string;
}) {
  const [step, setStep] = useState(0);
  const [preset, setPreset] = useState("default");
  const [saving, setSaving] = useState(false);

  async function launch() {
    setSaving(true);
    const chosen = DOCK_PRESETS.find((p) => p.id === preset) ?? DOCK_PRESETS[2];
    await onSaveDock(chosen.apps);
    setSaving(false);
    setStep(2);
  }

  async function enterOs() {
    setSaving(true);
    await onFinish();
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07070f]/90 p-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#2a2a45] bg-[#111122] p-8 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
        {step === 0 && (
          <>
            <p className="text-xs uppercase tracking-widest text-[#22d3ee]">Welcome</p>
            <h2 className="mt-2 text-2xl font-bold">Your Epic OS is ready</h2>
            <p className="mt-3 text-sm text-[#7a7a9a]">
              This is your private workspace — dock, apps, and settings are yours alone. Let&apos;s
              set up your dock in one tap.
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] py-3 font-semibold transition hover:brightness-110"
            >
              Customize my dock
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-xs uppercase tracking-widest text-[#22d3ee]">Step 1 of 2</p>
            <h2 className="mt-2 text-xl font-bold">Pick a dock style</h2>
            <div className="mt-6 space-y-3">
              {DOCK_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreset(p.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    preset === p.id
                      ? "border-[#a855f7] bg-[#252540]"
                      : "border-[#2a2a45] hover:border-[#a855f7]/50"
                  }`}
                >
                  <span className="font-semibold text-[#eeeef8]">{p.label}</span>
                  <span className="mt-1 block text-xs text-[#7a7a9a]">{p.apps.length} dock apps</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void launch()}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Launch my OS"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs uppercase tracking-widest text-[#4ade80]">Step 2 of 2</p>
            <h2 className="mt-2 text-xl font-bold text-[#4ade80]">You&apos;re all set</h2>
            <p className="mt-2 text-sm text-[#7a7a9a]">
              Know a builder who&apos;d love Epic OS? Send them your invite link.
            </p>
            <div className="mt-6">
              <ShareEpicOs referralCode={referralCode} />
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void enterOs()}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Opening…" : "Enter my OS"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}