import type { NextRequest } from "next/server";
import {
  ATTRIBUTION_FIELDS,
  isPaymentType,
  isServiceSlug
} from "@/lib/contracts";
import type { AttributionPayload, PaymentType, ServiceSlug } from "@/lib/contracts";
import { getService } from "@/lib/content/services";

export type LeadInput = AttributionPayload & {
  name: string;
  phone: string;
  email?: string;
  service: ServiceSlug;
  location: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  photosNote?: string;
  consent: boolean;
};

export type CheckoutInput = LeadInput & {
  paymentType: PaymentType;
};

type JsonRecord = Record<string, unknown>;

function stringValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

function booleanValue(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function readAttribution(body: JsonRecord, request: NextRequest): AttributionPayload {
  const attributionSource =
    typeof body.attribution === "object" && body.attribution !== null ? (body.attribution as JsonRecord) : body;
  const payload: AttributionPayload = {};

  for (const field of ATTRIBUTION_FIELDS) {
    const value = stringValue(attributionSource[field], 512);
    if (value) payload[field] = value;
  }

  if (!payload.referrer) {
    const referer = request.headers.get("referer");
    if (referer) payload.referrer = referer.slice(0, 512);
  }

  if (!payload.landing_page) {
    payload.landing_page = stringValue(body.landingPage, 512) || stringValue(body.landing_page, 512);
  }

  return payload;
}

function parseLeadBody(body: JsonRecord, request: NextRequest): LeadInput {
  const service = stringValue(body.service, 96);

  if (!service || !isServiceSlug(service) || !getService(service)) {
    throw new Error("Invalid service.");
  }

  const name = stringValue(body.name, 191);
  const phone = stringValue(body.phone, 64);
  const location = stringValue(body.location, 191);
  const consent = booleanValue(body.consent);

  if (!name) throw new Error("Name is required.");
  if (!phone) throw new Error("Phone is required.");
  if (!location) throw new Error("Location is required.");
  if (!consent) throw new Error("Consent is required.");

  return {
    ...readAttribution(body, request),
    name,
    phone,
    email: stringValue(body.email, 191),
    service,
    location,
    message: stringValue(body.message, 3000),
    preferredDate: stringValue(body.preferredDate ?? body.date, 32),
    preferredTime: stringValue(body.preferredTime ?? body.time, 64),
    photosNote: stringValue(body.photosNote ?? body.photos_note, 1000),
    consent
  };
}

export async function parseLeadInput(request: NextRequest): Promise<LeadInput> {
  const body = (await request.json()) as JsonRecord;
  return parseLeadBody(body, request);
}

export async function parseCheckoutInput(request: NextRequest): Promise<CheckoutInput> {
  const body = (await request.json()) as JsonRecord;
  const paymentTypeRaw = stringValue(body.paymentType ?? body.payment_type, 64);
  const leadInput = parseLeadBody(body, request);
  const service = getService(leadInput.service);
  const paymentType = paymentTypeRaw && isPaymentType(paymentTypeRaw) ? paymentTypeRaw : service?.paymentType;

  if (!paymentType || !isPaymentType(paymentType)) {
    throw new Error("Invalid payment type.");
  }

  return {
    ...leadInput,
    paymentType
  };
}
