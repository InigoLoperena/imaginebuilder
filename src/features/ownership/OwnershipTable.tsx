import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OwnershipRow } from "@/features/ownership/calculateOwnership";
import { Badge } from "@/components/ui/badge";

export function OwnershipTable({ rows }: { rows: OwnershipRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Miembro</TableHead>
          <TableHead className="text-right">Horas</TableHead>
          <TableHead className="text-right">Fijo</TableHead>
          <TableHead className="text-right">Variable</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.user_id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {r.name}
                {r.override != null && <Badge variant="secondary">Asignado por admin</Badge>}
              </div>
            </TableCell>
            <TableCell className="text-right">{r.hours.toFixed(2)}</TableCell>
            <TableCell className="text-right text-muted-foreground">{r.fixed.toFixed(2)}%</TableCell>
            <TableCell className="text-right text-muted-foreground">{r.variable.toFixed(2)}%</TableCell>
            <TableCell className="text-right font-semibold">{r.total.toFixed(2)}%</TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Sin datos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
