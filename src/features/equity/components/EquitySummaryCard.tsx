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
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Asignado</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{total.toFixed(4)}%</div>
      </Card>
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Disponible</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{remaining.toFixed(4)}%</div>
        <div className="text-xs text-muted-foreground mt-1">Tope {cap}%</div>
      </Card>
      <Card className="p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Colaboradores</div>
        <div className="text-3xl font-semibold tabular-nums mt-2">{contributors}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Modelo: {policy?.type === "fixed_conversion" ? "Conversión fija" : policy?.type === "dynamic_pool" ? "Pool dinámico" : "—"}
        </div>
      </Card>
    </div>
  );
}
