-- HealthOS Database Schema
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (User onboarding data)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,

  -- Basic info (Step 1)
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),

  -- Health metrics (Step 2)
  height_cm INTEGER,
  current_weight_kg DECIMAL(5,2),
  target_weight_kg DECIMAL(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),

  -- Lifestyle (Step 3)
  sleep_hours_target INTEGER DEFAULT 8,
  work_type TEXT,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),

  -- Fitness (Step 4)
  fitness_goal TEXT CHECK (fitness_goal IN ('lose_weight', 'gain_muscle', 'maintain', 'improve_health', 'increase_energy')),
  workout_frequency_per_week INTEGER,
  preferred_workout_types TEXT[],

  -- Goals (Step 5)
  daily_calorie_target INTEGER,
  daily_protein_target INTEGER,
  daily_water_ml_target INTEGER DEFAULT 2000,
  primary_goals TEXT[],

  -- Medical (Step 6)
  allergies TEXT[],
  medications TEXT[],
  health_conditions TEXT[],
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),

  -- Psychological (Step 7)
  motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
  preferred_motivation_style TEXT CHECK (preferred_motivation_style IN ('gentle', 'moderate', 'intense')),
  mental_health_focus TEXT[],

  -- Metadata
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEIGHT ENTRIES
-- ============================================
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  body_fat_percentage DECIMAL(4,1),
  muscle_mass_kg DECIMAL(5,2),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEALS
-- ============================================
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'other')),
  calories INTEGER,
  protein_g DECIMAL(6,1),
  carbs_g DECIMAL(6,1),
  fat_g DECIMAL(6,1),
  fiber_g DECIMAL(6,1),
  notes TEXT,
  image_url TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WATER INTAKE
-- ============================================
CREATE TABLE water_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUPPLEMENTS
-- ============================================
CREATE TABLE supplements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'as_needed')),
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'with_meal')),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supplement_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplement_id UUID NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SLEEP RECORDS
-- ============================================
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 10),
  deep_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  light_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  heart_rate_avg INTEGER,
  heart_rate_variability INTEGER,
  respiratory_rate_avg DECIMAL(4,1),
  notes TEXT,
  source TEXT CHECK (source IN ('manual', 'healthkit', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MOOD CHECKINS
-- ============================================
CREATE TABLE mood_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5) NOT NULL,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 5),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEDITATION SESSIONS
-- ============================================
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technique TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOOD TESTS
-- ============================================
CREATE TABLE blood_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  lab_name TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blood_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_test_id UUID NOT NULL REFERENCES blood_tests(id) ON DELETE CASCADE,
  parameter_name TEXT NOT NULL,
  value DECIMAL(10,3),
  unit TEXT,
  reference_min DECIMAL(10,3),
  reference_max DECIMAL(10,3),
  is_abnormal BOOLEAN,
  ai_interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKOUT PLANS
-- ============================================
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  workout_type TEXT,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  notes TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESS PHOTOS
-- ============================================
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  body_part TEXT CHECK (body_part IN ('front', 'back', 'side', 'legs', 'arms', 'abs', 'other')),
  weight_kg DECIMAL(5,2),
  notes TEXT,
  ai_analysis JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES (AI Chatbot)
-- ============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HEALTHKIT SYNC
-- ============================================
CREATE TABLE healthkit_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_sync_at TIMESTAMPTZ,
  sync_type TEXT,
  records_synced INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI INSIGHTS
-- ============================================
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'alert')),
  is_read BOOLEAN DEFAULT FALSE,
  is_actionable BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEATHER (for hydration adjustment)
-- ============================================
CREATE TABLE weather_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL,
  temperature_c DECIMAL(4,1),
  humidity INTEGER,
  weather_condition TEXT,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_recorded_at ON weight_entries(recorded_at);
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_recorded_at ON meals(recorded_at);
CREATE INDEX idx_water_intake_user_id ON water_intake(user_id);
CREATE INDEX idx_water_intake_recorded_at ON water_intake(recorded_at);
CREATE INDEX idx_sleep_records_user_id ON sleep_records(user_id);
CREATE INDEX idx_mood_checkins_user_id ON mood_checkins(user_id);
CREATE INDEX idx_meditation_sessions_user_id ON meditation_sessions(user_id);
CREATE INDEX idx_blood_tests_user_id ON blood_tests(user_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthkit_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own weight entries" ON weight_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meals" ON meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own water intake" ON water_intake FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supplements" ON supplements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own supplement logs" ON supplement_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sleep records" ON sleep_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own mood checkins" ON mood_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own meditation sessions" ON meditation_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own blood tests" ON blood_tests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own blood test results" ON blood_test_results FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM blood_tests WHERE id = blood_test_id)
);
CREATE POLICY "Users can manage own workout plans" ON workout_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workout sessions" ON workout_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workout exercises" ON workout_exercises FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM workout_sessions WHERE id = workout_session_id)
);
CREATE POLICY "Users can manage own progress photos" ON progress_photos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat messages" ON chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own healthkit sync" ON healthkit_sync FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ai insights" ON ai_insights FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_supplements_updated_at
  BEFORE UPDATE ON supplements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_workout_plans_updated_at
  BEFORE UPDATE ON workout_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Note: Create these buckets in Supabase Dashboard:
-- - progress-photos (for body composition photos)
-- - blood-tests (for blood test document images)
-- - meal-photos (for meal tracking photos)
