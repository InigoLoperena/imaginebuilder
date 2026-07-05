import { Card } from "@/components/ui/card";
import type { ContributorAllocation } from "../calc";
import type { EquityPolicy } from "../types";

export function EquitySummaryCard({
  policy,
  allocations,
}: {
  policy: EquityPolicy | null;
  allocations: ContributorAllocation[];
}) {
  const total = allocations.reduce((s, a) => s + a.earned_pct, 0);
  const cap = policy ? Number(policy.max_equity) : 100;
  const remaining = Math.max(0, cap - total);
  const contributors = allocations.length;

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Allocated</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{total.toFixed(4)}%</div>
      </Card>
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Remaining</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{remaining.toFixed(4)}%</div>
        <div className="text-xs text-muted-foreground mt-1">Cap {cap}%</div>
      </Card>
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Contributors</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{contributors}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Model: {policy?.type === "fixed_conversion" ? "Fixed conversion" : policy?.type === "dynamic_pool" ? "Dynamic pool" : "—"}
        </div>
      </Card>
    </div>
  );
}
