import "server-only";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { BookingEmailDetails, EmailContent } from "@/lib/email/templates";
import {
  customerPaidBookingTemplate,
  ownerExpiredCheckoutTemplate,
  ownerLeadTemplate,
  ownerPaidBookingTemplate
} from "@/lib/email/templates";

type MailOutcome =
  | { status: "sent" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo?: string;
};

let cachedTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

function notificationsEnabled() {
  return process.env.EMAIL_NOTIFICATIONS_ENABLED === "true";
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isValidEmail(value: string | null | undefined) {
  if (!value) return false;
  const cleaned = cleanHeader(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
}

function envValue(name: string) {
  const value = process.env[name];
  return value ? cleanHeader(value) : undefined;
}

function smtpConfig(): SmtpConfig | { missing: string[] } {
  const host = envValue("SMTP_HOST");
  const portRaw = envValue("SMTP_PORT");
  const user = envValue("SMTP_USER");
  const pass = envValue("SMTP_PASS");
  const from = envValue("SMTP_FROM");
  const replyTo = envValue("SMTP_REPLY_TO");
  const requiredValues: Array<[string, string | undefined]> = [
    ["SMTP_HOST", host],
    ["SMTP_PORT", portRaw],
    ["SMTP_USER", user],
    ["SMTP_PASS", pass],
    ["SMTP_FROM", from]
  ];
  const missing = requiredValues
    .filter(([, value]) => !value)
    .map(([name]) => name);
  const port = portRaw ? Number.parseInt(portRaw, 10) : Number.NaN;

  if (!Number.isInteger(port) || port <= 0) {
    missing.push("SMTP_PORT");
  }

  if (missing.length > 0) {
    return { missing: Array.from(new Set(missing)) };
  }

  return {
    host: host as string,
    port,
    secure: process.env.SMTP_SECURE === "true",
    user: user as string,
    pass: pass as string,
    from: from as string,
    replyTo
  };
}

function transporter(config: SmtpConfig) {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
  }

  return cachedTransporter;
}

async function sendEmail(to: string | null | undefined, content: EmailContent): Promise<MailOutcome> {
  if (!notificationsEnabled()) {
    return { status: "skipped", reason: "notifications_disabled" };
  }

  if (!isValidEmail(to)) {
    return { status: "skipped", reason: "invalid_recipient" };
  }

  const config = smtpConfig();
  if ("missing" in config) {
    console.error("[email] SMTP config incomplete; skipping notification.", {
      missing: config.missing.join(",")
    });
    return { status: "failed", reason: "smtp_config_incomplete" };
  }

  try {
    await transporter(config).sendMail({
      from: config.from,
      to: cleanHeader(to as string),
      replyTo: config.replyTo,
      subject: cleanHeader(content.subject),
      text: content.text,
      html: content.html
    });

    return { status: "sent" };
  } catch (error) {
    const reason = error instanceof Error ? error.name : "unknown_error";
    console.error("[email] Notification send failed.", { reason });
    return { status: "failed", reason: "smtp_send_failed" };
  }
}

function ownerEmail() {
  return envValue("OWNER_NOTIFICATION_EMAIL");
}

function notificationPreparationFailed(error: unknown): MailOutcome {
  const reason = error instanceof Error ? error.name : "unknown_error";
  console.error("[email] Notification preparation failed.", { reason });
  return { status: "failed", reason: "notification_prepare_failed" };
}

async function sendOwnerEmail(content: EmailContent) {
  const recipient = ownerEmail();

  if (notificationsEnabled() && !isValidEmail(recipient)) {
    console.error("[email] OWNER_NOTIFICATION_EMAIL is missing or invalid; skipping owner notification.");
    return { status: "failed", reason: "owner_email_invalid" } satisfies MailOutcome;
  }

  return sendEmail(recipient, content);
}

export async function sendOwnerPaidBookingNotification(details: BookingEmailDetails) {
  try {
    return await sendOwnerEmail(ownerPaidBookingTemplate(details));
  } catch (error) {
    return notificationPreparationFailed(error);
  }
}

export async function sendCustomerPaidBookingNotification(details: BookingEmailDetails) {
  try {
    return await sendEmail(details.customerEmail, customerPaidBookingTemplate(details));
  } catch (error) {
    return notificationPreparationFailed(error);
  }
}

export async function sendOwnerLeadNotification(details: BookingEmailDetails) {
  try {
    return await sendOwnerEmail(ownerLeadTemplate(details));
  } catch (error) {
    return notificationPreparationFailed(error);
  }
}

export async function sendOwnerExpiredCheckoutNotification(details: BookingEmailDetails) {
  try {
    return await sendOwnerEmail(ownerExpiredCheckoutTemplate(details));
  } catch (error) {
    return notificationPreparationFailed(error);
  }
}

export function notificationFailure(outcomes: MailOutcome[]) {
  return outcomes.find((outcome) => outcome.status === "failed");
}
