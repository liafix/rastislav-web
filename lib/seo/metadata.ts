import type { Metadata } from "next";
import { company, services } from "@/lib/content/services";
import type { Service } from "@/lib/content/services";

const DEFAULT_SITE_URL = "https://martis-mv.sk";
const DEFAULT_OG_IMAGE = {
  url: "/og/martis-mv-og.jpg",
  width: 1200,
  height: 630,
  alt: `${company.name} - ${company.descriptor}`
};

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function siteMetadataBase() {
  return new URL(getSiteUrl());
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
    metadataBase: siteMetadataBase(),
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: company.name,
      locale: "sk_SK",
      type: "website",
      images: [DEFAULT_OG_IMAGE]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url]
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
    "@type": "HomeAndConstructionBusiness",
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
    url: getSiteUrl(),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: company.phoneDisplay,
      contactType: "customer service",
      areaServed: "SK",
      availableLanguage: ["sk"]
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Interiérové rekonštrukcie a služby",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.label,
          serviceType: service.jsonLd.serviceType,
          url: absoluteUrl(`/sluzby/${service.slug}`)
        }
      }))
    }
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
      "@type": "HomeAndConstructionBusiness",
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
