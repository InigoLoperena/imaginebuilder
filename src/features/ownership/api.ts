import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}
export interface FixedOwnership {
  id: string;
  project_id: string;
  user_id: string;
  percentage: number;
}
export interface OwnershipOverride {
  id: string;
  project_id: string;
  user_id: string;
  percentage: number;
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useProjectFixed(projectId?: string) {
  return useQuery({
    queryKey: ["vb_fixed", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<FixedOwnership[]> => {
      const { data, error } = await supabase.from("vb_fixed_ownership").select("*").eq("project_id", projectId!);
      if (error) throw error;
      return data as FixedOwnership[];
    },
  });
}

export function useSetFixed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: { project_id: string; user_id: string; percentage: number }) => {
      if (f.percentage <= 0) {
        const { error } = await supabase
          .from("vb_fixed_ownership")
          .delete()
          .eq("project_id", f.project_id)
          .eq("user_id", f.user_id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase
        .from("vb_fixed_ownership")
        .upsert({ project_id: f.project_id, user_id: f.user_id, percentage: f.percentage }, { onConflict: "project_id,user_id" });
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["vb_fixed", v.project_id] }),
  });
}

export function useProjectOverrides(projectId?: string) {
  return useQuery({
    queryKey: ["vb_override", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<OwnershipOverride[]> => {
      const { data, error } = await supabase
        .from("vb_ownership_override")
        .select("*")
        .eq("project_id", projectId!);
      if (error) throw error;
      return data as OwnershipOverride[];
    },
  });
}

export function useSetOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { project_id: string; user_id: string; percentage: number | null }) => {
      if (v.percentage == null) {
        const { error } = await supabase
          .from("vb_ownership_override")
          .delete()
          .eq("project_id", v.project_id)
          .eq("user_id", v.user_id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase
        .from("vb_ownership_override")
        .upsert(
          { project_id: v.project_id, user_id: v.user_id, percentage: v.percentage },
          { onConflict: "project_id,user_id" },
        );
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["vb_override", v.project_id] }),
  });
}

export interface Participation {
  id: string;
  project_id: string;
  user_id: string;
  percentage: number;
}

export interface ParticipationHistory {
  id: string;
  project_id: string;
  added_user_id: string;
  percentage_added: number;
  before_state: { user_id: string; percentage: number }[];
  after_state: { user_id: string; percentage: number }[];
  performed_by: string;
  created_at: string;
}

export function useParticipations(projectId?: string) {
  return useQuery({
    queryKey: ["vb_participations", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<Participation[]> => {
      const { data, error } = await supabase
        .from("vb_participations")
        .select("*")
        .eq("project_id", projectId!)
        .order("percentage", { ascending: false });
      if (error) throw error;
      return data as Participation[];
    },
  });
}

export function useParticipationHistory(projectId?: string) {
  return useQuery({
    queryKey: ["vb_participation_history", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<ParticipationHistory[]> => {
      const { data, error } = await supabase
        .from("vb_participation_history")
        .select("*")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ParticipationHistory[];
    },
  });
}

export function useAddMemberWithDilution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { project_id: string; user_id: string; percentage: number }) => {
      const { data, error } = await supabase.rpc("vb_add_member_with_dilution", {
        _project_id: v.project_id,
        _new_user_id: v.user_id,
        _percentage: v.percentage,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["vb_participations", v.project_id] });
      qc.invalidateQueries({ queryKey: ["vb_participation_history", v.project_id] });
    },
  });
}
