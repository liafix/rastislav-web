import { PAYMENT_LABELS } from "@/lib/commerce/config";
import { getService } from "@/lib/content/services";

export type BookingEmailDetails = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  service: string;
  location: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  paymentType?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
};

export type EmailContent = {
  subject: string;
  text: string;
  html: string;
};

function value(input: string | number | null | undefined) {
  if (input === null || input === undefined || input === "") return "-";
  return String(input);
}

function escapeHtml(input: string | number | null | undefined) {
  return value(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(label: string, input: string | number | null | undefined) {
  return `${label}: ${value(input)}`;
}

function htmlField(label: string, input: string | number | null | undefined) {
  return `<tr><th align="left" style="padding:6px 12px 6px 0;">${escapeHtml(label)}</th><td style="padding:6px 0;">${escapeHtml(input)}</td></tr>`;
}

function htmlShell(title: string, intro: string, rows: string, footer?: string) {
  return `<!doctype html>
<html lang="sk">
  <body style="font-family:Arial,sans-serif;line-height:1.5;color:#171717;">
    <h1 style="font-size:20px;margin:0 0 12px;">${escapeHtml(title)}</h1>
    <p>${escapeHtml(intro)}</p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:16px 0;">
      ${rows}
    </table>
    ${footer ? `<p>${escapeHtml(footer)}</p>` : ""}
  </body>
</html>`;
}

function serviceLabel(service: string) {
  return getService(service)?.label ?? service;
}

function paymentLabel(paymentType?: string | null) {
  if (!paymentType) return undefined;
  return PAYMENT_LABELS[paymentType as keyof typeof PAYMENT_LABELS] ?? paymentType;
}

function formatAmount(amountCents?: number | null, currency?: string | null) {
  if (typeof amountCents !== "number") return undefined;
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: (currency || "eur").toUpperCase()
  }).format(amountCents / 100);
}

function operationalRows(details: BookingEmailDetails) {
  return [
    field("Meno", details.customerName),
    field("Telefón", details.customerPhone),
    field("E-mail", details.customerEmail),
    field("Služba", serviceLabel(details.service)),
    field("Lokalita", details.location),
    field("Preferovaný dátum", details.preferredDate),
    field("Preferovaný čas", details.preferredTime),
    field("Typ platby", paymentLabel(details.paymentType)),
    field("Suma", formatAmount(details.amountCents, details.currency)),
    field("Stripe session ID", details.stripeSessionId),
    field("Stripe payment intent ID", details.stripePaymentIntentId),
    field("Správa", details.message)
  ].join("\n");
}

function operationalHtmlRows(details: BookingEmailDetails) {
  return [
    htmlField("Meno", details.customerName),
    htmlField("Telefón", details.customerPhone),
    htmlField("E-mail", details.customerEmail),
    htmlField("Služba", serviceLabel(details.service)),
    htmlField("Lokalita", details.location),
    htmlField("Preferovaný dátum", details.preferredDate),
    htmlField("Preferovaný čas", details.preferredTime),
    htmlField("Typ platby", paymentLabel(details.paymentType)),
    htmlField("Suma", formatAmount(details.amountCents, details.currency)),
    htmlField("Stripe session ID", details.stripeSessionId),
    htmlField("Stripe payment intent ID", details.stripePaymentIntentId),
    htmlField("Správa", details.message)
  ].join("");
}

export function ownerPaidBookingTemplate(details: BookingEmailDetails): EmailContent {
  const intro = "Stripe webhook potvrdil platbu za rezerváciu alebo konzultáciu.";
  const nextAction = "Ďalší krok: kontaktujte zákazníka a potvrďte detaily termínu.";

  return {
    subject: "Nová zaplatená rezervácia - mv MARTIŠ",
    text: `${intro}\n\n${operationalRows(details)}\n\n${nextAction}`,
    html: htmlShell("Nová zaplatená rezervácia", intro, operationalHtmlRows(details), nextAction)
  };
}

export function customerPaidBookingTemplate(details: BookingEmailDetails): EmailContent {
  const amount = formatAmount(details.amountCents, details.currency);
  const intro = "Ďakujeme, prijali sme vašu platbu a požiadavku.";
  const footer = "Tím mv MARTIŠ vás bude kontaktovať a potvrdí detaily, ak bude potrebné niečo doplniť.";

  const rows = [
    field("Služba", serviceLabel(details.service)),
    field("Lokalita", details.location),
    field("Preferovaný dátum", details.preferredDate),
    field("Preferovaný čas", details.preferredTime),
    field("Suma", amount),
    field("Čo bude nasledovať", "Ozveme sa vám a doladíme termín alebo technické detaily.")
  ].join("\n");

  const htmlRows = [
    htmlField("Služba", serviceLabel(details.service)),
    htmlField("Lokalita", details.location),
    htmlField("Preferovaný dátum", details.preferredDate),
    htmlField("Preferovaný čas", details.preferredTime),
    htmlField("Suma", amount),
    htmlField("Čo bude nasledovať", "Ozveme sa vám a doladíme termín alebo technické detaily.")
  ].join("");

  return {
    subject: "Potvrdenie platby a požiadavky - mv MARTIŠ",
    text: `${intro}\n\n${rows}\n\n${footer}`,
    html: htmlShell("Potvrdenie platby a požiadavky", intro, htmlRows, footer)
  };
}

export function ownerLeadTemplate(details: BookingEmailDetails): EmailContent {
  const intro = "Web vytvoril nový neplatený lead.";
  const nextAction = "Ďalší krok: overte požiadavku a kontaktujte zákazníka.";

  return {
    subject: "Nový lead z webu - mv MARTIŠ",
    text: `${intro}\n\n${operationalRows(details)}\n\n${nextAction}`,
    html: htmlShell("Nový lead z webu", intro, operationalHtmlRows(details), nextAction)
  };
}

export function ownerExpiredCheckoutTemplate(details: BookingEmailDetails): EmailContent {
  const intro = "Stripe Checkout relácia expirovala alebo nebola dokončená.";
  const nextAction = "Ďalší krok: ak lead vyzerá hodnotne, kontaktujte zákazníka a ponúknite pomoc s dokončením.";

  return {
    subject: "Nedokončená platba - mv MARTIŠ",
    text: `${intro}\n\n${operationalRows(details)}\n\n${nextAction}`,
    html: htmlShell("Nedokončená platba", intro, operationalHtmlRows(details), nextAction)
  };
}
