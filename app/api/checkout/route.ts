import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { bookings, leads, payments } from "@/db/schema";
import {
  DEFAULT_CURRENCY,
  getPaymentAmountCents,
  PAYMENT_LABELS
} from "@/lib/commerce/config";
import { parseCheckoutInput } from "@/lib/commerce/requests";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

type InsertResult = [{ insertId: number }];

function getInsertId(result: unknown) {
  const insertId = (result as InsertResult)[0]?.insertId;
  if (typeof insertId !== "number" || insertId <= 0) {
    throw new Error("Database insert did not return an insert id.");
  }
  return insertId;
}

export async function POST(request: NextRequest) {
  try {
    const input = await parseCheckoutInput(request);
    const db = getDb();
    const stripe = getStripe();
    const now = new Date();
    const amountCents = getPaymentAmountCents(input.paymentType);

    const leadResult = await db.insert(leads).values({
      name: input.name,
      phone: input.phone,
      email: input.email,
      service: input.service,
      location: input.location,
      message: input.message,
      source: "website",
      status: "qualified",
      landingPage: input.landing_page,
      referrer: input.referrer,
      utmSource: input.utm_source,
      utmMedium: input.utm_medium,
      utmCampaign: input.utm_campaign,
      utmTerm: input.utm_term,
      utmContent: input.utm_content,
      consentAt: now,
      updatedAt: now
    });
    const leadId = getInsertId(leadResult);

    const bookingResult = await db.insert(bookings).values({
      leadId,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      message: input.message,
      photosNote: input.photosNote,
      bookingStatus: "requested",
      updatedAt: now
    });
    const bookingId = getInsertId(bookingResult);

    const paymentResult = await db.insert(payments).values({
      leadId,
      bookingId,
      paymentType: input.paymentType,
      amountCents,
      currency: DEFAULT_CURRENCY,
      paymentStatus: "pending",
      updatedAt: now
    });
    const paymentId = getInsertId(paymentResult);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.email,
      phone_number_collection: {
        enabled: true
      },
      success_url: absoluteUrl(`/booking/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl("/booking/cancel"),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: DEFAULT_CURRENCY,
            unit_amount: amountCents,
            product_data: {
              name: PAYMENT_LABELS[input.paymentType],
              description: "mv MARTIŠ - website payment"
            }
          }
        }
      ],
      metadata: {
        leadId: String(leadId),
        bookingId: String(bookingId),
        paymentId: String(paymentId),
        paymentType: input.paymentType,
        service: input.service,
        source: "website",
        landingPage: input.landing_page ?? "",
        utmSource: input.utm_source ?? "",
        utmMedium: input.utm_medium ?? "",
        utmCampaign: input.utm_campaign ?? ""
      }
    });

    await db
      .update(payments)
      .set({
        stripeSessionId: session.id,
        updatedAt: new Date()
      })
      .where(eq(payments.id, paymentId));

    return NextResponse.json({
      ok: true,
      leadId,
      bookingId,
      paymentId,
      checkoutUrl: session.url
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout creation failed.";
    const status = message.includes("DATABASE_URL") || message.includes("STRIPE_SECRET_KEY") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
