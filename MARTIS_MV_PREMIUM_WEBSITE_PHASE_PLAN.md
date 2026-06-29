# Martis MV Premium Website Phase Plan

Source analyzed: `Martis_MV_technical_documentation_NEXT19_refactor_EN.docx`

Working date: 2026-06-24

## 1. Executive Read

This project is not only a redesign. It is a premium local acquisition and payment system for Martis MV.

The technical documentation defines a website that must:

- Rank locally for renovation and construction service searches around Dubnica nad Vahom, Ilava, Trencin and surrounding areas.
- Turn visitors into measurable leads through phone, WhatsApp, forms and booking.
- Use Stripe Checkout for reservation fees, paid consultations, deposits and selected staged payments.
- Prove website-originated commercial value through lead, booking, payment and project records.
- Support the DCZ WebAgentura commission model: 35% commission from paid web-generated jobs until EUR 1,000 is repaid.
- Feel premium enough to increase trust, but never let 3D visuals harm SEO, speed or conversions.

The visual ambition is Awwwards-level, but the commercial rule is stricter:

> Every beautiful moment must either increase trust, clarify the service, reduce anxiety, or move the visitor closer to contact, booking or payment.

## 2. Technical Reality Check

The local documentation calls the target stack "Next.js 19 / React 19." Before implementation, we must verify the actual public stable versions and pin the real packages. At analysis time, the official Next.js docs list the latest version as `16.2.9`, so "NEXT19" should be treated as the document/project codename unless the package ecosystem changes before scaffold.

Architecture intent remains valid:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- React Three Fiber / Three.js
- GSAP ScrollTrigger
- Lenis smooth scroll
- Drizzle ORM
- MySQL
- Stripe Checkout and webhooks
- GA4 and Google Search Console

Implementation rule:

- Use the latest stable compatible Next.js version at scaffold time.
- Preserve the App Router, Route Handlers, metadata, sitemap, robots and server-rendered SEO architecture from the documentation.
- Do not build against a non-existent version number just to match the document title.

## 3. Existing Workspace Assets

Useful assets already present:

- `ducato_optimized.glb`
- `renders/fiat_ducato_x290_lowpoly.glb`
- `renders/fiat_ducato_x290_atlas.png`
- `renders/floating_glass.png`
- `tools/generate_ducato_x290_lowpoly.py`
- `tools/rebuild_ducato_scene.py`
- `tools/blender-mcp/`

Creative implication:

- The Ducato / service vehicle model can become the central "arrival, inspection, transformation, handover" object.
- The floating glass render suggests a premium material language: glass, reflection, precision, clean construction detail.
- The visual system should not feel like generic construction stock photography. It should feel like a crafted, technical, local service brand with high trust.

## 4. North Star

Build a premium, minimal, story-driven website that makes Martis MV feel more professional, more trustworthy and easier to hire than local competitors.

The website must do three jobs at once:

- Brand: make Martis MV feel premium, precise and reliable.
- Acquisition: rank for local service searches and turn visitors into inquiries.
- Monetization: allow serious customers to book, pay a reservation fee, buy consultation, or confirm a deposit through Stripe.

## 5. Money-First Product Rules

- Every key page must have one primary conversion path above the fold.
- Phone and WhatsApp must remain easy to access on mobile.
- Service pages must be written for real local buying intent, not generic SEO stuffing.
- Booking must be simple. It is an inspection or consultation request, not a complex tradesperson calendar.
- Stripe must be used first for small, serious-intent payments: EUR 20-50 reservation fee and EUR 50-150 consultation.
- Full job payment through the website is optional and only used when commercially/accounting-wise appropriate.
- Each conversion event must be measurable.
- The 3D layer is progressive enhancement. Text, CTAs, forms, booking and SEO must work without it.

## 6. Storytelling Concept

Working creative direction: "From raw space to finished trust."

The site should feel like a quiet premium construction film, not a loud portfolio page.

Story beats:

- Arrival: the Martis MV service vehicle enters a clean technical space.
- Inspection: measurements, glass planes and subtle grid overlays suggest precision.
- Material choice: tile, floor, plasterboard, sanitary and door materials appear as sculptural fragments.
- Transformation: surfaces align, seams close, rooms become cleaner.
- Proof: real references and before/after images take over from abstract 3D.
- Action: the visitor books inspection, sends photos or pays a reservation/consultation fee.

Visual tone:

- Minimal, spacious, technical, confident.
- Premium light and shadow, not over-decorated.
- Real work photos are the credibility layer; 3D is the memorability layer.
- Motion should feel precise and calm, not showy.

## 7. Phase Overview

Recommended project shape:

- Phase 1: Technical and commercial alignment
- Phase 2: Client materials and conversion strategy
- Phase 3: SEO architecture and content map
- Phase 4: Premium design system and art direction
- Phase 5: Blender and 3D production pipeline
- Phase 6: Next.js foundation and repository scaffold
- Phase 7: Core pages and service content system
- Phase 8: 3D, GSAP and Lenis interaction layer
- Phase 9: Forms, booking and lead capture
- Phase 10: Stripe monetization module
- Phase 11: Analytics, attribution and commission evidence
- Phase 12: Security, GDPR, accessibility and performance hardening
- Phase 13: Launch preparation and production release
- Phase 14: Post-launch revenue optimization

Approximate build window: 4-6 weeks, assuming client materials and credentials arrive quickly.

## Phase 1: Technical And Commercial Alignment

Goal:

- Turn the documentation into a signed-off build scope, verify technical assumptions and define the first commercial MVP.

Actions:

- Confirm whether "NEXT19" is a project label or a strict package version demand.
- Verify latest stable Next.js, React, Tailwind, Stripe SDK, Drizzle and Three.js package compatibility.
- Decide hosting target: Vercel, Node VPS or another provider with MySQL and Route Handler support.
- Confirm the commercial model: 35% commission from paid website-generated jobs until EUR 1,000.
- Confirm initial Stripe use case: reservation fee, paid consultation, project deposit, or all three.
- Define what counts as a website-generated job.
- Define whether project/commission records will be managed in the database, in a simple private admin view, or manually at first.

Deliverables:

- Locked MVP scope.
- Version decision note.
- Hosting decision.
- Stripe mode decision.
- Commission evidence rules.
- Risk list and dependencies.

Acceptance gate:

- We can explain the website in one sentence: "Local SEO brings the customer, the site builds trust, booking qualifies the lead, Stripe proves serious intent, and the database proves commission evidence."

## Phase 2: Client Materials And Conversion Strategy

Goal:

- Collect the commercial raw material needed to make the site credible and profitable.

Client inputs needed:

- Correct company name: Martis MV format, logo if available.
- Phone, email, WhatsApp number and billing data.
- Exact service list and priority order.
- Service areas: Dubnica nad Vahom, Ilava, Trencin and surrounding villages/towns.
- Real work photos: bathrooms, wall tiling, floor tiling, sanitary, floors, plasterboard, doors and frames.
- Reference stories: problem, location, work done, result, approximate duration.
- Pricing strategy for reservations and consultations.
- Stripe account access or decision who owns the Stripe account.
- Domain and Google Business Profile access.

Conversion decisions:

- Primary CTA: "Book an inspection."
- Secondary CTA: "Send photos on WhatsApp."
- Payment CTA: "Pay reservation fee" or "Order paid consultation."
- Trust CTA: "See references."
- Emergency/simple CTA: click-to-call.

Deliverables:

- Client material checklist.
- CTA map by page type.
- Payment offer definitions.
- Minimum viable proof set: 6-12 strong project photos or temporary branded visuals if real photos are missing.

Acceptance gate:

- We have enough real trust material to avoid a beautiful but empty website.

## Phase 3: SEO Architecture And Content Map

Goal:

- Build the exact local SEO structure before design and development so the site is indexable from day one.

Mandatory URL structure from the documentation:

- `/`
- `/sluzby/`
- `/sluzby/obklady/`
- `/sluzby/dlazby/`
- `/sluzby/omietky/`
- `/sluzby/podlahy/`
- `/sluzby/sanita/`
- `/sluzby/dvere-zarubne-kovania/`
- `/sluzby/sadrokarton/`
- `/rekonstrukcie-kupelni/`
- `/rekonstrukcie-bytov-domov/`
- `/referencie/`
- `/o-firme/`
- `/kontakt/`
- `/booking/`
- `/booking/success/`
- `/booking/cancel/`

SEO work:

- Build `lib/content/services.ts` as the single source of truth for service slugs, titles, descriptions, CTAs, FAQs and internal links.
- Define metadata for every page: title, description, canonical, Open Graph, locale and image.
- Define JSON-LD components: LocalBusiness, Service, FAQPage and BreadcrumbList.
- Build sitemap and robots through App Router metadata files.
- Map local intent: service + locality + problem.
- Avoid doorway-page spam. Localities should be naturally integrated into service pages unless there is enough unique content for separate locality pages later.
- Prepare FAQ content around customer objections: timing, deposits, photos, materials, inspection, guarantee, scope.

Deliverables:

- SEO keyword and page map.
- Service content schema.
- Internal linking plan.
- Metadata matrix.
- FAQ and schema plan.

Acceptance gate:

- Every commercial service has a search-intent page, a trust section and a conversion action.

## Phase 4: Premium Design System And Art Direction

Goal:

- Create the Awwwards-level visual system while keeping local service conversion clear.

Design principles:

- Minimal but not empty.
- Premium but not luxury for luxury's sake.
- Technical precision over decorative noise.
- Real local trust signals over generic visuals.
- Large visual moments only where they help story and conversion.
- Dense enough for service buyers to scan quickly.

Suggested visual language:

- Base: warm white, soft concrete, clean black, graphite.
- Accents: measured use of signal red/orange from construction markings and quiet green for success/payment states.
- Material cues: glass, brushed metal, tile edge, grid measurement lines, plaster dust, clean white ceramics.
- Typography: modern grotesk, high legibility, strong hierarchy.
- Layout: generous first viewport, sticky conversion bar, strong service cards, compact proof sections, clean booking form.

Key screens to design:

- Home hero with 3D story and immediate CTA.
- Service page template.
- Bathroom renovation sales page.
- References gallery/case study layout.
- Contact and booking flow.
- Stripe success/cancel states.
- Mobile sticky contact/booking UI.

Deliverables:

- Moodboard and visual references.
- Design tokens.
- Component inventory.
- Mobile-first wireframes.
- Desktop art direction.
- Motion storyboard.

Acceptance gate:

- The design can win attention in 5 seconds, but the visitor can still call/book/pay without thinking.

## Phase 5: Blender And 3D Production Pipeline

Goal:

- Produce a premium 3D layer that supports storytelling and stays lightweight enough for SEO and Core Web Vitals.

Asset strategy:

- Use `ducato_optimized.glb` as the first candidate for the hero/story vehicle.
- Use `renders/fiat_ducato_x290_lowpoly.glb` and atlas texture as the editable/source-style fallback.
- Use glass/material visuals as inspiration for a refined material system.
- Create mobile fallback images for every 3D-heavy moment.

Blender tasks:

- Audit model topology, scale, origins and object names.
- Clean unused meshes, materials, lights and cameras.
- Create named animation-ready parts if needed: van body, wheels, doors, tools, material slabs.
- Bake or simplify textures.
- Export GLB with compression strategy.
- Create LOD variants if necessary.
- Render fallback WebP/AVIF stills for mobile and reduced-motion users.
- Prepare material swatches: tile, glass, concrete, plaster, metal.

Performance budgets:

- Initial 3D asset should not block LCP.
- Hero must have a non-3D fallback.
- Prefer one persistent Canvas over many canvases.
- Clamp DPR on mobile.
- Lazy-load non-critical models.
- Keep the first interactive path usable before the 3D scene completes.

Deliverables:

- Optimized GLB asset set.
- Fallback still images.
- Model naming convention.
- 3D storyboard with scroll states.
- Asset budget report.

Acceptance gate:

- The 3D scene looks premium, loads responsibly and never hides the main CTA.

## Phase 6: Next.js Foundation And Repository Scaffold

Goal:

- Create the technical foundation with a clean App Router architecture and production-ready conventions.

Build tasks:

- Scaffold Next.js with TypeScript and Tailwind.
- Add linting, formatting and path aliases.
- Configure fonts, metadata defaults and global CSS variables.
- Create `app/layout.tsx`, `app/page.tsx`, service route folders and route handlers.
- Add `components/layout`, `components/marketing`, `components/forms`, `components/3d`, `components/analytics`.
- Add `lib/content`, `lib/seo`, `lib/stripe`, `lib/validation`, `lib/commission`, `lib/email`.
- Add `db/schema.ts`, `db/index.ts` and Drizzle config.
- Add environment variable template.
- Add staging noindex guard.

Deliverables:

- Running local app.
- Base routes created.
- Shared layout and navigation.
- Content and SEO helper structure.
- Initial CI/test commands.

Acceptance gate:

- The app runs locally, has all planned routes, and can render SEO-critical content server-side.

## Phase 7: Core Pages And Service Content System

Goal:

- Build the pages that sell the services and rank locally.

Pages:

- Home
- Services directory
- Dynamic service detail pages
- Bathroom renovation page
- Apartment/house renovation page
- References
- About
- Contact
- Booking
- Success/cancel payment pages

Content blocks:

- Hero with service promise and CTA.
- Local service area section.
- Trust markers: experience, process, photos, references.
- Service process: inspection, offer, execution, handover.
- FAQ.
- Related services.
- Conversion section.

Service data fields:

- slug
- label
- metaTitle
- metaDescription
- h1
- intro
- localities
- benefits
- processSteps
- faq
- primaryCta
- paymentType
- ogImage
- schema data

Deliverables:

- Complete route implementation.
- Content-driven service template.
- Internal links.
- Responsive layouts.
- Accessible headings and semantic HTML.

Acceptance gate:

- Each service page can stand alone as a useful landing page from Google.

## Phase 8: 3D, GSAP And Lenis Interaction Layer

Goal:

- Add the premium movement layer after the content and conversion structure are solid.

Interaction stack:

- React Three Fiber for the persistent Canvas.
- Three.js materials and cameras.
- GSAP ScrollTrigger for scroll-linked choreography.
- Lenis for smooth scroll.
- Reduced-motion and mobile fallbacks.

Implementation rules:

- Keep one scroll authority.
- Synchronize Lenis and ScrollTrigger carefully.
- Refresh ScrollTrigger after models/images load.
- Destroy animations correctly on route changes.
- Never pin important form controls in a way that harms mobile usability.
- Avoid scroll hijacking that makes the site feel trapped.
- Add `prefers-reduced-motion` behavior from the start.

Scene components:

- `SceneCanvas.tsx`
- `VehicleRig.tsx`
- `ScrollScene.tsx`
- `MaterialSystem.tsx`
- `PerformanceFallback.tsx`

Story moments:

- Hero arrival.
- Service reveal.
- Material transformation.
- Reference/proof handoff.
- Final CTA/payment moment.

Deliverables:

- Working scroll scene.
- Mobile fallback.
- Reduced-motion fallback.
- Performance profile.
- Visual QA screenshots.

Acceptance gate:

- The site feels premium with 3D, but still feels complete and profitable without 3D.

## Phase 9: Forms, Booking And Lead Capture

Goal:

- Build the lead engine and booking inquiry flow.

Form paths:

- Contact form.
- Service-specific inquiry.
- Booking/inspection request.
- WhatsApp photo CTA.
- Click-to-call.

Booking fields:

- Service
- Location
- Preferred date
- Preferred time window
- Name
- Phone
- Email
- Message
- Photos note or WhatsApp prompt
- Consent checkbox

Backend tasks:

- Zod schemas.
- Server Actions for contact and booking.
- Honeypot.
- Rate limiting.
- Origin/referrer checks.
- Database inserts for leads and bookings.
- Email notifications to company and customer.
- UTM/referrer/landing page capture.

Recommended schema additions beyond the base document:

- `landing_page`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `consent_at`
- `ip_hash` or privacy-safe rate-limit key

Deliverables:

- Contact Server Action.
- Booking Server Action.
- Lead/booking records.
- Notification emails.
- Form UX states.
- Spam protection.

Acceptance gate:

- A real visitor can submit an inquiry in under 60 seconds from mobile, and the business receives a usable lead.

## Phase 10: Stripe Monetization Module

Goal:

- Turn serious website interest into paid intent and measurable revenue.

Payment types:

- `reservation_fee`: EUR 20-50 inspection/appointment seriousness fee.
- `consultation_fee`: EUR 50-150 paid expert consultation.
- `project_deposit`: deposit after offer approval.
- `stage_payment`: optional later stage payment for larger jobs.

Stripe flow:

- Create Checkout Session in `app/api/checkout/route.ts`.
- Store pending payment linked to lead/booking.
- Include metadata: `leadId`, `bookingId`, `paymentType`, `service`, `source`.
- Redirect customer to Stripe Checkout.
- Return to `/booking/success/` or `/booking/cancel/`.
- Process webhook in `app/api/webhooks/stripe/route.ts`.
- Verify `Stripe-Signature` using raw body.
- Idempotently update payment status using unique `stripe_session_id`.
- Mark booking/lead as paid or qualified.
- Trigger confirmation email.

Security rules:

- Never store card data.
- Use server-only Stripe secret.
- Separate test and live keys.
- Verify webhook signature.
- Store amounts in cents.
- Keep idempotency and unique session constraints.

Deliverables:

- Checkout Route Handler.
- Stripe webhook.
- Success/cancel pages.
- Payment records.
- Test mode checklist.
- Live mode cutover checklist.

Acceptance gate:

- A test customer can complete payment and the database records exactly one successful paid event.

## Phase 11: Analytics, Attribution And Commission Evidence

Goal:

- Make the business model measurable and defensible.

Client-side events:

- `phone_click`
- `whatsapp_click`
- `form_submit`
- `booking_submit`
- `checkout_started`
- `payment_success`
- `service_cta_click`
- `reference_view`
- `scroll_depth`
- `reduced_motion_fallback_used`

Server-side evidence:

- Lead record.
- Booking record.
- Stripe payment record.
- Project record.
- Commission calculation.
- Source, UTM, landing page and referrer fields.

Commission logic:

- Commission rate: 35%.
- Cap: EUR 1,000 total.
- Calculate from paid amounts connected to website-generated jobs.
- Store final values in cents.
- Avoid duplicate commission from repeated webhook delivery.

Deliverables:

- Analytics wrapper.
- GA4 event map.
- Search Console setup plan.
- Commission helper.
- Basic revenue/lead evidence view or export.

Acceptance gate:

- For a closed job, we can trace: landing page -> lead -> booking/payment -> project -> commission amount.

## Phase 12: Security, GDPR, Accessibility And Performance Hardening

Goal:

- Make the premium site safe, compliant enough for launch and fast on real devices.

Security:

- HTTPS only.
- Environment variables.
- Restricted database permissions.
- Secure webhook secret.
- No card storage.
- Rate limiting.
- Validation on server.
- Sanitized user input.
- Backups.

GDPR:

- Privacy policy.
- Form consent.
- Cookie/analytics consent if GA4 or marketing cookies are used.
- Clear payment terms for deposits and consultations.
- Legal review for terms/refunds if needed.

Accessibility:

- Semantic headings.
- Keyboard navigation.
- Visible focus states.
- Reduced motion.
- Contrast checks.
- Descriptive alt text.
- Forms with labels and errors.

Performance:

- LCP <= 2.5s target.
- INP <= 200ms target.
- CLS <= 0.1 target.
- 3D must not block critical content.
- Images WebP/AVIF.
- Lazy-load non-critical assets.
- Route-level code splitting.
- Mobile WebGL fallback.

Deliverables:

- Security checklist.
- GDPR checklist.
- Accessibility pass.
- Lighthouse/PageSpeed pass.
- Core Web Vitals remediation list.

Acceptance gate:

- The site feels premium on high-end devices and still converts cleanly on ordinary mobile phones.

## Phase 13: Launch Preparation And Production Release

Goal:

- Launch cleanly without SEO, Stripe or tracking mistakes.

Pre-launch checklist:

- Domain owned by client.
- DNS configured.
- HTTPS active.
- Production environment variables set.
- Stripe live keys and live webhook configured.
- Test mode disabled for production.
- Sitemap generated.
- Robots indexing enabled.
- Canonicals correct.
- Open Graph images correct.
- Google Search Console verified.
- GA4 installed and events tested.
- Noindex removed from production.
- 404 and error pages clean.
- Forms tested on desktop and mobile.
- Booking tested.
- Phone and WhatsApp links tested.
- Payment success/cancel tested.
- Webhook tested.
- Database backup plan active.

Deliverables:

- Production deployment.
- Launch QA report.
- Access handover list.
- First 7-day monitoring plan.

Acceptance gate:

- A real customer can find the page, understand the offer, contact the company, book an inspection and pay a reservation fee.

## Phase 14: Post-Launch Revenue Optimization

Goal:

- Improve revenue after launch using real data, not guesses.

First 7 days:

- Monitor uptime, errors, forms and Stripe webhooks.
- Submit sitemap.
- Check Search Console indexing.
- Watch GA4 high-intent events.
- Fix any friction in mobile CTAs.

First 30 days:

- Review top pages and weak pages.
- Improve title/meta on low CTR pages.
- Add missing FAQs from real calls.
- Add real project references.
- Tune CTA copy and placement.
- Check if reservation fee reduces low-quality inquiries.
- Compare phone vs WhatsApp vs booking conversion.

Growth work:

- Add reference case studies.
- Add before/after galleries.
- Add Google Business Profile posts.
- Build more location-supported service content only where useful.
- Test paid consultation offer.
- Add payment links for deposits after offer approval.

Acceptance gate:

- The site is no longer just launched. It is learning which services, pages and CTAs create money.

## 8. Suggested Day-By-Day Kickoff

Day 1:

- Confirm scope, stack reality, hosting, Stripe ownership and commission rules.
- Create materials checklist for client.
- Decide the first Stripe offer.

Day 2:

- Build SEO page map and service content model.
- Confirm mandatory slugs.
- Draft conversion flow for home, service pages and booking.

Day 3:

- Create visual direction, moodboard and motion storyboard.
- Decide 3D motif: vehicle-first, tool/material-first, or combined.

Day 4:

- Audit and optimize existing 3D assets in Blender.
- Define GLB/fallback asset budgets.

Day 5:

- Scaffold Next.js app.
- Create route structure, layout, SEO helpers and content data files.

Days 6-10:

- Build core pages and responsive components.
- Implement service templates and metadata.

Days 11-15:

- Add 3D Canvas, Lenis, GSAP story scene and fallbacks.
- Test performance early before adding more polish.

Days 16-20:

- Build forms, booking, database schema and notifications.

Days 21-24:

- Add Stripe Checkout, webhooks, success/cancel pages and payment records.

Days 25-30:

- Add analytics, attribution, commission evidence, security/GDPR, performance pass and launch QA.

## 9. Non-Negotiable Quality Gates

- No 3D element may block SEO-critical content.
- No page launches without metadata, canonical and one H1.
- No payment flow launches without tested webhook signature verification.
- No form launches without server validation and spam protection.
- No production launch without Search Console and sitemap.
- No mobile launch without sticky phone/WhatsApp/booking access.
- No commission claim without lead/payment/project evidence.
- No Awwwards-style animation that makes conversion harder.

## 10. Open Decisions

- Exact stable Next.js/React package versions at scaffold time.
- Whether Stripe is owned by Martis MV or DCZ WebAgentura.
- Exact reservation fee and consultation fee.
- Whether deposits are enabled at launch or after first client workflow test.
- Whether a lightweight private admin/export is needed in MVP.
- Whether real reference photos are available before launch.
- Whether the 3D story should center on the service vehicle, material transformation, or a combined sequence.
- Whether legal texts will be supplied by client/lawyer or drafted as placeholders for review.

## 11. Risk Register

Risk: Public package version mismatch.

- Why it matters: The source document names Next.js 19, but current official docs must decide the real package version.
- Prevention: Verify package versions before scaffold and document the pinned decision.
- Owner: technical lead.

Risk: 3D becomes beautiful but hurts conversion.

- Why it matters: WebGL can slow LCP, distract from CTAs or create mobile friction.
- Prevention: Server-render content first, lazy-load 3D, create fallbacks, test reduced motion and mobile early.
- Owner: frontend/3D lead.

Risk: Stripe ownership or legal/payment rules are unclear.

- Why it matters: Deposits, consultations and refunds must match the client's accounting and legal process.
- Prevention: Confirm Stripe account owner, payment labels, terms, refunds and live-mode responsibility before launch.
- Owner: client and commercial lead.

Risk: Real photos arrive late.

- Why it matters: Premium design without real proof can feel fake and reduce trust.
- Prevention: Request photos on Day 1, use temporary branded visuals only as a short-term fallback, replace before final launch where possible.
- Owner: client and content lead.

Risk: Local SEO expectations are too immediate.

- Why it matters: SEO compounds over weeks and months, not overnight.
- Prevention: Launch technically correct pages, submit sitemap, connect Search Console, then iterate references/FAQs/content after real data appears.
- Owner: SEO lead.

Risk: Commission evidence is disputed.

- Why it matters: The business model depends on proving website-generated value fairly.
- Prevention: Store source, landing page, UTM/referrer, lead, booking, payment and project records with timestamps.
- Owner: backend lead and commercial lead.

Risk: GDPR/cookie consent is skipped.

- Why it matters: The site processes contact data and may use analytics/marketing cookies.
- Prevention: Add privacy policy, consent text, cookie handling and legal review gate.
- Owner: client and technical lead.

## 12. Official Documentation Verification Notes

Use these sources again at implementation time before coding the affected modules:

- Next.js docs: https://nextjs.org/docs
- Stripe Checkout docs: https://docs.stripe.com/checkout/quickstart
- Stripe webhook signature docs: https://docs.stripe.com/webhooks/signature
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis repository/docs: https://github.com/darkroomengineering/lenis

## 13. Final Build Principle

The final site should feel like a EUR 10,000 premium website, but it must behave like a disciplined sales tool:

- Local SEO brings qualified visitors.
- Story and proof create trust.
- CTAs remove hesitation.
- Booking creates intent.
- Stripe creates commitment.
- Analytics and database records prove commercial value.

That is the difference between a beautiful website and a website that makes money.
