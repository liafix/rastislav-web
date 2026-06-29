# Phase 4 SEO/GEO Notes

Phase 4 adds App Router SEO infrastructure and local landing pages for the confirmed service area around Dubnica nad Váhom.

## Added public SEO routes

- `/sitemap.xml`
- `/robots.txt`
- `/rekonstrukcie-dubnica-nad-vahom`
- `/rekonstrukcie-trencin`
- `/rekonstrukcie-ilava`
- `/rekonstrukcie-nova-dubnica`
- `/rekonstrukcie-trencianska-tepla`

The sitemap includes only indexable public pages. It excludes API routes, `/booking/success`, and `/booking/cancel`.

## Metadata

Shared metadata now uses `NEXT_PUBLIC_SITE_URL` through `metadataBase`, canonical URLs, Open Graph metadata, and Twitter card metadata. Production must set `NEXT_PUBLIC_SITE_URL` to the real public domain.

The social preview image is:

- `public/og/martis-mv-og.jpg`
- `1200x630`
- generated from `public/hero/background-interior.png`

## Structured data

The site uses existing confirmed business data only: business name, legal name, phone, address, service area, URL, contact point, and offered services. Geo coordinates, opening hours, sameAs links, ratings, reviews, certifications, and legal registry data are intentionally omitted until confirmed.

## Follow-up confirmations

- Official GPS coordinates
- Opening hours
- Social/sameAs URLs
- Official logo file
- Any verifiable reviews, certifications, or registry details
