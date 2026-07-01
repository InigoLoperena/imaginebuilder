import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { OwnershipRow, OWNERSHIP_COLORS } from "@/features/ownership/calculateOwnership";

export function OwnershipPie({ rows }: { rows: OwnershipRow[] }) {
  const data = rows.map((r) => ({ name: r.name, value: Number(r.total.toFixed(2)) }));
  if (data.length === 0) {
    return <div className="text-sm text-muted-foreground">Sin datos de propiedad todavía.</div>;
  }
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label={(e) => `${e.value}%`}>
            {data.map((_, i) => (
              <Cell key={i} fill={OWNERSHIP_COLORS[i % OWNERSHIP_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
