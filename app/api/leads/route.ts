import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { bookings, leads } from "@/db/schema";
import { parseLeadInput } from "@/lib/commerce/requests";

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
    const input = await parseLeadInput(request);
    const db = getDb();
    const now = new Date();

    const leadResult = await db.insert(leads).values({
      name: input.name,
      phone: input.phone,
      email: input.email,
      service: input.service,
      location: input.location,
      message: input.message,
      source: "website",
      status: "new",
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

    let bookingId: number | undefined;

    if (input.preferredDate || input.preferredTime) {
      const bookingResult = await db.insert(bookings).values({
        leadId,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        message: input.message,
        photosNote: input.photosNote,
        bookingStatus: "requested",
        updatedAt: now
      });
      bookingId = getInsertId(bookingResult);
    }

    return NextResponse.json({ ok: true, leadId, bookingId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lead creation failed.";
    const status = message.includes("DATABASE_URL") ? 503 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
