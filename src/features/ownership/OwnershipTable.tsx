import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OwnershipRow } from "@/features/ownership/calculateOwnership";

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
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="text-right">{r.hours.toFixed(2)}</TableCell>
            <TableCell className="text-right">{r.fixed.toFixed(2)}%</TableCell>
            <TableCell className="text-right">{r.variable.toFixed(2)}%</TableCell>
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
