import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getDb } from "@/db";
import { bookings, leads, payments, stripeWebhookEvents } from "@/db/schema";
import { assertStripeWebhookConfig, getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

type Database = ReturnType<typeof getDb>;
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

function paymentIntentIdFromSession(session: Stripe.Checkout.Session) {
  if (!session.payment_intent) return undefined;
  return typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
}

function resourceIdFromEvent(event: Stripe.Event) {
  const object = event.data.object as { id?: string };
  return object.id;
}

function metadataPaymentId(metadata?: Stripe.Metadata | null) {
  const rawPaymentId = metadata?.paymentId;
  if (!rawPaymentId) return undefined;

  const paymentId = Number.parseInt(rawPaymentId, 10);
  return Number.isSafeInteger(paymentId) && paymentId > 0 ? paymentId : undefined;
}

function isDuplicateEntryError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  const maybeError = error as { code?: unknown; errno?: unknown; message?: unknown };

  return maybeError.code === "ER_DUP_ENTRY" || maybeError.errno === 1062 || String(maybeError.message || "").includes("Duplicate entry");
}

async function recordStripeEvent(tx: Transaction, event: Stripe.Event, resourceId?: string) {
  try {
    await tx.insert(stripeWebhookEvents).values({
      stripeEventId: event.id,
      eventType: event.type,
      resourceId
    });
    return true;
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return false;
    }

    throw error;
  }
}

async function markStripeEventProcessed(tx: Transaction, event: Stripe.Event) {
  await tx
    .update(stripeWebhookEvents)
    .set({
      processedAt: new Date(),
      errorMessage: null
    })
    .where(eq(stripeWebhookEvents.stripeEventId, event.id));
}

async function handleCheckoutCompleted(tx: Transaction, session: Stripe.Checkout.Session) {
  const existing = await tx.select().from(payments).where(eq(payments.stripeSessionId, session.id)).limit(1);
  const payment = existing[0];

  if (!payment) {
    throw new Error(`Payment not found for Stripe session ${session.id}.`);
  }

  if (payment.paymentStatus === "paid") {
    return { status: "already_paid" };
  }

  const now = new Date();

  await tx
    .update(payments)
    .set({
      paymentStatus: "paid",
      stripePaymentIntentId: paymentIntentIdFromSession(session),
      paidAt: now,
      updatedAt: now
    })
    .where(eq(payments.stripeSessionId, session.id));

  await tx
    .update(leads)
    .set({
      status: "paid",
      updatedAt: now
    })
    .where(eq(leads.id, payment.leadId));

  if (payment.bookingId) {
    await tx
      .update(bookings)
      .set({
        bookingStatus: "paid",
        updatedAt: now
      })
      .where(eq(bookings.id, payment.bookingId));
  }

  return { status: "paid" };
}

async function handleCheckoutExpired(tx: Transaction, session: Stripe.Checkout.Session) {
  const existing = await tx.select().from(payments).where(eq(payments.stripeSessionId, session.id)).limit(1);
  const payment = existing[0];

  if (!payment) {
    throw new Error(`Payment not found for expired Stripe session ${session.id}.`);
  }

  if (payment.paymentStatus === "paid") {
    return { status: "already_paid" };
  }

  await tx
    .update(payments)
    .set({
      paymentStatus: "cancelled",
      stripePaymentIntentId: paymentIntentIdFromSession(session),
      updatedAt: new Date()
    })
    .where(eq(payments.stripeSessionId, session.id));

  return { status: "cancelled" };
}

async function handlePaymentIntentFailed(tx: Transaction, paymentIntent: Stripe.PaymentIntent) {
  const paymentId = metadataPaymentId(paymentIntent.metadata);
  const existing = paymentId
    ? await tx.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
    : await tx.select().from(payments).where(eq(payments.stripePaymentIntentId, paymentIntent.id)).limit(1);
  const payment = existing[0];

  if (!payment) {
    return { status: "unmatched" };
  }

  if (payment.paymentStatus === "paid") {
    return { status: "already_paid" };
  }

  await tx
    .update(payments)
    .set({
      paymentStatus: "checkout_failed",
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: new Date()
    })
    .where(eq(payments.id, payment.id));

  return { status: "checkout_failed" };
}

async function processStripeEvent(tx: Transaction, event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    return handleCheckoutCompleted(tx, event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "checkout.session.expired") {
    return handleCheckoutExpired(tx, event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "payment_intent.payment_failed") {
    return handlePaymentIntentFailed(tx, event.data.object as Stripe.PaymentIntent);
  }

  return { status: "ignored", event: event.type };
}

export async function POST(request: NextRequest) {
  try {
    assertStripeWebhookConfig();

    const stripe = getStripe();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ ok: false, error: "Missing Stripe signature." }, { status: 400 });
    }

    const rawBody = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is required for Stripe webhooks.");
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    const db = getDb();

    const result = await db.transaction(async (tx) => {
      const inserted = await recordStripeEvent(tx, event, resourceIdFromEvent(event));

      if (!inserted) {
        return { duplicate: true };
      }

      const processed = await processStripeEvent(tx, event);
      await markStripeEventProcessed(tx, event);

      return processed;
    });

    return NextResponse.json({ ok: true, event: event.type, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook failed.";
    const status =
      message.includes("DATABASE_URL") || message.includes("STRIPE_SECRET_KEY") || message.includes("STRIPE_WEBHOOK_SECRET")
        ? 503
        : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
