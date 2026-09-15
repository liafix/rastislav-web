import "server-only";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { companyInquiryTemplate, customerInquiryTemplate, type EmailContent } from "./templates";
import type { InquiryRecord } from "@/lib/inquiries/contract";
import type { MailOutcome } from "@/lib/inquiries/service";
import { isEmail } from "@/lib/inquiries/validation";

type SmtpConfig = { host: string; port: number; secure: boolean; user: string; pass: string; from: string; replyTo?: string };
let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;
const headerControls = /[\u0000-\u001f\u007f]/;
function header(value: string | undefined) {
  return value && !headerControls.test(value) ? value.trim() : undefined;
}
function senderAddress(value: string) {
  const named = /^[^<>]+<([^<>]+)>$/.exec(value);
  return named ? named[1] : value;
}
function smtpConfig(): SmtpConfig | undefined {
  const host = header(process.env.SMTP_HOST);
  const rawPort = process.env.SMTP_PORT;
  const port = Number(rawPort);
  const secureValue = process.env.SMTP_SECURE;
  const user = process.env.SMTP_USER;
  // Credentials are opaque: no trim, normalization or header sanitization.
  const pass = process.env.SMTP_PASS;
  const from = header(process.env.SMTP_FROM);
  const replyTo = header(process.env.SMTP_REPLY_TO);
  if (!host || !rawPort || !/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535 ||
      !user || !pass || !from || !isEmail(senderAddress(from)) ||
      (secureValue !== "true" && secureValue !== "false") ||
      (process.env.SMTP_REPLY_TO && (!replyTo || !isEmail(replyTo)))) return undefined;
  return { host, port, secure: secureValue === "true", user, pass, from, replyTo };
}
function transporter(config: SmtpConfig) {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host, port: config.port, secure: config.secure,
      requireTLS: !config.secure,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
      logger: false, debug: false
    });
  }
  return cachedTransporter;
}
export async function sendEmail(to: string | null | undefined, content: EmailContent, replyToOverride?: string): Promise<MailOutcome> {
  if (!to || !isEmail(to) || (replyToOverride !== undefined && !isEmail(replyToOverride)) || headerControls.test(content.subject)) {
    return { status: "failed", reason: "invalid_email_header" };
  }
  const config = smtpConfig();
  if (!config) return { status: "failed", reason: "smtp_config_incomplete" };
  try {
    const result = await transporter(config).sendMail({
      from: config.from, to,
      replyTo: replyToOverride ?? config.replyTo,
      subject: content.subject, text: content.text, html: content.html
    });
    // Successful SMTP handoff is not proof of inbox delivery.
    if (!result.accepted?.length || result.rejected?.length) return { status: "failed", reason: "smtp_recipient_rejected" };
    return { status: "sent" };
  } catch {
    // A timeout can be ambiguous; an operator checks the provider before resending.
    // Do not log exception messages: they may contain addresses or credentials.
    return { status: "failed", reason: "smtp_send_failed" };
  }
}
export async function sendCompanyInquiry(inquiry: InquiryRecord) {
  return sendEmail(header(process.env.OWNER_NOTIFICATION_EMAIL), companyInquiryTemplate(inquiry), inquiry.email);
}
export async function sendCustomerInquiry(inquiry: InquiryRecord) {
  return sendEmail(inquiry.email, customerInquiryTemplate(inquiry));
}
