import { FixedOwnership, Profile } from "./api";
import { TimeEntry } from "../timesheet/api";

export interface OwnershipRow {
  user_id: string;
  name: string;
  hours: number;
  fixed: number;
  variable: number;
  total: number;
}

export function calculateOwnership(
  profiles: Profile[],
  entries: TimeEntry[],
  fixed: FixedOwnership[],
): OwnershipRow[] {
  const fixedByUser = new Map(fixed.map((f) => [f.user_id, Number(f.percentage)]));
  const totalFixed = fixed.reduce((s, f) => s + Number(f.percentage), 0);
  const pool = Math.max(0, 100 - totalFixed);

  const hoursByUser = new Map<string, number>();
  for (const e of entries) {
    hoursByUser.set(e.user_id, (hoursByUser.get(e.user_id) ?? 0) + Number(e.hours));
  }
  const totalHours = Array.from(hoursByUser.values()).reduce((a, b) => a + b, 0);

  const userIds = new Set<string>([
    ...profiles.map((p) => p.id),
    ...fixedByUser.keys(),
    ...hoursByUser.keys(),
  ]);

  const rows: OwnershipRow[] = [];
  for (const uid of userIds) {
    const profile = profiles.find((p) => p.id === uid);
    const hours = hoursByUser.get(uid) ?? 0;
    const fx = fixedByUser.get(uid) ?? 0;
    const variable = totalHours > 0 ? (pool * hours) / totalHours : 0;
    const total = fx + variable;
    if (total === 0 && hours === 0) continue;
    rows.push({
      user_id: uid,
      name: profile?.full_name || profile?.email || uid.slice(0, 8),
      hours,
      fixed: fx,
      variable,
      total,
    });
  }
  return rows.sort((a, b) => b.total - a.total);
}

export const OWNERSHIP_COLORS = [
  "hsl(174 72% 56%)",
  "hsl(15 90% 60%)",
  "hsl(210 90% 60%)",
  "hsl(140 60% 55%)",
  "hsl(48 95% 60%)",
  "hsl(280 65% 65%)",
  "hsl(340 75% 60%)",
  "hsl(25 85% 55%)",
];
