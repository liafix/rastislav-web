import { createInquiryHandler } from "@/lib/inquiries/handler";
import { inquiryStore } from "@/lib/inquiries/repository";
import { sendCompanyInquiry, sendCustomerInquiry } from "@/lib/email/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const POST = createInquiryHandler({
  store: inquiryStore,
  sendCompany: sendCompanyInquiry,
  sendCustomer: sendCustomerInquiry,
  log: (event, details) => console.error("[inquiries]", event, details)
});
