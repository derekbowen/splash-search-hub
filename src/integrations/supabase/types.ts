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
      cities: {
        Row: {
          city_name: string
          city_slug: string
          created_at: string
          exclusivity_score: number | null
          id: string
          latitude: number | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          pool_count: number | null
          population: number | null
          population_score: number | null
          priority_score: number | null
          priority_tier: string | null
          prnm_exclusive: boolean | null
          prnm_url: string | null
          state_abbr: string
          state_density_score: number | null
          state_id: string
          state_slug: string
          swimply_has_page: boolean | null
        }
        Insert: {
          city_name: string
          city_slug: string
          created_at?: string
          exclusivity_score?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          pool_count?: number | null
          population?: number | null
          population_score?: number | null
          priority_score?: number | null
          priority_tier?: string | null
          prnm_exclusive?: boolean | null
          prnm_url?: string | null
          state_abbr: string
          state_density_score?: number | null
          state_id: string
          state_slug: string
          swimply_has_page?: boolean | null
        }
        Update: {
          city_name?: string
          city_slug?: string
          created_at?: string
          exclusivity_score?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          pool_count?: number | null
          population?: number | null
          population_score?: number | null
          priority_score?: number | null
          priority_tier?: string | null
          prnm_exclusive?: boolean | null
          prnm_url?: string | null
          state_abbr?: string
          state_density_score?: number | null
          state_id?: string
          state_slug?: string
          swimply_has_page?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      public_pools: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string | null
          city_id: string
          created_at: string
          description: string | null
          google_maps_url: string | null
          google_place_id: string | null
          hours_json: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          pool_type: string | null
          price_adult: string | null
          price_child: string | null
          price_notes: string | null
          rating: number | null
          review_count: number | null
          state: string | null
          updated_at: string
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          city_id: string
          created_at?: string
          description?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          hours_json?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          pool_type?: string | null
          price_adult?: string | null
          price_child?: string | null
          price_notes?: string | null
          rating?: number | null
          review_count?: number | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string | null
          city_id?: string
          created_at?: string
          description?: string | null
          google_maps_url?: string | null
          google_place_id?: string | null
          hours_json?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          pool_type?: string | null
          price_adult?: string | null
          price_child?: string | null
          price_notes?: string | null
          rating?: number | null
          review_count?: number | null
          state?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_pools_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          abbreviation: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          pool_count: number | null
          population: number | null
          slug: string
        }
        Insert: {
          abbreviation: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          pool_count?: number | null
          population?: number | null
          slug: string
        }
        Update: {
          abbreviation?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          pool_count?: number | null
          population?: number | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
