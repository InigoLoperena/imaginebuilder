import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { OwnershipRow, OWNERSHIP_COLORS } from "@/features/ownership/calculateOwnership";

export function OwnershipPie({ rows }: { rows: OwnershipRow[] }) {
  const data: { name: string; value: number; fill: string }[] = [];
  rows.forEach((r, i) => {
    const base = OWNERSHIP_COLORS[i % OWNERSHIP_COLORS.length];
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
