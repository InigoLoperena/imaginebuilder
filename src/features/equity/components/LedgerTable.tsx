import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EquityTransaction } from "../types";

export function LedgerTable({
  transactions,
  nameOf,
}: {
  transactions: EquityTransaction[];
  nameOf: (userId: string) => string;
}) {
  if (transactions.length === 0) {
    return <Card className="p-6 text-sm text-muted-foreground">Todavía no hay transacciones.</Card>;
  }
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Colaborador</TableHead>
            <TableHead className="text-right">Horas</TableHead>
            <TableHead className="text-right">Δ %</TableHead>
            <TableHead>Política</TableHead>
            <TableHead>Motivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const delta = Number(tx.percentage_delta);
            return (
              <TableRow key={tx.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(tx.created_at).toLocaleString("es-ES")}
                </TableCell>
                <TableCell>{nameOf(tx.user_id)}</TableCell>
                <TableCell className="text-right tabular-nums">{Number(tx.hours).toFixed(2)}</TableCell>
                <TableCell
                  className={
                    "text-right tabular-nums " + (delta >= 0 ? "text-green-500" : "text-red-500")
                  }
                >
                  {(delta >= 0 ? "+" : "") + delta.toFixed(4)}%
                </TableCell>
                <TableCell className="text-xs font-mono">v{tx.policy_version}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{tx.reason}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
