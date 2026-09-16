# KROVEX technical finalization — 2026-09-16

## Scope and baseline

Repository: C:\Users\DC\projects\projects\rastislav-web-grovtic
Branch: grovtic-krovex-trial
HEAD: 63b1b76504e698b4985cf8332381812118f5050a

Frontend frozen. Existing implementation and origin fix retained; only two origin regression tests and verification documentation added/updated in this pass. Next regenerated next-env.d.ts from development references to the already committed production references; no final diff remains in that file. Initial free disk: 1,299,865,600 bytes. No source/cache deletion required.

## Commands and results

| Check | Result |
| --- | --- |
| node --conditions=react-server --import=tsx --test --test-reporter=spec tests/*.test.ts | PASS, 63 tests |
| npm.cmd run typecheck | PASS |
| npm.cmd run lint | PASS, no warnings |
| npm.cmd run build | PASS, Next 16.3.5 |
| npm.cmd run db:check | PASS, local migration journal check only |
| npm.cmd audit --json | 4 moderate, 0 high, 0 critical |
| npm.cmd audit --omit=dev --json | 0 findings |
| git diff --check | PASS |

Build used a process-only NEXT_PUBLIC_SITE_URL=https://krovex.example for safe local metadata. Production must rebuild with the actual controlled domain. .env.local was not opened, printed or changed; Next loads it internally. Git ignores it and does not track it.

Tests cover validation, payload limits, malformed requests, duplicate/race handling, save-before-email order, independent SMTP failures, escaped complete email templates, password verification, cookie expiry/signatures, unauthorized reads/mutations, logout and origin protection. DB/SMTP are mocked; these are not production connectivity/delivery tests.

## Origin protection

lib/request-origin.ts already contained the complete fix. Both lib/admin/handlers.ts and lib/inquiries/request.ts use it.

Expected origin uses request.url protocol and the incoming Host, falling back to request.url host for constructed Requests without a Host header. Application code does not accept arbitrary X-Forwarded-Host or X-Forwarded-Proto as overrides. Deployment must use the hosting platform's normal trusted request/protocol reconstruction.

Compiled HTTP tests:
- localhost:3107, same origin: login reaches password validation (401 for deliberate wrong password); inquiry reaches field validation (422 for empty data).
- 127.0.0.1:3107: identical expected behavior.
- Both hosts with an external Origin: 403 for login and inquiry.
- Unit tests reject host/scheme mismatch, null/missing origin for admin, and forwarded-header attempts.

Public inquiry permits absent Origin for non-browser JSON clients; authoritative validation and payload bounds still apply. Admin mutations require Origin.

## Compiled routes

- / — public landing
- /dopyt — three-step inquiry
- /admin — password login
- /admin/dopyty — protected list and detail via ?id=; cursor pagination via ?before=
- /api/inquiries — POST
- /api/admin/login — POST
- /api/admin/logout — POST
- /api/admin/inquiries/[id] — PATCH completion
- /robots.txt, /sitemap.xml, framework /_not-found

There is no /admin/dopyty/[id] page. Query-based detail implements the assignment without adding another page.

## Browser verification

In-app browser connection failed with "Browser is not available: iab"; used installed Microsoft Edge through playwright-core against loopback port 3107. The production server used synthetic credentials, an intercepted in-memory MySQL driver and blocked SMTP. No external DB was contacted and no email was sent. Next's generated external-driver alias required a QA fixture correction; application code was unchanged.

31 overflow checks passed:
- landing, form errors, step 2, step 3 and login at 320 / 375 / 390 / 768 / 1440 px;
- admin detail with long location/email values at all five widths;
- reduced-motion landing.

Images loaded and meaningful page content rendered. Screenshots inspected at mobile and desktop; no redesign performed. Admin interaction: wrong password fails, correct password succeeds, list/detail loads, mark completed succeeds, refresh retains mock state, logout redirects, protected navigation redirects, anonymous PATCH returns 401. No uncaught page errors recorded. Real database persistence remains unverified.

Ignored local evidence:
.cache/krovex-browser-results.json
.cache/krovex-home-320.png
.cache/krovex-home-1440.png
.cache/krovex-form-320.png
.cache/krovex-admin-320.png
.cache/krovex-admin-1440.png

Temporary QA scripts/screenshots are ignored, not deployed application code or tracked files. The QA server was stopped after verification.

## Source/security audit

Active app/, components/, lib/, package.json, package-lock.json, .env.example and next.config.ts contain no unintended Martis/Stripe/payment/obsolete-route remnants. No empty source/test files, debugger statements, unfinished TODO/FIXME markers or console.log/debug found in active application source. Historical donor DB schema/migrations and documentation are retained, with no active imports of the old schema.

Server-only DB/auth/mail modules, authoritative validation, escaped HTML, bounded requests, generic responses, signed HttpOnly SameSite=Lax production-Secure eight-hour cookies and protected mutations remain intact. No source secret or .env.local tracking was introduced. The admin session is stateless: logout clears the browser cookie; rotating ADMIN_SESSION_SECRET invalidates copied tokens. Existing documented limitations (no distributed rate limiter or automatic email recovery queue) remain unchanged.

## Dependency findings

The four moderate entries are drizzle-kit -> @esbuild-kit/esm-loader -> @esbuild-kit/core-utils -> its old esbuild. They refer to development-server cross-origin response exposure (GHSA-67mh-4wv8-2f99). These development tools are not imported by the deployed app, and this workflow does not expose an esbuild development server. npm's proposed fix is a breaking drizzle-kit downgrade to 0.18.1; not applied. No forced audit fix or dependency change occurred in this finalization pass.

ESLint remains pinned to compatible 9.39.5. It is deprecated, but ESLint 10 was verified incompatible with the current Next React lint plugin in the preceding pass; this is a documented maintenance limitation, not an npm security advisory.

## Database and SMTP

db/krovex-schema.ts and db/krovex-migrations/0000_krovex_inquiries.sql remain isolated/additive. No migration was applied, no old table altered, and no external data mutated. db:check checks generated migration consistency, not target-database safety.

Dual SMTP implementation persists inquiry first, includes the complete inquiry in the company message and customer HTML thank-you, and records outcomes independently. Real controlled-domain sender, TLS/provider credentials, SPF/DKIM/DMARC and inbox delivery remain unverified.

## Original GROVTIC assignment — code assessment

| Requirement | Code evidence/status | External acceptance remaining |
| --- | --- | --- |
| Fictional roofing business | PASS: KROVEX and supplied roofing assets | Approve later frontend integration |
| 2–3 step inquiry, all fields | PASS: exactly 3 steps in InquiryForm | Real production submission |
| Server validation | PASS: shared contract enforced by POST handler, negative tests | Production route smoke test |
| Complete company email via SMTP | PASS: implementation + mocked transport/template tests | Actual receipt by palenik.martin@grovtic.com |
| Customer HTML thank-you, submitted info, next step | PASS: complete escaped template | Martin as customer receives autoresponse |
| Sender on controlled website domain | Config supported; not live-verified | Configure domain sender, DNS authentication and SMTP |
| Every inquiry stored | PASS: additive schema/repository/order tests | Confirm target, apply SQL, verify real stored row |
| Password-protected list/detail/completed | PASS: tests + browser mock flow | Verify real DB completion survives refresh |
| Mobile without horizontal scroll | PASS locally at five required widths | Recheck integrated frontend and public deployment |
| Real public URL + valid HTTPS | Deployment code builds | Authorized deployment, DNS/TLS and refresh verification |
| Exactly 10 QA lines | Draft updated with verified facts | Finalize only after external acceptance |
| Weekly availability + hourly rate | No invented answers | User supplies both in delivery email |

## External next steps

Confirm/provision the intended MySQL database and backups; apply reviewed additive SQL; configure the actual HTTPS origin, SMTP/domain authentication, notification recipient, admin hash and session secret. Integrate the separately approved frontend, repeat relevant local checks, then authorize deployment. Verify production HTTPS/direct refresh, real inquiry persistence, both Martin emails, admin completion/refresh/logout. Send admin credentials privately, finalize ten-line QA and provide availability/rate separately.

No deployment, DNS changes, real email, migration, commit, push or merge was performed in this pass.
