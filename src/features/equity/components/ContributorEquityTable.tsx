import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ContributorAllocation } from "../calc";

export function ContributorEquityTable({
  allocations,
  nameOf,
  showVesting,
}: {
  allocations: ContributorAllocation[];
  nameOf: (userId: string) => string;
  showVesting?: boolean;
}) {
  if (allocations.length === 0) {
    return <Card className="p-6 text-sm text-muted-foreground">Todavía no hay asignaciones.</Card>;
  }
  const maxEarned = Math.max(...allocations.map((a) => a.earned_pct), 0.0001);
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead className="text-right">Horas</TableHead>
            <TableHead className="text-right">% ganado</TableHead>
            {showVesting && <TableHead className="text-right">% consolidado</TableHead>}
            <TableHead className="w-40">Participación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((a) => (
            <TableRow key={a.user_id}>
              <TableCell>{nameOf(a.user_id)}</TableCell>
              <TableCell className="text-right tabular-nums">{a.hours.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">{a.earned_pct.toFixed(4)}%</TableCell>
              {showVesting && (
                <TableCell className="text-right tabular-nums">{a.vested_pct.toFixed(4)}%</TableCell>
              )}
              <TableCell>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(a.earned_pct / maxEarned) * 100}%` }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
