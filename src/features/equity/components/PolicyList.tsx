import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EquityPolicy } from "../types";
import { useActivatePolicy } from "../api";

export function PolicyList({ policies }: { policies: EquityPolicy[] }) {
  const activate = useActivatePolicy();
  if (policies.length === 0) {
    return <Card className="p-6 text-sm text-muted-foreground">No policies yet.</Card>;
  }
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Ratio</TableHead>
            <TableHead>Cap</TableHead>
            <TableHead>Effective</TableHead>
            <TableHead>Vesting</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono">v{p.version}</TableCell>
              <TableCell>{p.type === "fixed_conversion" ? "Fixed conversion" : "Dynamic pool"}</TableCell>
              <TableCell className="tabular-nums">
                {p.hours_per_percent ? `${Number(p.hours_per_percent)}h = 1%` : "—"}
              </TableCell>
              <TableCell className="tabular-nums">{Number(p.max_equity)}%</TableCell>
              <TableCell>{p.effective_from}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.vesting_duration_months > 0
                  ? `${p.vesting_cliff_months}m cliff / ${p.vesting_duration_months}m linear`
                  : "None"}
              </TableCell>
              <TableCell>
                {p.is_active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
              </TableCell>
              <TableCell className="text-right">
                {!p.is_active && (
                  <Button size="sm" variant="outline" onClick={() => activate.mutate(p)}>
                    Activate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
