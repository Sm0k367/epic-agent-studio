export const COMPANY = {
  name: "Epic Tech AI",
  product: "Epic Agent Studio",
  tagline: "Multimodal AI creative platform",
  legalName: "Epic Tech AI",
  copyright: "Copyright (c) 2025–2026 Epic Tech AI. All Rights Reserved.",
  email: "epichtechai@gmail.com",
  emailHref: "mailto:epichtechai@gmail.com",
  x: {
    handle: "@EpicTechAI",
    url: "https://x.com/EpicTechAI",
  },
  /** @see CONTRIBUTORS.md */
  engineering: "Grok (xAI)",
  engineeringUrl: "https://x.ai",
  effectiveDate: "June 9, 2026",
} as const;

export const PUBLIC_URL = "https://epic-agent-studio-production.up.railway.app";

export function siteBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? PUBLIC_URL;
}