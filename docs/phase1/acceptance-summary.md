# Phase 1 Acceptance Summary

Completed on: 2026-06-24

## Phase 1 Status

Phase 1 is ready for review.

The build scope is not yet ready for development until the client answers the commercial questions, but all technical and commercial alignment documents for Phase 1 have been prepared.

## Acceptance Rule

Local SEO brings the customer, the site builds trust, booking qualifies the lead, Stripe proves serious intent, and the database proves commission evidence.

Phase 1 supports this rule as follows:

- Local SEO: Next.js App Router, server-rendered pages, metadata, sitemap and service page architecture are confirmed.
- Trust: Hosting and package decisions support a premium, fast, stable website.
- Booking: Booking remains part of the MVP commercial flow.
- Stripe: MVP payments are defined as `reservation_fee` and `consultation_fee`; deposits are deferred.
- Database evidence: Attribution and commission fields are defined for leads, payments and projects.

## Created Documents

- `docs/phase1/version-lock.md`
- `docs/phase1/hosting-decision.md`
- `docs/phase1/commercial-questions.md`
- `docs/phase1/stripe-setup.md`
- `docs/phase1/commission-schema.md`
- `docs/phase1/risk-update.md`
- `docs/phase1/acceptance-summary.md`

## Key Decisions Documented

- "NEXT19" is treated as a codename, not a strict package version.
- Latest stable package versions are pinned.
- React 19.x compatibility is confirmed through package peer ranges.
- Recommended hosting is Vercel Pro + PlanetScale MySQL-compatible database.
- Neon is not recommended unless the database changes from MySQL to Postgres.
- MVP Stripe scope is reservation fee and consultation fee only.
- Project deposits are deferred.
- Commission evidence requires attribution fields and idempotent payment records.

## Client Questions Ready

The client email template is ready in:

- `docs/phase1/commercial-questions.md`

It can be sent immediately.

## Remaining Phase 1 Open Items

These are waiting for client confirmation:

- Agreement to 35% commission up to EUR 1,000 total.
- Definition of website-generated job.
- Stripe account ownership.
- Refund/accounting responsibility.
- Reservation fee amount.
- Consultation fee amount.
- Whether deposits are enabled later or at launch.
- Admin view vs export for commission records.

## Final Phase 1 Verdict

Phase 1 is complete as a technical lead documentation pass.

The next action is to send the client questions and wait for sign-off before Phase 2 starts.
