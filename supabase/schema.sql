-- HealthOS Database Schema
-- Run these in Supabase SQL Editor

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  gender TEXT,
  birth_date DATE,
  height_cm INTEGER,
  activity_level TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight entries
CREATE TABLE IF NOT EXISTS weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  notes TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal items (foods within a meal)
CREATE TABLE IF NOT EXISTS meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  barcode TEXT,
  calories INTEGER,
  protein_g DECIMAL(5,1),
  carbs_g DECIMAL(5,1),
  fat_g DECIMAL(5,1),
  fiber_g DECIMAL(5,1),
  sodium_mg INTEGER,
  serving_size DECIMAL(6,2),
  serving_unit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water entries
CREATE TABLE IF NOT EXISTS water_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep entries
CREATE TABLE IF NOT EXISTS sleep_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_hours DECIMAL(4,1) NOT NULL,
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  bed_time TIME,
  wake_time TIME,
  notes TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5) NOT NULL,
  energy INTEGER CHECK (energy >= 1 AND energy <= 5),
  stress INTEGER CHECK (stress >= 1 AND stress <= 5),
  notes TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplement logs
CREATE TABLE IF NOT EXISTS supplement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supplement_name TEXT NOT NULL,
  dosage TEXT,
  taken BOOLEAN DEFAULT FALSE,
  scheduled_time TIME,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blood tests
CREATE TABLE IF NOT EXISTS blood_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  test_name TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  reference_min DECIMAL(10,2),
  reference_max DECIMAL(10,2),
  status TEXT CHECK (status IN ('low', 'normal', 'high')),
  notes TEXT,
  tested_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  workout_type TEXT NOT NULL, -- strength, cardio, flexibility, etc.
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  notes TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meditation sessions
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  meditation_type TEXT,
  notes TEXT,
  recorded_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages (AI conversation history)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (medical documents, lab results, etc.)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  document_type TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON weight_entries(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_entries_user_date ON water_entries(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_entries_user_date ON sleep_entries(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_date ON supplement_logs(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_blood_tests_user_date ON blood_tests(user_id, tested_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_date ON meditation_sessions(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_date ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_user_date ON documents(user_id, uploaded_at DESC);
