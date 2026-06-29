# Phase 1 Commission Evidence Schema

## Goal

The database must prove the commercial path:

visitor source -> lead -> booking or payment -> project -> commission evidence

The website does not need a full CRM in MVP. It needs enough data to fairly prove website-generated revenue and calculate the 35% commission until the EUR 1,000 cap is reached.

## Attribution Fields

Add these fields to `leads`:

| Field | Purpose |
| --- | --- |
| `landing_page` | First or submitted page where the customer converted. |
| `referrer` | Browser referrer, when available. |
| `utm_source` | Campaign source, for example `google`. |
| `utm_medium` | Campaign medium, for example `organic`, `cpc`, `whatsapp`. |
| `utm_campaign` | Campaign name. |
| `utm_term` | Search/ad term, if provided. |
| `utm_content` | Ad or CTA variant, if provided. |

Recommended existing fields retained:

- `source`
- `status`
- `service`
- `location`
- `created_at`

## Commission Fields

Add these fields to `projects`:

| Field | Purpose |
| --- | --- |
| `commission_percent` | Commission rate for the job. Default: `35.00`. |
| `commission_cap_cents` | Total cap for the commission model. Default: `100000` cents, equal to EUR 1,000. |
| `commission_earned_cents` | Actual earned commission after applying the cap. |

Money must be stored in cents to avoid rounding problems.

## Table Descriptions

### `leads`

Purpose:

- Records every inquiry or identifiable website-originated customer action.

Key fields:

- `id`
- `name`
- `phone`
- `email`
- `service`
- `location`
- `source`
- `status`
- `landing_page`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `created_at`

### `bookings`

Purpose:

- Records inspection or consultation requests tied to a lead.

Key fields:

- `id`
- `lead_id`
- `preferred_date`
- `preferred_time`
- `message`
- `photos_note`
- `booking_status`

### `payments`

Purpose:

- Records Stripe payment status without storing card data.

Key fields:

- `id`
- `lead_id`
- `stripe_session_id`
- `payment_type`
- `amount_cents`
- `currency`
- `payment_status`
- `paid_at`

Rules:

- `stripe_session_id` must be unique.
- `payment_status = paid` is the strongest proof of serious website intent.
- `payment_type` starts with `reservation_fee` and `consultation_fee`.

### `projects`

Purpose:

- Records closed jobs and commission evidence.

Key fields:

- `id`
- `lead_id`
- `final_value_cents`
- `commission_percent`
- `commission_cap_cents`
- `commission_earned_cents`
- `commission_paid_cents`
- `project_status`
- `created_at`

## Evidence Strength

| Source | Evidence strength | Rule |
| --- | --- | --- |
| Stripe payment | Strongest | Payment is recorded directly by webhook. |
| Booking form | Strong | Lead and booking are stored with timestamp. |
| Contact form | Strong | Lead is stored with timestamp and service. |
| WhatsApp click | Medium | Counts only if matched by phone/name/message. |
| Phone click | Medium | Counts only if matched by phone/name/job details. |

## Sample Commission Query

This query calculates raw paid value per project, then applies the global EUR 1,000 cap in chronological project order.

Assumptions:

- MySQL 8 window functions are available.
- `commission_percent` is stored as `35.00`.
- `commission_cap_cents` is `100000`.
- Only `payments.payment_status = 'paid'` counts.

```sql
WITH paid_by_project AS (
  SELECT
    p.id AS project_id,
    p.lead_id,
    MIN(pay.paid_at) AS first_paid_at,
    COALESCE(SUM(pay.amount_cents), 0) AS paid_cents,
    p.commission_percent,
    p.commission_cap_cents
  FROM projects p
  JOIN payments pay ON pay.lead_id = p.lead_id
  WHERE pay.payment_status = 'paid'
  GROUP BY
    p.id,
    p.lead_id,
    p.commission_percent,
    p.commission_cap_cents
),
raw_commission AS (
  SELECT
    project_id,
    lead_id,
    first_paid_at,
    paid_cents,
    ROUND(paid_cents * (commission_percent / 100)) AS raw_commission_cents,
    commission_cap_cents
  FROM paid_by_project
),
with_previous AS (
  SELECT
    *,
    COALESCE(
      SUM(raw_commission_cents) OVER (
        ORDER BY first_paid_at, project_id
        ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
      ),
      0
    ) AS previous_raw_commission_cents
  FROM raw_commission
)
SELECT
  project_id,
  lead_id,
  paid_cents,
  raw_commission_cents,
  LEAST(
    raw_commission_cents,
    GREATEST(0, commission_cap_cents - previous_raw_commission_cents)
  ) AS commission_earned_cents
FROM with_previous
ORDER BY first_paid_at, project_id;
```

## Implementation Decision

- Attribution fields belong primarily on `leads`.
- Payment proof belongs on `payments`.
- Commission fields belong on `projects`.
- The app should copy or summarize calculated commission into `projects.commission_earned_cents` after a job is confirmed, so the number remains auditable even if business rules change later.
