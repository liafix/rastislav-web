# KROVEX — GROVTIC trial

A fictional roofing company: landing page, three-step inquiry, MySQL persistence, two SMTP emails, and a password-protected company page. No payment functionality.

## Local commands

Node.js 22 LTS or newer supported LTS, npm. Windows commands:
```
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```
On a fresh checkout, run the build before typecheck to generate Next route types.
Port 3000 remains reserved. Local QA may use an explicitly selected free loopback port (for example 3107), with synthetic configuration and no real DB/SMTP access. Do not run real inquiry submissions against an unverified database.

## Routes

- / — roofing landing page
- /dopyt — exactly three steps: roof type + area; location + timeframe; name + email + phone
- /api/inquiries — POST only, validated JSON, 16 KiB maximum
- /admin — password login
- /admin/dopyty — authenticated list, detail via ?id=, cursor pagination via ?before=
- /api/admin/login and /api/admin/logout — POST
- /api/admin/inquiries/[id] — authenticated same-origin PATCH to mark completed
- /robots.txt and /sitemap.xml — public metadata

## Environment

Use .env.example as the variable-name reference. Never commit .env.local.
Required: DATABASE_URL, NEXT_PUBLIC_SITE_URL, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_REPLY_TO, OWNER_NOTIFICATION_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET.

NEXT_PUBLIC_SITE_URL must be the final controlled HTTPS origin, without a path. Missing URL omits canonical/sitemap entries rather than inventing a domain. Replace any donor URL in external environment configuration before building for production.

SMTP uses authenticated TLS: port 587 with SMTP_SECURE=false (STARTTLS required), or provider-supported 465 with true. SMTP_FROM must belong to the controlled website domain, never Gmail. Configure SPF/DKIM/DMARC through the chosen provider. Credentials remain opaque and are not logged. A successful SMTP handoff is not proof of inbox delivery.

Final authorized live test: OWNER_NOTIFICATION_EMAIL=palenik.martin@grovtic.com and enter that same address as customer. Do not perform this test until deployment and configuration are approved.

## Admin configuration

Use a long random password, not a reused password. Generate a random 16-byte salt and derive a 64-byte key with Node crypto.scrypt using default parameters. Hash format:
`scrypt$<32 lowercase hex salt>$<128 lowercase hex key>`
The salt is passed to scrypt as its hex string, matching lib/admin/auth.ts.
Generate ADMIN_SESSION_SECRET from at least 32 random bytes.

When entering a hash in a dotenv file used by Next.js, escape each dollar sign with a backslash; quotes alone do not prevent variable expansion. In a hosting dashboard enter the raw hash. Never place a plaintext password in source, command arguments, Git, or logs.

Signed cookie: HttpOnly, SameSite=Lax, Secure in production, eight-hour expiry. Logout clears the browser cookie. There is no DB session table: a copied token remains valid until expiry; rotate ADMIN_SESSION_SECRET to invalidate all sessions. Changing the password alone does not revoke existing tokens. Apply platform request limits to login/public submission before exposing the trial broadly; no claim of a distributed rate limiter is made.

## Database — EXTERNAL CONFIGURATION REQUIRED

db/krovex-schema.ts is the sole active schema. db/krovex-migrations/0000_krovex_inquiries.sql creates only krovex_inquiries. It has NOT been applied during implementation.
db/schema.ts and db/migrations/ are historical donor data definitions; preserve them and existing production tables. Active application code does not import that schema.

Safe procedure:
1. Provision/confirm a separate KROVEX MySQL database; verify host, database identity, privileges, TLS and backups through the provider without exposing credentials.
2. Review the additive SQL and confirm the table is absent. Apply that exact SQL once through the approved database administration workflow.
3. Confirm all columns and the unique submission_key index. Do not run old donor migrations, schema push, or DROP statements.
4. Configure DATABASE_URL in the deployment environment; verify persist/read/complete/refresh on the confirmed target.
5. Future SQL generation: npm.cmd run db:generate. Generation/checking does not connect to a database. No automatic migration on build/start.

## Inquiry reliability

Server validation is authoritative. The client retains values and a stable UUID across retries while mounted; a unique database key prevents duplicate records and duplicate sends for the same submission. A new mount represents a new submission. The record is saved before either email. Company and customer delivery outcomes are independent; failures preserve the inquiry and return a truthful saved receipt.

A process interruption after insertion can leave pending mail. Admin displays that state; inspect provider logs and contact the customer manually as needed. There is no automatic resend, retry UI or delivery queue. Timeout acceptance can be ambiguous: never resend blindly. No inquiry is deleted because email failed.

## Assets and design

Originals remain in images/. Public exports:
- logo-krovex.webp → krovex-logo.png (960 px wide)
- picture6.webp → hero-roof.webp
- picture2.webp → new-roof.webp
- picture5.webp → roof-reconstruction.webp (full before/after)
- picture4.webp → roof-repair.webp
- picture3.webp → finished-roof.webp

Existing photographic WebP files are copied without lossy recompression. Next Image provides responsive delivery. Supplied pictures are illustrative trial assets, not claimed client references. Cream/graphite/orange styling and architectural typography are retained; old motion overlays and interior routes are removed.

## Production verification still required

Confirm the DB target and apply reviewed SQL; configure real domain, HTTPS, environment and SMTP sender authentication; authorize deployment; submit the real Martin inquiry; confirm both inbox arrivals; log into admin, inspect the saved inquiry, mark completed, refresh, logout and retest access on the public URL. Send admin credentials through an approved private channel. Finish the exact ten-line QA note only with verified facts, and provide weekly availability/hourly rate separately.

Historical docs under docs/phase*, docs/contracts.md and MARTIS_MV_PREMIUM_WEBSITE_PHASE_PLAN.md describe the donor only. They are not active product instructions. See docs/KROVEX_QA_DRAFT.md and docs/KROVEX_VERIFICATION.md for current evidence.
