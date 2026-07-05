import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSimulate } from "../api";
import type { EquityRounding, SimulationResult } from "../types";

export function SimulatorDialog({
  projectId,
  nameOf,
}: {
  projectId: string;
  nameOf: (userId: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [hoursPerPct, setHoursPerPct] = useState("10");
  const [maxEquity, setMaxEquity] = useState("100");
  const [rounding, setRounding] = useState<EquityRounding>("four");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const simulate = useSimulate();

  const run = async () => {
    const r = await simulate.mutateAsync({
      project_id: projectId,
      hours_per_percent: Number(hoursPerPct),
      max_equity: Number(maxEquity),
      rounding,
    });
    setResult(r);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Simulate</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Equity simulator</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Hours / 1%</Label>
            <Input type="number" min="0.01" step="0.01" value={hoursPerPct} onChange={(e) => setHoursPerPct(e.target.value)} />
          </div>
          <div>
            <Label>Cap (%)</Label>
            <Input type="number" min="0" max="100" step="0.01" value={maxEquity} onChange={(e) => setMaxEquity(e.target.value)} />
          </div>
          <div>
            <Label>Rounding</Label>
            <Select value={rounding} onValueChange={(v) => setRounding(v as EquityRounding)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="two">2 decimals</SelectItem>
                <SelectItem value="four">4 decimals</SelectItem>
                <SelectItem value="none">No rounding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={run} disabled={simulate.isPending}>
          {simulate.isPending ? "Running…" : "Run simulation"}
        </Button>
        {result && (
          <>
            <p className="text-sm text-muted-foreground">
              Total allocated: <strong>{Number(result.total_allocated).toFixed(4)}%</strong> · Cap: {result.max_equity}%
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Projected %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((r) => (
                  <TableRow key={r.user_id}>
                    <TableCell>{nameOf(r.user_id)}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(r.hours).toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{Number(r.pct).toFixed(4)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
