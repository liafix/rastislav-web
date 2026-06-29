# Phase 1 Hosting Decision

Verified on: 2026-06-24

## Decision

Recommended MVP hosting path:

**Vercel Pro + PlanetScale MySQL-compatible database.**

Reason:

- The website must support server-rendered SEO, App Router Route Handlers and Stripe webhooks.
- Vercel is the lowest-friction production target for a Next.js App Router website.
- PlanetScale keeps the database aligned with the documentation's MySQL direction.
- This pairing reduces deployment and operations risk during the first commercial launch.

Neon is not the recommended database if the project must stay MySQL-based, because Neon is Postgres. Neon becomes viable only if we intentionally switch the schema from MySQL to Postgres before implementation.

## Compared Options

| Area | Vercel + PlanetScale MySQL | Vercel + Neon | Node VPS + MySQL |
| --- | --- | --- | --- |
| Next.js App Router | Strong fit. Vercel documents zero-configuration Next.js deployment and supports SSR through Vercel Functions. | Strong fit on the app side, but database changes from MySQL to Postgres. | Supported by `next start`, but requires manual infrastructure. |
| Server-rendered SEO | Supported. Good fit for service pages, metadata, sitemap and ISR. | Supported. | Supported if reverse proxy, caching and deployment are configured correctly. |
| Route Handlers | Supported. Public HTTPS endpoints are simple to expose. | Supported. | Supported if the Node server is publicly reachable over HTTPS. |
| Stripe webhooks | Strong fit. Use a public Route Handler endpoint such as `/api/webhooks/stripe`. | Strong fit. | Works, but TLS, reverse proxy, uptime and process management are our responsibility. |
| Environment variables | Vercel provides encrypted environment variables with Production, Preview and Development scopes. | Same as Vercel + PlanetScale. | Manual `.env`, systemd, Docker secrets or provider secrets. More responsibility and more room for mistakes. |
| Logging | Vercel Runtime Logs are available on all plans, with retention depending on plan. | Same as Vercel + PlanetScale. | Must configure logging stack manually, for example system logs, process manager logs, Docker logs or external logging. |
| Deployment simplicity | Highest. Git integration, preview deployments, instant rollback and managed functions. | Highest for app; database model changes add implementation risk. | Lowest. Requires server provisioning, Node runtime, reverse proxy, SSL, deploy script, backups, monitoring and security updates. |
| Cost | Vercel Pro is listed at USD 20/month plus usage. PlanetScale Base has resource-based pricing, with single-node starting at USD 5/month for development and low-traffic workloads. | Vercel Pro plus Neon. Neon Launch typical spend is listed at USD 15/month, but it is Postgres. | Provider cost can be a lower fixed monthly server cost, but exact pricing depends on provider, region, VAT, managed database choice and operational time. Must be quoted before purchase. |
| Operations burden | Low. | Low for hosting, medium because of schema change. | High. |
| Fit with documentation | Best. Keeps Next.js and MySQL direction. | Partial. Keeps Next.js, changes database type. | Good technically, but higher operations risk. |

## Recommendation

Use **Vercel Pro + PlanetScale MySQL-compatible database** for MVP launch.

This gives the strongest balance of:

- server-rendered SEO,
- Route Handlers,
- Stripe webhook accessibility,
- environment variable safety,
- deployment simplicity,
- lower operational risk,
- MySQL-compatible data model.

## VPS Fallback

Use a Node VPS only if the client explicitly prioritizes fixed hosting control/cost over operational simplicity.

If VPS is selected, the build scope must include:

- Linux server provisioning,
- Node.js runtime installation,
- reverse proxy such as nginx,
- HTTPS certificate automation,
- process manager or Docker deployment,
- MySQL setup or external managed MySQL,
- backups,
- firewall,
- log retention,
- monitoring,
- deployment rollback plan.

Next.js self-hosting docs recommend a reverse proxy in front of the Next.js server. That makes VPS viable, but not the cleanest Phase 1 recommendation.

## Database Decision

- If MySQL remains locked: choose PlanetScale or another MySQL-compatible managed database.
- If switching to Postgres is accepted: Neon can be reconsidered.
- If VPS is selected: decide whether MySQL is self-managed on the VPS or bought from a managed database provider.

## Sources

- Vercel pricing: https://vercel.com/pricing
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel runtime logs: https://vercel.com/docs/logs/runtime
- Vercel Next.js docs: https://vercel.com/docs/frameworks/full-stack/nextjs
- Next.js self-hosting docs: https://nextjs.org/docs/app/guides/self-hosting
- Neon pricing: https://neon.com/pricing
- PlanetScale pricing: https://planetscale.com/pricing
- Hetzner cloud overview: https://www.hetzner.com/cloud/
