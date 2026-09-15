import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl();
  return origin ? ["/", "/dopyt"].map(path => ({ url: origin + path })) : [];
}
