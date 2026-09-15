import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";
export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }, ...(origin ? { sitemap: origin + "/sitemap.xml" } : {}) };
}
