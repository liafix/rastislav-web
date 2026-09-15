import { INQUIRY_FIELDS, LIMITS, ROOF_TYPES, type FieldErrors, type InquiryInput, type InquiryValues, type RoofType } from "./contract";

const controls = /[\u0000-\u001f\u007f-\u009f]/;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isEmail(value: string): boolean {
  if (value.length > LIMITS.email || controls.test(value) || /\s/.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && local.length <= 64 &&
    /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~.-]+$/.test(local) &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    domain.includes(".") && domain.split(".").every((label) =>
      /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label));
}
export class InquiryRequestError extends Error {
  constructor(public status: number, public code: string, message: string, public fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = "InquiryRequestError";
  }
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function validateInquiryFields(body: Record<string, unknown>): { values: InquiryValues; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const values: InquiryValues = { roofType: "", areaM2: "", location: "", preferredTerm: "", name: "", email: "", phone: "" };
  for (const field of INQUIRY_FIELDS) {
    const raw = body[field];
    if (field === "areaM2" && typeof raw === "number") {
      values[field] = String(raw);
    } else if (typeof raw === "string") {
      // Check before trimming: a newline in an address must not disappear silently.
      if (controls.test(raw)) errors[field] = "Odstráňte nepovolené riadiace znaky.";
      values[field] = raw.trim().normalize("NFC");
    } else {
      errors[field] = "Vyplňte pole v správnom formáte.";
    }
  }
  if (!ROOF_TYPES.some((type) => type === values.roofType)) errors.roofType = "Vyberte typ strechy.";
  const area = values.areaM2.replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(area) || !Number.isFinite(Number(area)) || Number(area) <= 0 || Number(area) > LIMITS.areaM2) {
    errors.areaM2 = "Zadajte plochu väčšiu ako 0, najviac 100 000 m², s najviac 2 desatinnými miestami.";
  } else {
    values.areaM2 = Number(area).toFixed(2);
  }
  for (const field of ["location", "preferredTerm", "name"] as const) {
    if (values[field].length < 2 || values[field].length > LIMITS[field]) {
      errors[field] = `Zadajte 2 až ${LIMITS[field]} znakov.`;
    }
  }
  if (!isEmail(values.email)) errors.email = "Zadajte platný email (najviac 254 znakov).";
  const phone = values.phone;
  const digits = phone.replace(/[ ()-]/g, "");
  if (phone.length > LIMITS.phone || !/^\+?[0-9 ()-]+$/.test(phone) ||
      !/^\+?\d{7,15}$/.test(digits) ||
      (/[()]/.test(phone) && !/^[^()]*\(\d+\)[^()]*$/.test(phone))) {
    errors.phone = "Zadajte platné telefónne číslo so 7 až 15 číslicami.";
  } else {
    values.phone = digits;
  }
  return { values, errors };
}
export function parseInquiry(body: unknown): InquiryInput {
  if (!record(body)) throw new InquiryRequestError(400, "invalid_body", "Očakávame JSON objekt.");
  const allowed = new Set<string>([...INQUIRY_FIELDS, "submissionKey"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) {
    throw new InquiryRequestError(400, "unexpected_fields", "Požiadavka obsahuje nepovolené polia.");
  }
  const { values, errors } = validateInquiryFields(body);
  if (typeof body.submissionKey !== "string" || !uuid.test(body.submissionKey)) {
    errors.submissionKey = "Obnovte formulár a skúste dopyt odoslať znova.";
  }
  if (Object.keys(errors).length) throw new InquiryRequestError(422, "validation_failed", "Skontrolujte vyznačené polia.", errors);
  return { ...values, roofType: values.roofType as RoofType, submissionKey: String(body.submissionKey).toLowerCase() };
}
