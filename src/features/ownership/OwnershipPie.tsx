import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { OwnershipRow, OWNERSHIP_COLORS } from "@/features/ownership/calculateOwnership";

export type EquityModelLabel = "dynamic_pool" | "fixed_conversion" | null | undefined;

export function OwnershipPie({
  rows,
  equityModel,
}: {
  rows: OwnershipRow[];
  equityModel?: EquityModelLabel;
}) {
  const poolLabel =
    equityModel === "fixed_conversion"
      ? "Conversión fija de horas (disponible)"
      : "Pool de horas variable (disponible)";
  const data: { name: string; value: number; fill: string }[] = [];
  rows.forEach((r, i) => {
    const base = OWNERSHIP_COLORS[i % OWNERSHIP_COLORS.length];
    if (r.override != null) {
      data.push({
        name: `${r.name} — asignado admin`,
        value: Number(r.override.toFixed(2)),
        fill: base,
      });
      return;
    }
    if (r.fixed > 0) {
      data.push({
        name: `${r.name} — fijo`,
        value: Number(r.fixed.toFixed(2)),
        fill: base,
      });
    }
    if (r.variable > 0) {
      data.push({
        name: `${r.name} — variable`,
        value: Number(r.variable.toFixed(2)),
        fill: base.replace(/hsl\(([^)]+)\)/, (_, v) => `hsla(${v} / 0.5)`),
      });
    }
  });

  const assigned = data.reduce((s, d) => s + d.value, 0);
  const remaining = Math.max(0, Number((100 - assigned).toFixed(2)));
  if (remaining > 0.01) {
    data.push({
      name: "Pool variable disponible (sin asignar)",
      value: remaining,
      fill: "hsl(var(--muted))",
    });
  }

  if (data.length === 0) {
    return <div className="text-sm text-muted-foreground">Sin datos de propiedad todavía.</div>;
  }
  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={(e) => `${e.value}%`}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} stroke="hsl(var(--background))" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
