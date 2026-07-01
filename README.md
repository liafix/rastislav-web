# Martis MV Website

Production-oriented Next.js website for `Martiš MV` interior reconstruction services.

The project includes:

- premium landing and service pages,
- local SEO landing pages,
- booking flow with Stripe Checkout integration,
- Drizzle database schema and migrations,
- server-only email notification support,
- sitemap, robots, metadata, and Open Graph assets,
- desktop 3D/motion layer with reduced-motion and mobile fallbacks.

## Requirements

- Node.js 20.9 or newer

## Install

```bash
npm install
```

## Local Server Policy

Do not run this project on a local development server. This website is verified with production builds and deployed through Vercel.

Port `3000` is reserved for Weblore.ai and must not be used by this project.

## Build

```bash
npm run build
```

## Production Asset Notes

Phase 6 removed unused source/demo assets and switched large runtime imagery to optimized WebP files:

- active hero image: `public/hero/background-interior.webp`
- active WebGL fallback image: `public/images/floating_glass.webp`
- required runtime model: `public/models/ducato_optimized.glb`
- stable social image: `public/og/martis-mv-og.jpg`

Do not deploy local ballast such as `.git`, `node_modules`, `.next`, `.cursor`, `.agents`, `docs`, `textures`, `renders`, `tools`, root source images/models, development logs, or `tsconfig.tsbuildinfo`. See `.vercelignore` and `docs/phase6/performance-cleanup.md` for the Phase 6 cleanup record.
