import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { getDb } from "@/db";
import { bookings, leads, payments } from "@/db/schema";
import { assertStripeWebhookConfig, getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

function paymentIntentIdFromSession(session: Stripe.Checkout.Session) {
  if (!session.payment_intent) return undefined;
  return typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const db = getDb();
  const existing = await db.select().from(payments).where(eq(payments.stripeSessionId, session.id)).limit(1);
  const payment = existing[0];

  if (!payment) {
    throw new Error(`Payment not found for Stripe session ${session.id}.`);
  }

  if (payment.paymentStatus === "paid") {
    return { status: "already_paid" };
  }

  const now = new Date();

  await db
    .update(payments)
    .set({
      paymentStatus: "paid",
      stripePaymentIntentId: paymentIntentIdFromSession(session),
      paidAt: now,
      updatedAt: now
    })
    .where(eq(payments.stripeSessionId, session.id));

  await db
    .update(leads)
    .set({
      status: "paid",
      updatedAt: now
    })
    .where(eq(leads.id, payment.leadId));

  if (payment.bookingId) {
    await db
      .update(bookings)
      .set({
        bookingStatus: "paid",
        updatedAt: now
      })
      .where(eq(bookings.id, payment.bookingId));
  }

  return { status: "paid" };
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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await handleCheckoutCompleted(session);
      return NextResponse.json({ ok: true, event: event.type, result });
    }

    return NextResponse.json({ ok: true, ignored: event.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook failed.";
    const status =
      message.includes("DATABASE_URL") || message.includes("STRIPE_SECRET_KEY") || message.includes("STRIPE_WEBHOOK_SECRET")
        ? 503
        : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
