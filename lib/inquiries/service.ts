import "server-only";
import { INQUIRY_FIELDS, type DeliveryStatus, type InquiryInput, type InquiryReceipt, type InquiryRecord } from "./contract";
import { InquiryRequestError } from "./validation";

export type MailOutcome = { status: "sent" } | { status: "failed"; reason: string };
export type Recipient = "company" | "customer";
export interface InquiryStore {
  create(input: InquiryInput): Promise<InquiryRecord>;
  findBySubmissionKey(key: string): Promise<InquiryRecord | undefined>;
  recordDelivery(id: number, recipient: Recipient, status: "sent" | "failed"): Promise<void>;
}
export type InquiryDependencies = {
  store: InquiryStore;
  sendCompany(inquiry: InquiryRecord): Promise<MailOutcome>;
  sendCustomer(inquiry: InquiryRecord): Promise<MailOutcome>;
  log(event: string, details: { inquiryId?: number; recipient?: Recipient }): void;
};
export function isDuplicateKeyError(error: unknown): boolean {
  // Drizzle wraps driver errors in "cause". Do not inspect or log SQL/messages.
  for (let depth = 0; depth < 4 && typeof error === "object" && error !== null; depth++) {
    if ("code" in error && error.code === "ER_DUP_ENTRY") return true;
    error = "cause" in error ? error.cause : undefined;
  }
  return false;
}
function receipt(inquiry: InquiryRecord, duplicate: boolean, deliveryRecorded = true): InquiryReceipt {
  return {
    ok: true, inquiryId: inquiry.id, duplicate, deliveryRecorded,
    delivery: { company: inquiry.companyEmailStatus, customer: inquiry.customerEmailStatus }
  };
}
export async function submitInquiry(input: InquiryInput, deps: InquiryDependencies): Promise<InquiryReceipt> {
  let inquiry: InquiryRecord;
  try {
    // The unique database constraint, not a prior SELECT, decides the race winner.
    inquiry = await deps.store.create(input);
  } catch (error) {
    if (!isDuplicateKeyError(error)) throw error;
    const existing = await deps.store.findBySubmissionKey(input.submissionKey);
    if (!existing) throw new Error("Duplicate inquiry could not be resolved.");
    if (INQUIRY_FIELDS.some((field) => existing[field] !== input[field])) {
      throw new InquiryRequestError(409, "submission_conflict", "Tento dopyt už bol uložený s inými údajmi. Ak chcete odoslať ďalší, začnite nový dopyt.");
    }
    return receipt(existing, true);
  }

  let deliveryRecorded = true;
  for (const recipient of ["company", "customer"] as const) {
    let status: Exclude<DeliveryStatus, "pending">;
    try {
      const outcome = await (recipient === "company" ? deps.sendCompany(inquiry) : deps.sendCustomer(inquiry));
      status = outcome.status;
    } catch {
      status = "failed";
    }
    if (status === "failed") deps.log("inquiry_email_failed", { inquiryId: inquiry.id, recipient });
    if (recipient === "company") inquiry.companyEmailStatus = status;
    else inquiry.customerEmailStatus = status;
    try { await deps.store.recordDelivery(inquiry.id, recipient, status); }
    catch {
      // The inquiry is already saved. Leave a pending marker and never tell the
      // browser to create another inquiry because an outcome update failed.
      deliveryRecorded = false;
      deps.log("inquiry_delivery_record_failed", { inquiryId: inquiry.id, recipient });
    }
  }
  return receipt(inquiry, false, deliveryRecorded);
}
