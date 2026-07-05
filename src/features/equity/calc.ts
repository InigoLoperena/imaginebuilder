import type { EquityPolicy, EquityRounding, EquityTransaction } from "./types";

export function roundEquity(value: number, mode: EquityRounding): number {
  if (mode === "two") return Math.round(value * 100) / 100;
  if (mode === "four") return Math.round(value * 10000) / 10000;
  return value;
}

/**
 * Vesting factor between 0 and 1 for a transaction created at `awardedAt`,
 * evaluated at `now`, under `policy`'s cliff + linear duration.
 */
export function vestingFactor(
  awardedAt: Date,
  now: Date,
  policy: Pick<EquityPolicy, "vesting_cliff_months" | "vesting_duration_months">
): number {
  const duration = policy.vesting_duration_months ?? 0;
  const cliff = policy.vesting_cliff_months ?? 0;
  if (duration <= 0) return 1;
  const monthsElapsed =
    (now.getFullYear() - awardedAt.getFullYear()) * 12 +
    (now.getMonth() - awardedAt.getMonth());
  if (monthsElapsed < cliff) return 0;
  return Math.min(1, monthsElapsed / duration);
}

export interface ContributorAllocation {
  user_id: string;
  earned_pct: number;
  vested_pct: number;
  hours: number;
  tx_count: number;
}

export function aggregateAllocations(
  transactions: EquityTransaction[],
  policy: Pick<EquityPolicy, "vesting_cliff_months" | "vesting_duration_months"> | null,
  now: Date = new Date()
): ContributorAllocation[] {
  const map = new Map<string, ContributorAllocation>();
  for (const tx of transactions) {
    const existing =
      map.get(tx.user_id) ??
      { user_id: tx.user_id, earned_pct: 0, vested_pct: 0, hours: 0, tx_count: 0 };
    const delta = Number(tx.percentage_delta);
    const factor = policy ? vestingFactor(new Date(tx.created_at), now, policy) : 1;
    existing.earned_pct += delta;
    existing.vested_pct += delta * factor;
    existing.hours += Number(tx.hours);
    existing.tx_count += 1;
    map.set(tx.user_id, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.earned_pct - a.earned_pct);
}

export function totalAllocated(transactions: EquityTransaction[]): number {
  return transactions.reduce((sum, tx) => sum + Number(tx.percentage_delta), 0);
}
