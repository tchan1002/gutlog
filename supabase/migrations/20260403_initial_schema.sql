-- GutLog Database Schema Setup
-- Created: 2026-04-03
-- Description: Initial database schema with users, food_library, food_logs, and gut_logs tables

-- ============================================================================
-- 1. Create users table
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. Create food_library table
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  emoji TEXT,
  calories_per_serving INTEGER NOT NULL,
  serving_size TEXT NOT NULL,
  is_pantry_staple BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. Create food_logs table
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES food_library(id) ON DELETE CASCADE,
  meal_label TEXT NOT NULL CHECK (meal_label IN ('breakfast', 'lunch', 'dinner', 'snack')),
  servings NUMERIC(5,2) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. Create gut_logs table
-- ============================================================================
CREATE TABLE IF NOT EXISTS gut_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bristol_score INTEGER NOT NULL CHECK (bristol_score BETWEEN 1 AND 7),
  gut_score INTEGER NOT NULL CHECK (gut_score BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  activity TEXT NOT NULL CHECK (activity IN ('rest', 'light', 'moderate', 'active')),
  note TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on food_library
ALTER TABLE food_library ENABLE ROW LEVEL SECURITY;

-- Enable RLS on food_logs
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on gut_logs
ALTER TABLE gut_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for food_library
-- ============================================================================

-- Allow users to read their own food library items
CREATE POLICY "Users can read own data" ON food_library
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own food library items
CREATE POLICY "Users can insert own data" ON food_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own food library items
CREATE POLICY "Users can update own data" ON food_library
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own food library items
CREATE POLICY "Users can delete own data" ON food_library
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies for food_logs
-- ============================================================================

-- Allow users to read their own food logs
CREATE POLICY "Users can read own data" ON food_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own food logs
CREATE POLICY "Users can insert own data" ON food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own food logs
CREATE POLICY "Users can update own data" ON food_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own food logs
CREATE POLICY "Users can delete own data" ON food_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies for gut_logs
-- ============================================================================

-- Allow users to read their own gut logs
CREATE POLICY "Users can read own data" ON gut_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own gut logs
CREATE POLICY "Users can insert own data" ON gut_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own gut logs
CREATE POLICY "Users can update own data" ON gut_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own gut logs
CREATE POLICY "Users can delete own data" ON gut_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- Seed Data
-- ============================================================================

-- Create a test user
-- Note: Replace this UUID with an actual auth.users UUID after authentication is set up
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert test user if it doesn't exist
  INSERT INTO users (id, email, created_at)
  VALUES (test_user_id, 'test@gutlog.app', NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Insert seed food items
  INSERT INTO food_library (user_id, name, category, emoji, calories_per_serving, serving_size, is_pantry_staple) VALUES
    (test_user_id, 'Eggs', 'protein', '🥚', 140, '2 eggs', false),
    (test_user_id, 'Bread', 'grain', '🍞', 80, '1 slice', false),
    (test_user_id, 'Avocado', 'fat', '🥑', 120, '1/2 avocado', false),
    (test_user_id, 'Chicken breast', 'protein', '🍗', 180, '4 oz', false),
    (test_user_id, 'Rice', 'grain', '🍚', 200, '1 cup', false),
    (test_user_id, 'Broccoli', 'vegetable', '🥦', 55, '1 cup', false),
    (test_user_id, 'Banana', 'fruit', '🍌', 105, '1 medium', false),
    (test_user_id, 'Milk', 'dairy', '🥛', 150, '1 cup', false),
    (test_user_id, 'Cheese', 'dairy', '🧀', 110, '1 oz', false),
    (test_user_id, 'Ground beef', 'protein', '🥩', 280, '4 oz', false),
    (test_user_id, 'Tomato', 'vegetable', '🍅', 22, '1 medium', false),
    (test_user_id, 'Mixed greens', 'vegetable', '🥗', 20, '2 cups', false),
    (test_user_id, 'Pasta', 'grain', '🍝', 220, '1 cup', false),
    (test_user_id, 'Potato', 'vegetable', '🥔', 160, '1 medium', false),
    (test_user_id, 'Black beans', 'protein', '🫘', 110, '1/2 cup', false),
    (test_user_id, 'Peanut butter', 'fat', '🥜', 190, '2 tbsp', false),
    (test_user_id, 'Apple', 'fruit', '🍎', 95, '1 medium', false),
    (test_user_id, 'Carrots', 'vegetable', '🥕', 50, '1 cup', false),
    (test_user_id, 'Bacon', 'protein', '🥓', 90, '2 strips', false),
    (test_user_id, 'Orange', 'fruit', '🍊', 62, '1 medium', false),
    (test_user_id, 'Olive oil', 'fat', '🫒', 120, '1 tbsp', true),
    (test_user_id, 'Butter', 'fat', '🧈', 100, '1 tbsp', true),
    (test_user_id, 'Garlic', 'seasoning', '🧄', 4, '1 clove', true),
    (test_user_id, 'Salt', 'seasoning', '🧂', 0, '1 tsp', true)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- Verification queries
-- ============================================================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'food_library' as table_name, COUNT(*) as record_count FROM food_library
UNION ALL
SELECT 'food_logs' as table_name, COUNT(*) as record_count FROM food_logs
UNION ALL
SELECT 'gut_logs' as table_name, COUNT(*) as record_count FROM gut_logs;
