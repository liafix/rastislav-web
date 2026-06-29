import { COMMISSION_CAP_CENTS } from "@/lib/commerce/config";

export function calculateCommissionEarnedCents({
  paidCents,
  previousCommissionCents,
  commissionPercent = 35
}: {
  paidCents: number;
  previousCommissionCents: number;
  commissionPercent?: number;
}) {
  const rawCommission = Math.round(paidCents * (commissionPercent / 100));
  const remainingCap = Math.max(0, COMMISSION_CAP_CENTS - previousCommissionCents);

  return Math.min(rawCommission, remainingCap);
}
