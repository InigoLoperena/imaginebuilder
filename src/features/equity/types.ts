import type { Database } from "@/integrations/supabase/types";

export type EquityModel = Database["public"]["Enums"]["equity_model"];
export type EquityCountMode = Database["public"]["Enums"]["equity_count_mode"];
export type EquityRounding = Database["public"]["Enums"]["equity_rounding"];
export type HourEntryStatus = Database["public"]["Enums"]["hour_entry_status"];

export type EquityPolicy = Database["public"]["Tables"]["equity_policies"]["Row"];
export type EquityPolicyInsert = Database["public"]["Tables"]["equity_policies"]["Insert"];
export type EquityTransaction = Database["public"]["Tables"]["equity_transactions"]["Row"];

export interface SimulationRow {
  user_id: string;
  hours: number;
  pct: number;
}

export interface SimulationResult {
  rows: SimulationRow[];
  total_allocated: number;
  max_equity: number;
}
