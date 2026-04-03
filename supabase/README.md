# GutLog Supabase Database Setup

This directory contains the database schema and migrations for GutLog.

## Quick Start

There are three ways to apply the database schema:

### Option 1: Via Supabase Dashboard (Recommended for first-time setup)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/20260403_initial_schema.sql`
4. Click "Run" to execute the migration

### Option 2: Via Supabase CLI

First, authenticate with Supabase:

```bash
# Get your access token from: https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token-here"

# Link to your project
supabase link --project-ref iolenyutbulfpgikfsfi

# Apply the migration
supabase db push
```

### Option 3: Via MCP Server

If you have the Supabase MCP server properly configured with authentication, you can use MCP tools to execute SQL commands directly.

## Database Schema

The schema includes four main tables:

### 1. `users`
Stores user account information.

### 2. `food_library`
User's personal food database with nutritional information.
- Supports categories, emojis, and pantry staples
- Each user has their own food library

### 3. `food_logs`
Tracks what users eat throughout the day.
- Links to food_library items
- Records meal type (breakfast, lunch, dinner, snack)
- Tracks serving sizes

### 4. `gut_logs`
Records gut health observations.
- Bristol score (1-7)
- Gut comfort score (1-5)
- Activity level
- Tags and notes

## Row Level Security (RLS)

All tables (except `users`) have RLS enabled with policies that ensure:
- Users can only access their own data
- Full CRUD operations are available for owned records

## Seed Data

The migration includes 24 common food items to get started:
- 🥚 Eggs, 🍞 Bread, 🥑 Avocado, 🍗 Chicken breast
- 🍚 Rice, 🥦 Broccoli, 🍌 Banana, 🥛 Milk
- 🧀 Cheese, 🥩 Ground beef, 🍅 Tomato, 🥗 Mixed greens
- 🍝 Pasta, 🥔 Potato, 🫘 Black beans, 🥜 Peanut butter
- 🍎 Apple, 🥕 Carrots, 🥓 Bacon, 🍊 Orange
- 🫒 Olive oil (pantry), 🧈 Butter (pantry), 🧄 Garlic (pantry), 🧂 Salt (pantry)

## Verification

After running the migration, verify the setup:

```sql
-- Check table counts
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'food_library' as table_name, COUNT(*) as record_count FROM food_library
UNION ALL
SELECT 'food_logs' as table_name, COUNT(*) as record_count FROM food_logs
UNION ALL
SELECT 'gut_logs' as table_name, COUNT(*) as record_count FROM gut_logs;
```

Expected results:
- users: 1 (test user)
- food_library: 24 (seed data)
- food_logs: 0
- gut_logs: 0

## Next Steps

1. Apply the migration using one of the methods above
2. Update the `.env` file with your actual Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://iolenyutbulfpgikfsfi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Test the connection in your Next.js application
4. Replace the test user UUID with actual authenticated user IDs from Supabase Auth
