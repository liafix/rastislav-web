export const ROOF_TYPES = ["new", "reconstruction", "repair"] as const;
export type RoofType = (typeof ROOF_TYPES)[number];
export const ROOF_LABELS: Record<RoofType, string> = {
  new: "Nová strecha",
  reconstruction: "Rekonštrukcia",
  repair: "Oprava"
};
export const INQUIRY_FIELDS = [
  "roofType", "areaM2", "location", "preferredTerm", "name", "email", "phone"
] as const;
export type InquiryField = (typeof INQUIRY_FIELDS)[number];
export type FieldErrors = Partial<Record<InquiryField | "submissionKey", string>>;
export const STEP_FIELDS: readonly (readonly InquiryField[])[] = [
  ["roofType", "areaM2"], ["location", "preferredTerm"], ["name", "email", "phone"]
];
export const LIMITS = { areaM2: 100000, location: 160, preferredTerm: 160, name: 100, email: 254, phone: 32 } as const;
export type InquiryValues = Record<InquiryField, string>;
export type InquiryInput = {
  submissionKey: string;
  roofType: RoofType;
  areaM2: string;
  location: string;
  preferredTerm: string;
  name: string;
  email: string;
  phone: string;
};
export type DeliveryStatus = "pending" | "sent" | "failed";
export type InquiryRecord = InquiryInput & {
  id: number;
  status: "new" | "completed";
  companyEmailStatus: DeliveryStatus;
  customerEmailStatus: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
};
export type InquiryReceipt = {
  ok: true;
  inquiryId: number;
  duplicate: boolean;
  delivery: { company: DeliveryStatus; customer: DeliveryStatus };
  deliveryRecorded: boolean;
};
