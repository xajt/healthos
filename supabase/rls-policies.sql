-- HealthOS RLS Policies
-- Run these in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Weight entries policies
CREATE POLICY "Users can view own weight entries" ON weight_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" ON weight_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries" ON weight_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries" ON weight_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- Meal items policies
CREATE POLICY "Users can view own meal items" ON meal_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own meal items" ON meal_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal items" ON meal_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
  );

-- Water entries policies
CREATE POLICY "Users can view own water entries" ON water_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water entries" ON water_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water entries" ON water_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own water entries" ON water_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Sleep entries policies
CREATE POLICY "Users can view own sleep entries" ON sleep_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep entries" ON sleep_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep entries" ON sleep_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep entries" ON sleep_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Mood entries policies
CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Supplement logs policies
CREATE POLICY "Users can view own supplement logs" ON supplement_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own supplement logs" ON supplement_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own supplement logs" ON supplement_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own supplement logs" ON supplement_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Blood tests policies
CREATE POLICY "Users can view own blood tests" ON blood_tests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blood tests" ON blood_tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blood tests" ON blood_tests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blood tests" ON blood_tests
  FOR DELETE USING (auth.uid() = user_id);

-- Workout sessions policies
CREATE POLICY "Users can view own workout sessions" ON workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions" ON workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions" ON workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sessions" ON workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Meditation sessions policies
CREATE POLICY "Users can view own meditation sessions" ON meditation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meditation sessions" ON meditation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meditation sessions" ON meditation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meditation sessions" ON meditation_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- GDPR: Function to delete all user data
CREATE OR REPLACE FUNCTION delete_user_data(user_uuid UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM weight_entries WHERE user_id = user_uuid;
  DELETE FROM water_entries WHERE user_id = user_uuid;
  DELETE FROM sleep_entries WHERE user_id = user_uuid;
  DELETE FROM mood_entries WHERE user_id = user_uuid;
  DELETE FROM supplement_logs WHERE user_id = user_uuid;
  DELETE FROM blood_tests WHERE user_id = user_uuid;
  DELETE FROM workout_sessions WHERE user_id = user_uuid;
  DELETE FROM meditation_sessions WHERE user_id = user_uuid;
  DELETE FROM chat_messages WHERE user_id = user_uuid;
  DELETE FROM documents WHERE user_id = user_uuid;
  DELETE FROM meal_items WHERE meal_id IN (SELECT id FROM meals WHERE user_id = user_uuid);
  DELETE FROM meals WHERE user_id = user_uuid;
  DELETE FROM profiles WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- GDPR: Function to export all user data
CREATE OR REPLACE FUNCTION export_user_data(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', (SELECT row_to_json(*) FROM profiles WHERE id = user_uuid),
    'weight_entries', (SELECT json_agg(row_to_json(*)) FROM weight_entries WHERE user_id = user_uuid),
    'meals', (SELECT json_agg(row_to_json(*)) FROM meals WHERE user_id = user_uuid),
    'water_entries', (SELECT json_agg(row_to_json(*)) FROM water_entries WHERE user_id = user_uuid),
    'sleep_entries', (SELECT json_agg(row_to_json(*)) FROM sleep_entries WHERE user_id = user_uuid),
    'mood_entries', (SELECT json_agg(row_to_json(*)) FROM mood_entries WHERE user_id = user_uuid),
    'supplement_logs', (SELECT json_agg(row_to_json(*)) FROM supplement_logs WHERE user_id = user_uuid),
    'blood_tests', (SELECT json_agg(row_to_json(*)) FROM blood_tests WHERE user_id = user_uuid),
    'workout_sessions', (SELECT json_agg(row_to_json(*)) FROM workout_sessions WHERE user_id = user_uuid),
    'meditation_sessions', (SELECT json_agg(row_to_json(*)) FROM meditation_sessions WHERE user_id = user_uuid),
    'chat_messages', (SELECT json_agg(row_to_json(*)) FROM chat_messages WHERE user_id = user_uuid),
    'documents', (SELECT json_agg(row_to_json(*)) FROM documents WHERE user_id = user_uuid),
    'exported_at', NOW()
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
