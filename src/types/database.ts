export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blood_tests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          reference_max: number | null
          reference_min: number | null
          status: string | null
          test_name: string
          tested_at: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_max?: number | null
          reference_min?: number | null
          status?: string | null
          test_name: string
          tested_at?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_max?: number | null
          reference_min?: number | null
          status?: string | null
          test_name?: string
          tested_at?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          document_type: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          notes: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          document_type?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          notes?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          document_type?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          notes?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          barcode: string | null
          calories: number | null
          carbs_g: number | null
          created_at: string | null
          fat_g: number | null
          fiber_g: number | null
          food_name: string
          id: string
          meal_id: string
          protein_g: number | null
          serving_size: number | null
          serving_unit: string | null
          sodium_mg: number | null
        }
        Insert: {
          barcode?: string | null
          calories?: number | null
          carbs_g?: number | null
          created_at?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_name: string
          id?: string
          meal_id: string
          protein_g?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          sodium_mg?: number | null
        }
        Update: {
          barcode?: string | null
          calories?: number | null
          carbs_g?: number | null
          created_at?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          food_name?: string
          id?: string
          meal_id?: string
          protein_g?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          sodium_mg?: number | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          created_at: string | null
          id: string
          meal_type: string
          name: string
          recorded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_type: string
          name: string
          recorded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_type?: string
          name?: string
          recorded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meditation_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number
          id: string
          meditation_type: string | null
          notes: string | null
          recorded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          id?: string
          meditation_type?: string | null
          notes?: string | null
          recorded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          id?: string
          meditation_type?: string | null
          notes?: string | null
          recorded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string | null
          energy: number | null
          id: string
          mood: number
          notes: string | null
          recorded_at: string | null
          stress: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy?: number | null
          id?: string
          mood: number
          notes?: string | null
          recorded_at?: string | null
          stress?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy?: number | null
          id?: string
          mood?: number
          notes?: string | null
          recorded_at?: string | null
          stress?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          goal: string | null
          height_cm: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id: string
          updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sleep_entries: {
        Row: {
          bed_time: string | null
          created_at: string | null
          duration_hours: number
          id: string
          notes: string | null
          quality: number | null
          recorded_at: string | null
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bed_time?: string | null
          created_at?: string | null
          duration_hours: number
          id?: string
          notes?: string | null
          quality?: number | null
          recorded_at?: string | null
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bed_time?: string | null
          created_at?: string | null
          duration_hours?: number
          id?: string
          notes?: string | null
          quality?: number | null
          recorded_at?: string | null
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      supplement_logs: {
        Row: {
          created_at: string | null
          dosage: string | null
          id: string
          recorded_at: string | null
          scheduled_time: string | null
          supplement_name: string
          taken: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          recorded_at?: string | null
          scheduled_time?: string | null
          supplement_name: string
          taken?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          recorded_at?: string | null
          scheduled_time?: string | null
          supplement_name?: string
          taken?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      water_entries: {
        Row: {
          amount_ml: number
          created_at: string | null
          id: string
          recorded_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml: number
          created_at?: string | null
          id?: string
          recorded_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          id?: string
          recorded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          recorded_at: string | null
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string | null
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string | null
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          duration_minutes: number
          id: string
          name: string
          notes: string | null
          recorded_at: string | null
          user_id: string
          workout_type: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          name: string
          notes?: string | null
          recorded_at?: string | null
          user_id: string
          workout_type: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          notes?: string | null
          recorded_at?: string | null
          user_id?: string
          workout_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_data: { Args: { user_uuid: string }; Returns: undefined }
      export_user_data: { Args: { user_uuid: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
