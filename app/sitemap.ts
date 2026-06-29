import type { MetadataRoute } from "next";
import { localPages } from "@/lib/content/local-pages";
import { services } from "@/lib/content/services";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: absoluteUrl("/sluzby"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/booking"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: absoluteUrl("/kontakt"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/sluzby/${service.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const localRoutes: MetadataRoute.Sitemap = localPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: "monthly",
    priority: page.path === "/rekonstrukcie-dubnica-nad-vahom" ? 0.9 : 0.75
  }));

  return [...staticRoutes, ...serviceRoutes, ...localRoutes];
}
