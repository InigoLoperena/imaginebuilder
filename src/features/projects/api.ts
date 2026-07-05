import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  pitch_deck_url: string | null;
  description: string | null;
  visible_landing: boolean;
  visible_internal: boolean;
  equity_model: "dynamic_pool" | "fixed_conversion";
  created_at: string;
}

export type ProjectInput = {
  id?: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  pitch_deck_url?: string | null;
  description?: string | null;
  visible_landing?: boolean;
  visible_internal?: boolean;
};

export function useProjects() {
  return useQuery({
    queryKey: ["vb_projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("vb_projects")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(id?: string) {
  return useQuery({
    queryKey: ["vb_project", id],
    enabled: !!id,
    queryFn: async (): Promise<Project | null> => {
      const { data, error } = await supabase.from("vb_projects").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data as Project | null;
    },
  });
}

export function useLogoUrl(path: string | null) {
  return useQuery({
    queryKey: ["logo-signed", path],
    enabled: !!path,
    staleTime: 55 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("project-logos").createSignedUrl(path!, 60 * 60);
      if (error) throw error;
      return data.signedUrl;
    },
  });
}

export function useUpsertProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: ProjectInput) => {
      const payload: Record<string, unknown> = {
        name: p.name,
        logo_url: p.logo_url ?? null,
        website_url: p.website_url ?? null,
        pitch_deck_url: p.pitch_deck_url ?? null,
        description: p.description ?? null,
      };
      if (p.visible_landing !== undefined) payload.visible_landing = p.visible_landing;
      if (p.visible_internal !== undefined) payload.visible_internal = p.visible_internal;
      if (p.id) {
        const { error } = await supabase.from("vb_projects").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vb_projects").insert(payload as { name: string });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vb_projects"] }),
  });
}

export function useToggleProjectVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { id: string; field: "visible_landing" | "visible_internal"; value: boolean }) => {
      const { error } = await supabase.from("vb_projects").update({ [p.field]: p.value }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vb_projects"] }),
  });
}

export interface AppSettings {
  landing_projects_section_visible: boolean;
  internal_projects_section_visible: boolean;
}

export function useAppSettings() {
  return useQuery({
    queryKey: ["vb_app_settings"],
    queryFn: async (): Promise<AppSettings> => {
      const { data, error } = await supabase
        .from("vb_app_settings")
        .select("landing_projects_section_visible, internal_projects_section_visible")
        .maybeSingle();
      if (error) throw error;
      return (data as AppSettings) ?? { landing_projects_section_visible: true, internal_projects_section_visible: true };
    },
  });
}

export function useUpdateAppSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<AppSettings>) => {
      const { error } = await supabase.from("vb_app_settings").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vb_app_settings"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vb_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vb_projects"] }),
  });
}

export async function uploadProjectLogo(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("project-logos").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}
