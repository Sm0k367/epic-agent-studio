import type { MetadataRoute } from "next";
import { PUBLIC_URL } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = PUBLIC_URL;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/studio`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}