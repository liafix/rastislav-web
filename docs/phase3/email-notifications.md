# Phase 3 Email Notifications

Phase 3 adds SMTP notifications for revenue events. Notifications are server-side only and disabled unless `EMAIL_NOTIFICATIONS_ENABLED="true"`.

## Environment

Required in production when notifications are enabled:

- `EMAIL_NOTIFICATIONS_ENABLED="true"`
- `EMAIL_PROVIDER="smtp"`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SMTP_REPLY_TO`
- `OWNER_NOTIFICATION_EMAIL`

Only `NEXT_PUBLIC_SITE_URL` is public. All SMTP and notification variables are server-only and must not be exposed to client components.

## Events

- `checkout.session.completed`: sends owner paid-booking notification and customer confirmation.
- `checkout.session.expired`: sends owner recovery notification only when a payment is newly marked `cancelled`.
- `/api/leads`: sends owner-only unpaid lead notification after the lead is stored.

`payment_intent.payment_failed` emails are intentionally not included in Phase 3.

## Failure behavior

Email delivery is best-effort. SMTP failures do not undo lead creation, payment updates, or webhook processing. Stripe duplicate webhook events do not send duplicate emails because notification sending happens only after a new Stripe event is recorded and a local payment state transition succeeds.
