# Phase 6 Performance Cleanup

Phase 6 removes proven-unused production ballast, switches large runtime imagery to optimized WebP assets, and documents files that should stay out of deployment packages.

## Runtime Assets Kept

- `public/hero/background-interior.webp` is the active homepage hero image.
- `public/hero/background-interior.png` remains as the original source/safety fallback.
- `public/images/floating_glass.webp` is the active reduced-motion/WebGL fallback background.
- `public/images/floating_glass.png` remains as the original source/safety fallback.
- `public/models/ducato_optimized.glb` remains required by `components/3d/SceneCanvas.tsx`.
- `public/og/martis-mv-og.jpg` remains the stable Open Graph image.

## Removed Or Excluded Ballast

The removed files had zero app/runtime references in `app`, `components`, `lib`, `public`, `next.config.ts`, and runtime metadata:

- root furniture demo models: `ClassicNightstand_01_4k.glb`, `side_table_01_4k.glb`
- source texture maps: `textures/`
- duplicate/source root media: `background picture.png`, `martiš mv 1.png`, `martiš mv 2.png`, `martiš mv 3.png`
- root generated model output: `ducato_optimized.glb`
- unused public demo model/render outputs: `public/models/fiat_ducato_x290_lowpoly.glb`, `public/images/fiat_ducato_x290_atlas.png`, `public/renders/martis-interior-hero.webp`
- source render exports: `renders/`
- local generated files: `next-dev*.log`, `tsconfig.tsbuildinfo`

`tools/blender-mcp/` is treated as special embedded development tooling and was not deleted in Phase 6. It is excluded from Vercel deployment through `.vercelignore`.

## Deployment Notes

Deploy only the Next.js runtime source and active `public/` assets. Do not upload `.git`, `node_modules`, `.next`, `.cursor`, `.agents`, `docs`, `textures`, `renders`, `tools`, root source images/models, logs, or local TypeScript build info.

Before deployment, run:

```powershell
npm.cmd run build
npx.cmd tsc --noEmit
```

Optional smoke checks should verify `/`, `/sluzby`, `/booking`, `/kontakt`, local landing pages, `/sitemap.xml`, and `/robots.txt`.
