# Phase 1 Stripe Setup Definition

Status: MVP specification only

Live keys: not used yet

## Decision

For MVP launch, Stripe will support:

- `reservation_fee`
- `consultation_fee`

Project deposits are deferred until the first real client workflow is tested and the client confirms accounting/refund handling.

## Payment Types

| Payment type | Default amount | Purpose | Launch status |
| --- | ---: | --- | --- |
| `reservation_fee` | EUR 30 | Customer pays to confirm a serious inspection or appointment request. | Enabled in MVP after client approval. |
| `consultation_fee` | EUR 80 | Customer pays for expert renovation/service consultation. | Enabled in MVP after client approval. |
| `project_deposit` | To be agreed per project | Customer pays deposit after accepting an offer. | Deferred. |

## Checkout Session Creation Flow

1. Customer submits a booking or consultation request.
2. Server validates the request.
3. Server creates or updates a `lead` record.
4. Server creates a `booking` record when the payment is tied to an inspection.
5. Server creates a pending `payment` record.
6. Server creates a Stripe Checkout Session in `payment` mode.
7. Server sends only trusted price information to Stripe. Amounts are not accepted from the browser.
8. Customer is redirected to Stripe Checkout.
9. Customer returns to `/booking/success/` or `/booking/cancel/`.
10. The webhook remains the source of truth for successful payment.

## Checkout Session Metadata

Required metadata:

| Field | Example | Purpose |
| --- | --- | --- |
| `leadId` | `123` | Connects payment to lead evidence. |
| `paymentType` | `reservation_fee` | Distinguishes reservation vs consultation. |
| `service` | `obklady` | Shows which service created intent. |
| `source` | `website` | Confirms website-originated payment. |

Optional metadata:

| Field | Example | Purpose |
| --- | --- | --- |
| `bookingId` | `44` | Connects payment to inspection booking. |
| `landingPage` | `/sluzby/obklady/` | Helps prove source page. |
| `utmSource` | `google` | Marketing attribution. |
| `utmMedium` | `organic` | Marketing attribution. |
| `utmCampaign` | `local-seo` | Marketing attribution. |

## Webhook Processing

Webhook endpoint:

- `/api/webhooks/stripe`

Processing rules:

- Use the Node.js runtime.
- Read the raw request body.
- Verify the `Stripe-Signature` header using the webhook endpoint secret.
- Reject events with invalid signatures.
- Process successful Checkout completion events.
- Find the local `payment` by `stripe_session_id`.
- Update payment status idempotently.
- Store `paid_at` only once.
- Mark the connected lead or booking as paid/qualified.
- Send confirmation emails after verified payment.

## Idempotency Rule

`payments.stripe_session_id` must be unique.

Reason:

- Stripe may deliver the same webhook more than once.
- A repeated webhook must not create duplicate payments.
- A repeated webhook must not double-count commission.

## Payment Record States

Recommended statuses:

- `created`
- `pending`
- `paid`
- `failed`
- `refunded`
- `cancelled`

## Security Rules

- Never store card data.
- Never expose the Stripe secret key to the browser.
- Use test keys only during development.
- Use live keys only after final launch approval.
- Keep success and cancel URLs public and stable.
- Use Stripe webhooks as payment truth, not only the success redirect.
- Store all money values in cents.

## Environment Variables To Define Later

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Do not create or request live credentials during Phase 1.

## Sources

- Stripe Checkout docs: https://docs.stripe.com/checkout/quickstart
- Stripe webhook signature docs: https://docs.stripe.com/webhooks/signature
- Next.js Route Handler docs: https://nextjs.org/docs/app/api-reference/file-conventions/route
