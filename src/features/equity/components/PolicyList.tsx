import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EquityPolicy } from "../types";
import { useActivatePolicy } from "../api";

export function PolicyList({ policies }: { policies: EquityPolicy[] }) {
  const activate = useActivatePolicy();
  if (policies.length === 0) {
    return <Card className="p-6 text-sm text-muted-foreground">Todavía no hay políticas.</Card>;
  }
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Versión</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ratio</TableHead>
            <TableHead>Tope</TableHead>
            <TableHead>Efectiva desde</TableHead>
            <TableHead>Vesting</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono">v{p.version}</TableCell>
              <TableCell>{p.type === "fixed_conversion" ? "Conversión fija" : "Pool dinámico"}</TableCell>
              <TableCell className="tabular-nums">
                {p.hours_per_percent ? `${Number(p.hours_per_percent)}h = 1%` : "—"}
              </TableCell>
              <TableCell className="tabular-nums">{Number(p.max_equity)}%</TableCell>
              <TableCell>{p.effective_from}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.vesting_duration_months > 0
                  ? `${p.vesting_cliff_months}m cliff / ${p.vesting_duration_months}m lineal`
                  : "Sin vesting"}
              </TableCell>
              <TableCell>
                {p.is_active ? <Badge>Activa</Badge> : <Badge variant="secondary">Inactiva</Badge>}
              </TableCell>
              <TableCell className="text-right">
                {!p.is_active && (
                  <Button size="sm" variant="outline" onClick={() => activate.mutate(p)}>
                    Activar
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
