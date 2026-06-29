import type { PaymentType } from "@/lib/contracts";

export const PAYMENT_AMOUNTS_CENTS = {
  reservation_fee: 3000,
  consultation_fee: 8000
} satisfies Record<PaymentType, number>;

export const PAYMENT_LABELS = {
  reservation_fee: "Rezervačný poplatok za obhliadku",
  consultation_fee: "Platená konzultácia"
} satisfies Record<PaymentType, string>;

export const COMMISSION_PERCENT = "35.00";
export const COMMISSION_CAP_CENTS = 100000;
export const DEFAULT_CURRENCY = "eur";

export function getPaymentAmountCents(paymentType: PaymentType) {
  return PAYMENT_AMOUNTS_CENTS[paymentType];
}
