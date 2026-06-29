# Martis MV Shared Implementation Contracts

Status: locked for parallel agent execution

Purpose: give every implementation agent the same names, boundaries, and data handoff rules before feature work starts.

Typed source of truth: `lib/contracts.ts`

## Non-Negotiable Rules

- WebGL is progressive enhancement. SEO content, CTAs, forms, and service copy must remain readable without WebGL.
- WebGL must not contain business copy. All important text belongs in semantic DOM.
- DOM sections that participate in the scroll story must expose `data-scene-stage`.
- Payment MVP includes only `reservation_fee` and `consultation_fee`.
- `project_deposit` and `stage_payment` are deferred until a later commercial/accounting decision.
- Large source GLB files are not production payloads. Optimized variants or fallback posters must be used for shipping.

## Scene Contract

Allowed scene stages:

| Stage | Purpose | Default model | Motion intensity |
| --- | --- | --- | --- |
| `hero` | Cinematic first impression and primary CTA | `chair` | `high` |
| `value` | Quiet trust/value statement | `chair` | `rest` |
| `craft` | Detail and craftsmanship scene | `nightstand` | `medium` |
| `services` | Service showroom and offer architecture | `coffeeTable` | `high` |
| `proof` | References, trust proof, outcomes | `sideTable` | `medium` |
| `booking` | Conversion and serious-intent CTA | `sideTable` | `medium` |
| `footer` | Calm close and utility links | `ducato` | `rest` |

Required DOM attributes:

```tsx
<section
  data-scene-stage="services"
  data-scene-model="coffeeTable"
  data-scene-intensity="high"
>
  ...
</section>
```

Only `data-scene-stage` is mandatory. `data-scene-model` and `data-scene-intensity` may be inferred from `SCENE_STAGE_MODEL_MAP` and `SCENE_STAGE_INTENSITY_MAP`.

## Model Contract

Allowed model keys:

| Key | Intended use |
| --- | --- |
| `chair` | Hero authority, premium finished interior |
| `nightstand` | Detail, craft, precision |
| `coffeeTable` | Service system and offer hub |
| `sideTable` | Proof, handoff, booking close |
| `ducato` | Optional local service/arrival accent |

WebGL agents may transform, light, or transition these models, but must not rename the keys.

## Service Content Contract

Allowed service slugs:

- `obklady`
- `dlazby`
- `omietky`
- `podlahy`
- `sanita`
- `dvere-zarubne-kovania`
- `sadrokarton`
- `rekonstrukcie-interieru`

Minimum service fields:

| Field | Requirement |
| --- | --- |
| `slug` | Must be one of the allowed service slugs. |
| `label` | Short UI label. |
| `h1` | Page headline. |
| `intro` | Crawlable service introduction. |
| `localities` | Local SEO areas. |
| `primaryCta` | Main conversion action. |

Optional content fields:

- `metaTitle`
- `metaDescription`
- `benefits`
- `processSteps`
- `faq`
- `paymentType`

## Payment Contract

Allowed launch payment types:

| Payment type | Purpose |
| --- | --- |
| `reservation_fee` | Serious-intent inspection or appointment fee. |
| `consultation_fee` | Paid expert consultation. |

Deferred payment types:

- `project_deposit`
- `stage_payment`

Checkout metadata must include:

| Field | Type |
| --- | --- |
| `leadId` | string |
| `paymentType` | `reservation_fee` or `consultation_fee` |
| `service` | allowed service slug |
| `source` | `website` |

Optional checkout metadata:

- `bookingId`
- `landing_page`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

## Attribution Contract

Attribution fields:

- `landing_page`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

Primary storage owner: leads.

Payment proof owner: payments.

Commission evidence owner: projects.

## Analytics Event Contract

Allowed event names:

- `phone_click`
- `whatsapp_click`
- `form_start`
- `form_submit`
- `booking_start`
- `booking_submit`
- `checkout_started`
- `payment_success`
- `payment_cancelled`
- `service_cta_click`
- `reference_view`
- `scroll_depth`
- `reduced_motion_fallback_used`
- `webgl_fallback_used`

Optional event dimensions:

- `service`
- `stage`
- `paymentType`
- `valueCents`
- attribution fields

## Agent Boundaries

| Agent | May own | Must not own |
| --- | --- | --- |
| WebGL/Shader | Canvas, model loading, shader uniforms, camera timelines, fallbacks | Business copy, Stripe, Drizzle schema |
| Frontend/Motion | DOM sections, layout, CTA placement, GSAP DOM motion | Stripe webhook, database schema, GLB optimization internals |
| Content/SEO | Service content, metadata-ready fields, FAQs, internal links | WebGL transforms, shader code, checkout implementation |
| Data/Commerce | Lead/payment/project contracts, Stripe metadata, attribution storage | Visual design, scroll choreography, 3D assets |
| QA/Integration | Build checks, screenshots, console logs, regression report | Large feature rewrites without owning agent agreement |

## Integration Checklist

- Every scroll-story section has a valid `data-scene-stage`.
- Every service slug matches `SERVICE_SLUGS`.
- Every payment type matches `PAYMENT_TYPES`.
- WebGL still renders nothing business-critical.
- Reduced motion and WebGL failure still leave the page complete.
- Build and TypeScript checks pass before merging parallel work.
