"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/company";
import { referralShareUrl } from "@/lib/referral";

export function ShareEpicOs({
  compact = false,
  referralCode,
}: {
  compact?: boolean;
  referralCode?: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = referralShareUrl(referralCode);
  const tweet = encodeURIComponent(
    `I'm using Epic OS — my personal AI operating system in the cloud. 88 apps, deploy tools, one workspace. ${shareUrl}`,
  );

  async function copy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        className="text-xs text-[#22d3ee] hover:underline"
      >
        {copied ? "Copied!" : "Copy invite link"}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={copy}
        className="rounded-full border border-[#2a2a45] bg-[#111122] px-5 py-2 text-sm transition hover:border-[#a855f7]"
      >
        {copied ? "Link copied ✓" : "Copy invite link"}
      </button>
      <a
        href={`https://x.com/intent/tweet?text=${tweet}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-[#2a2a45] bg-[#111122] px-5 py-2 text-sm transition hover:border-[#22d3ee]"
      >
        Share on {COMPANY.x.handle}
      </a>
    </div>
  );
}