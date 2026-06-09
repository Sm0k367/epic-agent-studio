import type { MetadataRoute } from "next";
import { PUBLIC_URL } from "@/lib/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/auth/"],
      },
    ],
    sitemap: `${PUBLIC_URL}/sitemap.xml`,
  };
}