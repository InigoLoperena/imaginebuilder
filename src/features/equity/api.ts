import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  EquityPolicy,
  EquityPolicyInsert,
  EquityTransaction,
  SimulationResult,
} from "./types";

export function useProjectPolicies(projectId?: string) {
  return useQuery({
    queryKey: ["equity_policies", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<EquityPolicy[]> => {
      const { data, error } = await supabase
        .from("equity_policies")
        .select("*")
        .eq("project_id", projectId!)
        .order("version", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useActivePolicy(projectId?: string) {
  const { data: policies = [] } = useProjectPolicies(projectId);
  const active = policies.find((p) => p.is_active) ?? null;
  return { data: active, policies };
}

export function useCreatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<EquityPolicyInsert, "version" | "created_by">) => {
      const { data: existing } = await supabase
        .from("equity_policies")
        .select("version")
        .eq("project_id", input.project_id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      const version = (existing?.version ?? 0) + 1;
      const { data: userRes } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("equity_policies")
        .insert({ ...input, version, created_by: userRes.user?.id ?? null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["equity_policies", row.project_id] });
    },
  });
}

export function useActivatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (policy: EquityPolicy) => {
      const { error } = await supabase.rpc("equity_activate_policy", { _policy_id: policy.id });
      if (error) throw error;
      return policy;
    },
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: ["equity_policies", row.project_id] });
    },
  });
}

export function useProjectTransactions(projectId?: string) {
  return useQuery({
    queryKey: ["equity_tx", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<EquityTransaction[]> => {
      const { data, error } = await supabase
        .from("equity_transactions")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMyTransactions() {
  return useQuery({
    queryKey: ["equity_tx_me"],
    queryFn: async (): Promise<EquityTransaction[]> => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return [];
      const { data, error } = await supabase
        .from("equity_transactions")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePostCorrection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { project_id: string; user_id: string; delta: number; reason: string }) => {
      const { error } = await supabase.rpc("equity_post_correction", {
        _project_id: p.project_id,
        _user_id: p.user_id,
        _delta: p.delta,
        _reason: p.reason,
      });
      if (error) throw error;
    },
    onSuccess: (_r, vars) => {
      qc.invalidateQueries({ queryKey: ["equity_tx", vars.project_id] });
    },
  });
}

export function useSimulate() {
  return useMutation({
    mutationFn: async (p: {
      project_id: string;
      hours_per_percent: number;
      max_equity: number;
      rounding: "two" | "four" | "none";
    }): Promise<SimulationResult> => {
      const { data, error } = await supabase.rpc("equity_simulate_fixed", {
        _project_id: p.project_id,
        _hours_per_percent: p.hours_per_percent,
        _max_equity: p.max_equity,
        _rounding: p.rounding,
      });
      if (error) throw error;
      return data as unknown as SimulationResult;
    },
  });
}

export function useUpdateProjectEquityModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { project_id: string; model: "dynamic_pool" | "fixed_conversion" }) => {
      const { error } = await supabase
        .from("vb_projects")
        .update({ equity_model: p.model })
        .eq("id", p.project_id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vb_projects"] }),
  });
}

export function useUpdateHourStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { id: string; status: "approved" | "rejected" | "pending" }) => {
      const { data: userRes } = await supabase.auth.getUser();
      const patch: Record<string, unknown> = { status: p.status };
      if (p.status === "approved") {
        patch.approved_by = userRes.user?.id ?? null;
        patch.approved_at = new Date().toISOString();
      } else {
        patch.approved_by = null;
        patch.approved_at = null;
      }
      const { error } = await supabase.from("vb_time_entries").update(patch).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["time-entries"] });
      qc.invalidateQueries({ queryKey: ["equity_tx"] });
    },
  });
}
