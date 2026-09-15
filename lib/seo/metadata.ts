import type { Metadata } from "next";
export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return undefined;
  try { const url = new URL(raw); if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return undefined; return url.origin; } catch { return undefined; }
}
export function buildPageMetadata(title: string, description: string, path = "/"): Metadata {
  const origin = siteUrl();
  return { title, description, ...(origin ? { metadataBase: new URL(origin), alternates: { canonical: origin + path } } : {}),
    openGraph: { title, description, siteName: "KROVEX", locale: "sk_SK", type: "website", ...(origin ? { url: origin + path, images: [{ url: "/images/roofing/finished-roof.webp", width: 799, height: 534, alt: "Rodinný dom s dokončenou strechou" }] } : {}) },
    twitter: { card: "summary_large_image", title, description } };
}
