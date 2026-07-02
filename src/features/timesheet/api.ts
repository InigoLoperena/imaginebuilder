import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EntrySource = "tracked" | "edited" | "manual";

export interface TimeEntry {
  id: string;
  project_id: string;
  user_id: string;
  hours: number;
  work_date: string;
  description: string | null;
  source: EntrySource;
  created_at: string;
}

export function useProjectEntries(projectId?: string) {
  return useQuery({
    queryKey: ["vb_entries", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from("vb_time_entries")
        .select("*")
        .eq("project_id", projectId!)
        .order("work_date", { ascending: false });
      if (error) throw error;
      return data as TimeEntry[];
    },
  });
}

export function useAllEntries() {
  return useQuery({
    queryKey: ["vb_entries_all"],
    queryFn: async (): Promise<TimeEntry[]> => {
      const { data, error } = await supabase
        .from("vb_time_entries")
        .select("*")
        .order("work_date", { ascending: false });
      if (error) throw error;
      return data as TimeEntry[];
    },
  });
}

export function useAddEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: {
      project_id: string;
      hours: number;
      work_date: string;
      description?: string;
      source: EntrySource;
    }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not authenticated");
      const { error } = await supabase.from("vb_time_entries").insert({
        project_id: e.project_id,
        user_id: u.user.id,
        hours: e.hours,
        work_date: e.work_date,
        description: e.description ?? null,
        source: e.source,
      } as never);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["vb_entries", v.project_id] });
      qc.invalidateQueries({ queryKey: ["vb_entries_all"] });
    },
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: {
      id: string;
      hours: number;
      work_date: string;
      description?: string | null;
    }) => {
      const { error } = await supabase
        .from("vb_time_entries")
        .update({
          hours: e.hours,
          work_date: e.work_date,
          description: e.description ?? null,
          source: "edited",
        } as never)
        .eq("id", e.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vb_entries"] });
      qc.invalidateQueries({ queryKey: ["vb_entries_all"] });
    },
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vb_time_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vb_entries"] });
      qc.invalidateQueries({ queryKey: ["vb_entries_all"] });
    },
  });
}
