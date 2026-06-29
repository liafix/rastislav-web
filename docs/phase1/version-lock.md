# Phase 1 Version Lock

Verified on: 2026-06-24

## Decision

Use the latest public stable npm `latest` versions below. Do not use beta, canary or release-candidate packages for the MVP scaffold.

The project codename "NEXT19" is not a strict package version requirement. The implementation target is the latest stable Next.js App Router stack compatible with React 19.x.

## Pinned Package Versions

| Package | Pinned version | Why this version was chosen | Compatibility notes |
| --- | ---: | --- | --- |
| `next` | `16.2.9` | Latest stable npm `latest` version and current version shown in official Next.js docs. | Requires Node.js `>=20.9.0`. Peer range includes `react` and `react-dom` `^19.0.0`. App Router, Route Handlers, metadata files, sitemap and server rendering are supported. |
| `react` | `19.2.7` | Latest stable npm `latest` version. | Compatible with Next.js `16.2.9` peer range and React Three Fiber `9.6.1` peer range. Pin `react-dom` to the same version even though it was not listed separately in the request. |
| `react-dom` | `19.2.7` | Required companion package for React and Next.js. | Must match `react` to avoid renderer mismatch. |
| `typescript` | `6.0.3` | Latest stable npm `latest` version. | Next.js docs support TypeScript setup. No npm peer conflict is declared by `next`. Validate with `next build` immediately after scaffold. |
| `tailwindcss` | `4.3.1` | Latest stable npm `latest` version. | Next.js `create-next-app` supports Tailwind setup. Keep Tailwind config minimal until design tokens are locked. |
| `drizzle-orm` | `0.45.2` | Latest stable npm `latest` version. | Supports MySQL through compatible drivers. For this project, choose either `mysql2` for normal MySQL or `@planetscale/database` for PlanetScale. Driver package will be locked in the implementation phase after hosting is confirmed. |
| `stripe` | `22.2.3` | Latest stable npm `latest` version. | Requires Node.js `>=18`; Next.js already requires Node.js `>=20.9.0`, so the runtime requirement is satisfied. Use only in server Route Handlers. |
| `@react-three/fiber` | `9.6.1` | Latest stable npm `latest` version. | Peer range requires React `>19 <19.3`, React DOM `>19 <19.3` and Three `>=0.156`. React `19.2.7` and Three `0.184.0` satisfy this. Must run only in client components. |
| `three` | `0.184.0` | Latest stable npm `latest` version. | Satisfies React Three Fiber and Drei peer ranges. Keep assets optimized and load Three.js only where needed. |
| `@react-three/drei` | `10.7.7` | Latest stable npm `latest` version. | Peer range requires React `^19`, React DOM `^19`, Three `>=0.159` and React Three Fiber `^9.0.0`. The selected stack satisfies this. |
| `gsap` | `3.15.0` | Latest stable npm `latest` version. | No npm peer dependency conflict. Use ScrollTrigger only inside client components and refresh after model/image load. |
| `lenis` | `1.3.23` | Latest stable npm `latest` version. | React peer range is `>=17.0.0`, so React 19 is valid. Use one scroll authority and synchronize with GSAP ScrollTrigger. |

## Compatibility Verdict

The selected package set is compatible for the Martis MV MVP under these rules:

- Use Node.js `>=20.9.0` because Next.js requires it.
- Use App Router and Route Handlers for server-rendered SEO pages, forms and Stripe endpoints.
- Keep Stripe and Drizzle code server-only.
- Keep Three.js, React Three Fiber, Drei, GSAP and Lenis inside client components.
- Treat the 3D layer as progressive enhancement; SEO content and conversion forms must render without WebGL.
- Run `next build` immediately after scaffold to confirm TypeScript `6.0.3` and framework tooling compatibility in the concrete project.

## Known Caveats

- `typescript` has no direct npm peer constraint from `next`, so compatibility must be validated by the scaffold build.
- `drizzle-orm` requires a database driver that depends on final hosting. For MySQL-compatible PlanetScale use `@planetscale/database`; for classic MySQL use `mysql2`.
- `@react-three/fiber` requires React `<19.3`, so future React upgrades must be checked before changing the React pin.
- GSAP ScrollTrigger and Lenis both touch scroll behavior. They must be initialized once and cleaned up on route changes.

## Sources

- npm registry package metadata fetched on 2026-06-24 for all pinned packages.
- Next.js installation docs: https://nextjs.org/docs/app/getting-started/installation
- Next.js Route Handler docs: https://nextjs.org/docs/app/api-reference/file-conventions/route
- Next.js sitemap docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Stripe Checkout docs: https://docs.stripe.com/checkout/quickstart
- Stripe webhook signature docs: https://docs.stripe.com/webhooks/signature
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis docs/repository: https://github.com/darkroomengineering/lenis
