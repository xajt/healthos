export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          birth_date: string | null;
          gender: "male" | "female" | "other" | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          target_weight_kg: number | null;
          activity_level:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          sleep_hours_target: number;
          work_type: string | null;
          stress_level: number | null;
          fitness_goal:
            | "lose_weight"
            | "gain_muscle"
            | "maintain"
            | "improve_health"
            | "increase_energy"
            | null;
          workout_frequency_per_week: number | null;
          preferred_workout_types: string[] | null;
          daily_calorie_target: number | null;
          daily_protein_target: number | null;
          daily_water_ml_target: number;
          primary_goals: string[] | null;
          allergies: string[] | null;
          medications: string[] | null;
          health_conditions: string[] | null;
          blood_type:
            | "A+"
            | "A-"
            | "B+"
            | "B-"
            | "AB+"
            | "AB-"
            | "O+"
            | "O-"
            | "unknown"
            | null;
          motivation_level: number | null;
          preferred_motivation_style: "gentle" | "moderate" | "intense" | null;
          mental_health_focus: string[] | null;
          onboarding_completed: boolean;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          birth_date?: string | null;
          gender?: "male" | "female" | "other" | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          target_weight_kg?: number | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          sleep_hours_target?: number;
          work_type?: string | null;
          stress_level?: number | null;
          fitness_goal?:
            | "lose_weight"
            | "gain_muscle"
            | "maintain"
            | "improve_health"
            | "increase_energy"
            | null;
          workout_frequency_per_week?: number | null;
          preferred_workout_types?: string[] | null;
          daily_calorie_target?: number | null;
          daily_protein_target?: number | null;
          daily_water_ml_target?: number;
          primary_goals?: string[] | null;
          allergies?: string[] | null;
          medications?: string[] | null;
          health_conditions?: string[] | null;
          blood_type?:
            | "A+"
            | "A-"
            | "B+"
            | "B-"
            | "AB+"
            | "AB-"
            | "O+"
            | "O-"
            | "unknown"
            | null;
          motivation_level?: number | null;
          preferred_motivation_style?: "gentle" | "moderate" | "intense" | null;
          mental_health_focus?: string[] | null;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          birth_date?: string | null;
          gender?: "male" | "female" | "other" | null;
          height_cm?: number | null;
          current_weight_kg?: number | null;
          target_weight_kg?: number | null;
          activity_level?:
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | null;
          sleep_hours_target?: number;
          work_type?: string | null;
          stress_level?: number | null;
          fitness_goal?:
            | "lose_weight"
            | "gain_muscle"
            | "maintain"
            | "improve_health"
            | "increase_energy"
            | null;
          workout_frequency_per_week?: number | null;
          preferred_workout_types?: string[] | null;
          daily_calorie_target?: number | null;
          daily_protein_target?: number | null;
          daily_water_ml_target?: number;
          primary_goals?: string[] | null;
          allergies?: string[] | null;
          medications?: string[] | null;
          health_conditions?: string[] | null;
          blood_type?:
            | "A+"
            | "A-"
            | "B+"
            | "B-"
            | "AB+"
            | "AB-"
            | "O+"
            | "O-"
            | "unknown"
            | null;
          motivation_level?: number | null;
          preferred_motivation_style?: "gentle" | "moderate" | "intense" | null;
          mental_health_focus?: string[] | null;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight_kg: number;
          body_fat_percentage: number | null;
          muscle_mass_kg: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight_kg: number;
          body_fat_percentage?: number | null;
          muscle_mass_kg?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight_kg?: number;
          body_fat_percentage?: number | null;
          muscle_mass_kg?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "other";
          calories: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fiber_g: number | null;
          notes: string | null;
          image_url: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack" | "other";
          calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          notes?: string | null;
          image_url?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack" | "other";
          calories?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          notes?: string | null;
          image_url?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      water_intake: {
        Row: {
          id: string;
          user_id: string;
          amount_ml: number;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount_ml: number;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount_ml?: number;
          recorded_at?: string;
          created_at?: string;
        };
      };
      supplements: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          dosage: string | null;
          frequency: "daily" | "weekly" | "as_needed" | null;
          time_of_day: "morning" | "afternoon" | "evening" | "with_meal" | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          dosage?: string | null;
          frequency?: "daily" | "weekly" | "as_needed" | null;
          time_of_day?: "morning" | "afternoon" | "evening" | "with_meal" | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          dosage?: string | null;
          frequency?: "daily" | "weekly" | "as_needed" | null;
          time_of_day?: "morning" | "afternoon" | "evening" | "with_meal" | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplement_logs: {
        Row: {
          id: string;
          user_id: string;
          supplement_id: string;
          taken_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          supplement_id: string;
          taken_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          supplement_id?: string;
          taken_at?: string;
          created_at?: string;
        };
      };
      sleep_records: {
        Row: {
          id: string;
          user_id: string;
          start_time: string;
          end_time: string;
          quality_rating: number | null;
          deep_sleep_minutes: number | null;
          rem_sleep_minutes: number | null;
          light_sleep_minutes: number | null;
          awake_minutes: number | null;
          heart_rate_avg: number | null;
          heart_rate_variability: number | null;
          respiratory_rate_avg: number | null;
          notes: string | null;
          source: "manual" | "healthkit" | "other" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_time: string;
          end_time: string;
          quality_rating?: number | null;
          deep_sleep_minutes?: number | null;
          rem_sleep_minutes?: number | null;
          light_sleep_minutes?: number | null;
          awake_minutes?: number | null;
          heart_rate_avg?: number | null;
          heart_rate_variability?: number | null;
          respiratory_rate_avg?: number | null;
          notes?: string | null;
          source?: "manual" | "healthkit" | "other" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_time?: string;
          end_time?: string;
          quality_rating?: number | null;
          deep_sleep_minutes?: number | null;
          rem_sleep_minutes?: number | null;
          light_sleep_minutes?: number | null;
          awake_minutes?: number | null;
          heart_rate_avg?: number | null;
          heart_rate_variability?: number | null;
          respiratory_rate_avg?: number | null;
          notes?: string | null;
          source?: "manual" | "healthkit" | "other" | null;
          created_at?: string;
        };
      };
      mood_checkins: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          energy_level: number | null;
          stress_level: number | null;
          anxiety_level: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: number;
          energy_level?: number | null;
          stress_level?: number | null;
          anxiety_level?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          energy_level?: number | null;
          stress_level?: number | null;
          anxiety_level?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      meditation_sessions: {
        Row: {
          id: string;
          user_id: string;
          technique: string;
          duration_minutes: number;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          technique: string;
          duration_minutes: number;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          technique?: string;
          duration_minutes?: number;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      blood_tests: {
        Row: {
          id: string;
          user_id: string;
          test_date: string;
          lab_name: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_date: string;
          lab_name?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_date?: string;
          lab_name?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      blood_test_results: {
        Row: {
          id: string;
          blood_test_id: string;
          parameter_name: string;
          value: number | null;
          unit: string | null;
          reference_min: number | null;
          reference_max: number | null;
          is_abnormal: boolean | null;
          ai_interpretation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          blood_test_id: string;
          parameter_name: string;
          value?: number | null;
          unit?: string | null;
          reference_min?: number | null;
          reference_max?: number | null;
          is_abnormal?: boolean | null;
          ai_interpretation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          blood_test_id?: string;
          parameter_name?: string;
          value?: number | null;
          unit?: string | null;
          reference_min?: number | null;
          reference_max?: number | null;
          is_abnormal?: boolean | null;
          ai_interpretation?: string | null;
          created_at?: string;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          goal: string | null;
          difficulty: "beginner" | "intermediate" | "advanced" | null;
          duration_weeks: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          goal?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced" | null;
          duration_weeks?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          goal?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced" | null;
          duration_weeks?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_plan_id: string | null;
          name: string;
          workout_type: string | null;
          duration_minutes: number | null;
          calories_burned: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_plan_id?: string | null;
          name: string;
          workout_type?: string | null;
          duration_minutes?: number | null;
          calories_burned?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_plan_id?: string | null;
          name?: string;
          workout_type?: string | null;
          duration_minutes?: number | null;
          calories_burned?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_session_id: string;
          name: string;
          sets: number | null;
          reps: number | null;
          weight_kg: number | null;
          duration_seconds: number | null;
          rest_seconds: number | null;
          notes: string | null;
          order_index: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_session_id: string;
          name: string;
          sets?: number | null;
          reps?: number | null;
          weight_kg?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
          notes?: string | null;
          order_index?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_session_id?: string;
          name?: string;
          sets?: number | null;
          reps?: number | null;
          weight_kg?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
          notes?: string | null;
          order_index?: number | null;
          created_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          body_part: "front" | "back" | "side" | "legs" | "arms" | "abs" | "other" | null;
          weight_kg: number | null;
          notes: string | null;
          ai_analysis: Json | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          body_part?: "front" | "back" | "side" | "legs" | "arms" | "abs" | "other" | null;
          weight_kg?: number | null;
          notes?: string | null;
          ai_analysis?: Json | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          body_part?: "front" | "back" | "side" | "legs" | "arms" | "abs" | "other" | null;
          weight_kg?: number | null;
          notes?: string | null;
          ai_analysis?: Json | null;
          recorded_at?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          context: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          context?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          context?: Json | null;
          created_at?: string;
        };
      };
      healthkit_sync: {
        Row: {
          id: string;
          user_id: string;
          last_sync_at: string | null;
          sync_type: string | null;
          records_synced: number;
          status: "pending" | "in_progress" | "completed" | "failed" | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          last_sync_at?: string | null;
          sync_type?: string | null;
          records_synced?: number;
          status?: "pending" | "in_progress" | "completed" | "failed" | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          last_sync_at?: string | null;
          sync_type?: string | null;
          records_synced?: number;
          status?: "pending" | "in_progress" | "completed" | "failed" | null;
          error_message?: string | null;
          created_at?: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          insight_type: string;
          title: string;
          content: string;
          severity: "info" | "warning" | "alert" | null;
          is_read: boolean;
          is_actionable: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          insight_type: string;
          title: string;
          content: string;
          severity?: "info" | "warning" | "alert" | null;
          is_read?: boolean;
          is_actionable?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          insight_type?: string;
          title?: string;
          content?: string;
          severity?: "info" | "warning" | "alert" | null;
          is_read?: boolean;
          is_actionable?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      weather_cache: {
        Row: {
          id: string;
          location: string;
          temperature_c: number | null;
          humidity: number | null;
          weather_condition: string | null;
          cached_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          location: string;
          temperature_c?: number | null;
          humidity?: number | null;
          weather_condition?: string | null;
          cached_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          location?: string;
          temperature_c?: number | null;
          humidity?: number | null;
          weather_condition?: string | null;
          cached_at?: string;
          expires_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type WeightEntry = Database["public"]["Tables"]["weight_entries"]["Row"];
export type Meal = Database["public"]["Tables"]["meals"]["Row"];
export type WaterIntake = Database["public"]["Tables"]["water_intake"]["Row"];
export type Supplement = Database["public"]["Tables"]["supplements"]["Row"];
export type SupplementLog = Database["public"]["Tables"]["supplement_logs"]["Row"];
export type SleepRecord = Database["public"]["Tables"]["sleep_records"]["Row"];
export type MoodCheckin = Database["public"]["Tables"]["mood_checkins"]["Row"];
export type MeditationSession = Database["public"]["Tables"]["meditation_sessions"]["Row"];
export type BloodTest = Database["public"]["Tables"]["blood_tests"]["Row"];
export type BloodTestResult = Database["public"]["Tables"]["blood_test_results"]["Row"];
export type WorkoutPlan = Database["public"]["Tables"]["workout_plans"]["Row"];
export type WorkoutSession = Database["public"]["Tables"]["workout_sessions"]["Row"];
export type WorkoutExercise = Database["public"]["Tables"]["workout_exercises"]["Row"];
export type ProgressPhoto = Database["public"]["Tables"]["progress_photos"]["Row"];
export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
export type HealthkitSync = Database["public"]["Tables"]["healthkit_sync"]["Row"];
export type AiInsight = Database["public"]["Tables"]["ai_insights"]["Row"];
export type WeatherCache = Database["public"]["Tables"]["weather_cache"]["Row"];
