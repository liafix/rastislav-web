import type { Metadata } from "next";
import { company } from "@/lib/content/services";
import type { Service } from "@/lib/content/services";

const DEFAULT_SITE_URL = "https://martis-mv.sk";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path)
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: company.name,
      locale: "sk_SK",
      type: "website"
    }
  };
}

export function buildServiceMetadata(service: Service): Metadata {
  return buildPageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/sluzby/${service.slug}`
  });
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    legalName: company.legalName,
    telephone: company.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: "A. Kmeša 939/28",
      addressLocality: "Dubnica nad Váhom",
      addressCountry: "SK"
    },
    areaServed: company.serviceArea.map((area) => ({
      "@type": "Place",
      name: area
    })),
    url: getSiteUrl()
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.label,
    serviceType: service.jsonLd.serviceType,
    description: service.intro,
    provider: {
      "@type": "LocalBusiness",
      name: service.jsonLd.providerName,
      url: getSiteUrl()
    },
    areaServed: service.jsonLd.areaServed.map((area) => ({
      "@type": "Place",
      name: area
    })),
    url: absoluteUrl(`/sluzby/${service.slug}`)
  };
}

export function faqJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
