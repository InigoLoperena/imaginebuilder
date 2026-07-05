import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import type { EquityCountMode, EquityModel, EquityRounding } from "../types";
import { useCreatePolicy } from "../api";

const schema = z.object({
  type: z.enum(["dynamic_pool", "fixed_conversion"]),
  hours_per_percent: z.number().positive().max(100000).optional(),
  max_equity: z.number().min(0.001).max(100),
  count_mode: z.enum(["approved_only", "all"]),
  rounding: z.enum(["two", "four", "none"]),
  effective_from: z.string().min(1),
  vesting_cliff_months: z.number().int().min(0).max(120),
  vesting_duration_months: z.number().int().min(0).max(240),
});

export function PolicyForm({ projectId, onCreated }: { projectId: string; onCreated?: () => void }) {
  const create = useCreatePolicy();
  const [type, setType] = useState<EquityModel>("fixed_conversion");
  const [hoursPerPct, setHoursPerPct] = useState("10");
  const [maxEquity, setMaxEquity] = useState("100");
  const [countMode, setCountMode] = useState<EquityCountMode>("approved_only");
  const [rounding, setRounding] = useState<EquityRounding>("four");
  const [effective, setEffective] = useState(new Date().toISOString().slice(0, 10));
  const [cliff, setCliff] = useState("0");
  const [duration, setDuration] = useState("0");

  const submit = async () => {
    const parsed = schema.safeParse({
      type,
      hours_per_percent: type === "fixed_conversion" ? Number(hoursPerPct) : undefined,
      max_equity: Number(maxEquity),
      count_mode: countMode,
      rounding,
      effective_from: effective,
      vesting_cliff_months: Number(cliff),
      vesting_duration_months: Number(duration),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos no válidos");
      return;
    }
    try {
      await create.mutateAsync({
        project_id: projectId,
        type: parsed.data.type,
        hours_per_percent: parsed.data.hours_per_percent ?? null,
        max_equity: parsed.data.max_equity,
        count_mode: parsed.data.count_mode,
        rounding: parsed.data.rounding,
        effective_from: parsed.data.effective_from,
        vesting_cliff_months: parsed.data.vesting_cliff_months,
        vesting_duration_months: parsed.data.vesting_duration_months,
        is_active: false,
      });
      toast.success("Política creada (inactiva). Actívala para aplicarla.");
      onCreated?.();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Card className="p-5 space-y-4">
      <h3 className="font-semibold">Nueva política de equity</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Modelo</Label>
          <Select value={type} onValueChange={(v) => setType(v as EquityModel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dynamic_pool">Pool Dinámico de Horas</SelectItem>
              <SelectItem value="fixed_conversion">Conversión Fija de Horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {type === "fixed_conversion" && (
          <div>
            <Label>Horas por 1% de equity</Label>
            <Input type="number" step="0.01" min="0.01" value={hoursPerPct} onChange={(e) => setHoursPerPct(e.target.value)} />
          </div>
        )}
        <div>
          <Label>Equity máximo (%)</Label>
          <Input type="number" step="0.01" min="0" max="100" value={maxEquity} onChange={(e) => setMaxEquity(e.target.value)} />
        </div>
        <div>
          <Label>Qué horas cuentan</Label>
          <Select value={countMode} onValueChange={(v) => setCountMode(v as EquityCountMode)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="approved_only">Solo aprobadas</SelectItem>
              <SelectItem value="all">Todas las registradas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Redondeo</Label>
          <Select value={rounding} onValueChange={(v) => setRounding(v as EquityRounding)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="two">2 decimales</SelectItem>
              <SelectItem value="four">4 decimales</SelectItem>
              <SelectItem value="none">Sin redondeo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Fecha de efecto</Label>
          <Input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} />
        </div>
        <div>
          <Label>Cliff de vesting (meses)</Label>
          <Input type="number" min="0" max="120" value={cliff} onChange={(e) => setCliff(e.target.value)} />
        </div>
        <div>
          <Label>Duración de vesting (meses)</Label>
          <Input type="number" min="0" max="240" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>
      <Button onClick={submit} disabled={create.isPending}>
        {create.isPending ? "Creando…" : "Crear política"}
      </Button>
    </Card>
  );
}
