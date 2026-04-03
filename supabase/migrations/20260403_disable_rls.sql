-- Disable RLS for No-Auth Mode
-- Created: 2026-04-03
-- Description: Disable Row Level Security since we're using a hardcoded test user

-- ============================================================================
-- Drop existing RLS policies
-- ============================================================================

-- Drop food_library policies
DROP POLICY IF EXISTS "Users can read own data" ON food_library;
DROP POLICY IF EXISTS "Users can insert own data" ON food_library;
DROP POLICY IF EXISTS "Users can update own data" ON food_library;
DROP POLICY IF EXISTS "Users can delete own data" ON food_library;

-- Drop food_logs policies
DROP POLICY IF EXISTS "Users can read own data" ON food_logs;
DROP POLICY IF EXISTS "Users can insert own data" ON food_logs;
DROP POLICY IF EXISTS "Users can update own data" ON food_logs;
DROP POLICY IF EXISTS "Users can delete own data" ON food_logs;

-- Drop gut_logs policies
DROP POLICY IF EXISTS "Users can read own data" ON gut_logs;
DROP POLICY IF EXISTS "Users can insert own data" ON gut_logs;
DROP POLICY IF EXISTS "Users can update own data" ON gut_logs;
DROP POLICY IF EXISTS "Users can delete own data" ON gut_logs;

-- ============================================================================
-- Disable Row Level Security
-- ============================================================================

ALTER TABLE food_library DISABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE gut_logs DISABLE ROW LEVEL SECURITY;
