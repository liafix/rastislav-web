# Phase 1 Risk Register Update

Updated on: 2026-06-24

## Summary

Phase 1 confirms that the project is technically feasible, but several risks must be closed before development starts.

## Updated Risks

| Risk | Impact | Current status | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| Package version mismatch at scaffold time | Build or peer dependency issues could delay development. | Reduced. Latest stable versions have been checked and a version lock has been created. | Use the pinned versions in `version-lock.md`. Run `next build` immediately after scaffold. Do not use beta/canary packages. | Technical lead |
| React Three Fiber and React future minor mismatch | Future React upgrade could break R3F peer range. | Open for future upgrades. Current React `19.2.7` satisfies R3F `>19 <19.3`. | Do not upgrade React beyond the pinned version without checking R3F and Drei peer ranges. | Frontend/3D lead |
| Client delay in providing Stripe ownership confirmation | Stripe payment flow cannot be safely finalized without account ownership, refund and accounting responsibility. | Open. | Send the commercial questions immediately. Default recommendation: Martis MV owns Stripe. | Client and commercial lead |
| Ambiguity around website-generated job definition | Commission disputes may happen if phone, WhatsApp, form, booking and payment leads are not defined. | Open. | Client must confirm what counts. Recommended rule: all identifiable sources count, but booking/payment are strongest proof. | Client and commercial lead |
| Neon vs MySQL mismatch | Neon is Postgres, while the source documentation specifies MySQL. | Identified. | If MySQL remains locked, choose PlanetScale or another MySQL-compatible database. Use Neon only if the project intentionally switches to Postgres. | Technical lead |
| VPS operations burden underestimated | A low-cost VPS can become more expensive in maintenance time, security, logging and deployment complexity. | Identified. | Recommend Vercel + PlanetScale for MVP. Use VPS only if client accepts operations scope. | Technical lead |
| Project deposits activated too early | Larger payment flows can create accounting/refund confusion before the first real workflow is proven. | Reduced by MVP decision. | Launch with `reservation_fee` and `consultation_fee`; defer `project_deposit`. | Client and backend lead |
| Commission cap double-counting | Repeated Stripe webhook delivery could duplicate commission. | Reduced by schema rule. | `stripe_session_id` must be unique. Webhooks must be idempotent. Commission query must count only paid payments once. | Backend lead |
| Missing real proof/photos | Premium design without real references may reduce trust and conversion. | Still open from project-wide plan. | Request photos and references in Phase 2. Use temporary branded visuals only as fallback. | Client and content lead |

## Risks That Must Close Before Build

- Stripe account owner.
- Refund/accounting owner.
- Website-generated job definition.
- Reservation fee amount.
- Consultation fee amount.
- Hosting/database final approval.

## Phase 1 Conclusion

The technical risks are manageable. The commercial risks now depend on client answers.
