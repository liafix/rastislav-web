import { ROOF_LABELS, type InquiryRecord } from "@/lib/inquiries/contract";

export type EmailContent = { subject: string; text: string; html: string };
function value(input: string | number | null | undefined) {
  return input === null || input === undefined || input === "" ? "-" : String(input);
}
export function escapeHtml(input: string | number | null | undefined) {
  return value(input).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export function field(label: string, input: string | number | null | undefined) {
  return `${label}: ${value(input)}`;
}
export function htmlField(label: string, input: string | number | null | undefined) {
  return `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top;">${escapeHtml(label)}</th><td style="padding:6px 0;overflow-wrap:anywhere;">${escapeHtml(input)}</td></tr>`;
}
export function htmlShell(title: string, intro: string, rows: string, footer?: string) {
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
export const INQUIRY_NEXT_STEP = "Dopyt si prezrieme a následne vás kontaktujeme, aby sme upresnili rozsah prác a termín.";
function inquiryRows(inquiry: InquiryRecord): Array<[string, string | number]> {
  return [
    ["Číslo dopytu", inquiry.id],
    ["Typ strechy", ROOF_LABELS[inquiry.roofType]],
    ["Približná plocha", `${inquiry.areaM2} m²`],
    ["Lokalita", inquiry.location],
    ["Preferovaný termín", inquiry.preferredTerm],
    ["Meno", inquiry.name],
    ["Email", inquiry.email],
    ["Telefón", inquiry.phone],
    ["Odoslané (UTC)", inquiry.createdAt.toISOString()]
  ];
}
function inquiryTemplate(inquiry: InquiryRecord, customer: boolean): EmailContent {
  const rows = inquiryRows(inquiry);
  const title = customer ? "KROVEX — prijali sme váš dopyt" : `KROVEX — nový dopyt #${inquiry.id}`;
  const intro = customer ? "Ďakujeme za váš dopyt. Nasledujúce údaje sme prijali a uložili." : "Bol prijatý nový dopyt na strechárske práce.";
  const next = customer ? INQUIRY_NEXT_STEP : "Prezrite si dopyt a kontaktujte zákazníka na upresnenie rozsahu prác a termínu.";
  return {
    subject: title,
    text: `${intro}\n\n${rows.map(([label, input]) => field(label, input)).join("\n")}\n\n${next}`,
    html: htmlShell(title, intro, rows.map(([label, input]) => htmlField(label, input)).join(""), next)
  };
}
export function companyInquiryTemplate(inquiry: InquiryRecord) { return inquiryTemplate(inquiry, false); }
export function customerInquiryTemplate(inquiry: InquiryRecord) { return inquiryTemplate(inquiry, true); }
