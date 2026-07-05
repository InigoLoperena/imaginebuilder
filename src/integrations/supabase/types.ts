export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ambassador_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          nickname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          nickname: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          nickname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string | null
          account_type: string
          bank_name: string | null
          created_at: string
          iban: string | null
          id: string
          routing_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number?: string | null
          account_type?: string
          bank_name?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          routing_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string | null
          account_type?: string
          bank_name?: string | null
          created_at?: string
          iban?: string | null
          id?: string
          routing_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      beta_testers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string | null
          cover_image_url: string | null
          created_at: string
          description: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          description: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_payment_methods: {
        Row: {
          bank_ars: string | null
          bank_usd: string | null
          created_at: string
          employee_name: string
          global_username: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bank_ars?: string | null
          bank_usd?: string | null
          created_at?: string
          employee_name: string
          global_username?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          bank_ars?: string | null
          bank_usd?: string | null
          created_at?: string
          employee_name?: string
          global_username?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_time_entries: {
        Row: {
          created_at: string
          description: string | null
          employee_name: string
          end_time: string | null
          entry_source: string
          id: string
          start_time: string
          total_minutes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_name: string
          end_time?: string | null
          entry_source?: string
          id?: string
          start_time: string
          total_minutes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_name?: string
          end_time?: string | null
          entry_source?: string
          id?: string
          start_time?: string
          total_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_submissions: {
        Row: {
          admin_notes: string | null
          ambassador_id: string
          approved_at: string | null
          approved_by: string | null
          city: string
          commission_amount: number | null
          created_at: string
          id: string
          status: string
          store_name: string
          store_url: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          ambassador_id: string
          approved_at?: string | null
          approved_by?: string | null
          city: string
          commission_amount?: number | null
          created_at?: string
          id?: string
          status?: string
          store_name: string
          store_url: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          ambassador_id?: string
          approved_at?: string | null
          approved_by?: string | null
          city?: string
          commission_amount?: number | null
          created_at?: string
          id?: string
          status?: string
          store_name?: string
          store_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vb_app_settings: {
        Row: {
          id: boolean
          internal_projects_section_visible: boolean
          landing_projects_section_visible: boolean
          updated_at: string
        }
        Insert: {
          id?: boolean
          internal_projects_section_visible?: boolean
          landing_projects_section_visible?: boolean
          updated_at?: string
        }
        Update: {
          id?: boolean
          internal_projects_section_visible?: boolean
          landing_projects_section_visible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      vb_fixed_ownership: {
        Row: {
          created_at: string
          id: string
          percentage: number
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          percentage: number
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          percentage?: number
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vb_fixed_ownership_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "vb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vb_ownership_override: {
        Row: {
          created_at: string
          id: string
          percentage: number
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          percentage: number
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          percentage?: number
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vb_ownership_override_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "vb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vb_participation_history: {
        Row: {
          added_user_id: string
          after_state: Json
          before_state: Json
          created_at: string
          id: string
          percentage_added: number
          performed_by: string
          project_id: string
        }
        Insert: {
          added_user_id: string
          after_state: Json
          before_state: Json
          created_at?: string
          id?: string
          percentage_added: number
          performed_by: string
          project_id: string
        }
        Update: {
          added_user_id?: string
          after_state?: Json
          before_state?: Json
          created_at?: string
          id?: string
          percentage_added?: number
          performed_by?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vb_participation_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "vb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vb_participations: {
        Row: {
          created_at: string
          id: string
          percentage: number
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          percentage: number
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          percentage?: number
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vb_participations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "vb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vb_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          pitch_deck_url: string | null
          updated_at: string
          visible_internal: boolean
          visible_landing: boolean
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          pitch_deck_url?: string | null
          updated_at?: string
          visible_internal?: boolean
          visible_landing?: boolean
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          pitch_deck_url?: string | null
          updated_at?: string
          visible_internal?: boolean
          visible_landing?: boolean
          website_url?: string | null
        }
        Relationships: []
      }
      vb_time_entries: {
        Row: {
          created_at: string
          description: string | null
          hours: number
          id: string
          project_id: string
          source: string
          user_id: string
          work_date: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hours: number
          id?: string
          project_id: string
          source?: string
          user_id: string
          work_date?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hours?: number
          id?: string
          project_id?: string
          source?: string
          user_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "vb_time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "vb_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_time_entries: {
        Row: {
          created_at: string
          description: string | null
          employee_name: string
          end_time: string | null
          entry_source: string | null
          id: string
          project_name: string
          start_time: string
          total_minutes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_name: string
          end_time?: string | null
          entry_source?: string | null
          id?: string
          project_name: string
          start_time: string
          total_minutes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_name?: string
          end_time?: string | null
          entry_source?: string | null
          id?: string
          project_name?: string
          start_time?: string
          total_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_ambassador_leaderboard: {
        Args: never
        Returns: {
          nickname: string
          stores_count: number
          total_earned: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      vb_add_member_with_dilution: {
        Args: { _new_user_id: string; _percentage: number; _project_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "ambassador" | "premium_ambassador" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["ambassador", "premium_ambassador", "admin", "member"],
    },
  },
} as const
