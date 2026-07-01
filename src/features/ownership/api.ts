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
