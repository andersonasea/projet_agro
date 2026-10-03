const MIN_COMMISSION_USD = 0.2;

export function getCommissionRate(): number {
  const raw = process.env.PLATFORM_COMMISSION_RATE ?? "0.06";
  const rate = Number.parseFloat(raw);
  if (Number.isNaN(rate) || rate < 0 || rate > 1) return 0.06;
  return rate;
}

export function computeCommission(totalUsd: number): number {
  const rate = getCommissionRate();
  const commission = totalUsd * rate;
  return Math.max(commission, MIN_COMMISSION_USD);
}
