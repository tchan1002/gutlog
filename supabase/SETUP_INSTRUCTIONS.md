# GutLog Database Setup - Complete Instructions

## Files Created

1. **migrations/20260403_initial_schema.sql** - Complete database schema with:
   - 4 tables (users, food_library, food_logs, gut_logs)
   - Row Level Security (RLS) policies for data isolation
   - 24 seed food items
   - Verification queries

2. **README.md** - Comprehensive documentation of the schema and setup options

3. **apply-migration.sh** - Automated script to apply the migration via CLI

## Current Status

The database schema has been prepared but **NOT YET APPLIED** to your Supabase instance because:
- The Supabase MCP server requires authentication
- The .env file contains placeholder credentials
- The Supabase CLI requires an access token

## How to Apply the Schema

### Method 1: Supabase Dashboard (Easiest - Recommended)

1. Open your browser and go to:
   https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/sql/new

2. Copy the entire contents of `supabase/migrations/20260403_initial_schema.sql`

3. Paste into the SQL editor and click "Run"

4. You should see a verification table showing:
   ```
   table_name    | record_count
   --------------|-------------
   users         | 1
   food_library  | 24
   food_logs     | 0
   gut_logs      | 0
   ```

### Method 2: Supabase CLI

```bash
# 1. Get your access token
# Go to: https://supabase.com/dashboard/account/tokens
# Click "Generate new token" and copy it

# 2. Set the environment variable
export SUPABASE_ACCESS_TOKEN="your-token-here"

# 3. Navigate to the supabase directory
cd supabase

# 4. Run the migration script
./apply-migration.sh
```

### Method 3: Manual SQL Execution

If you prefer to run SQL commands manually:

```bash
# 1. Set your access token
export SUPABASE_ACCESS_TOKEN="your-token-here"

# 2. Link to the project
supabase link --project-ref iolenyutbulfpgikfsfi

# 3. Execute the migration
supabase db execute --file migrations/20260403_initial_schema.sql
```

## After Setup

Once the schema is applied:

1. **Update your .env file** with actual Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://iolenyutbulfpgikfsfi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
   
   You can find these values at:
   https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/settings/api

2. **Test the connection** in your Next.js app

3. **Set up authentication** - The test user created has UUID `00000000-0000-0000-0000-000000000001`. You'll want to:
   - Enable Supabase Auth providers
   - Replace test data with real authenticated users

## Database Schema Overview

### Tables Created

**users**
- id (UUID, primary key)
- email (unique)
- created_at (timestamp)

**food_library**
- id (UUID, primary key)
- user_id (references users)
- name, category, emoji
- calories_per_serving, serving_size
- is_pantry_staple
- created_at

**food_logs**
- id (UUID, primary key)
- user_id (references users)
- food_id (references food_library)
- meal_label (breakfast/lunch/dinner/snack)
- servings (numeric)
- logged_at

**gut_logs**
- id (UUID, primary key)
- user_id (references users)
- bristol_score (1-7)
- gut_score (1-5)
- tags (array)
- activity (rest/light/moderate/active)
- note (text)
- logged_at

### Security

All tables have Row Level Security (RLS) enabled with policies that:
- Allow users to read only their own data
- Allow users to insert only their own data
- Allow users to update only their own data
- Allow users to delete only their own data

This ensures complete data isolation between users.

## Troubleshooting

**"Your account does not have the necessary privileges"**
- You need to authenticate with a Supabase access token
- Generate one at: https://supabase.com/dashboard/account/tokens

**"Cannot use automatic login flow inside non-TTY"**
- Use `export SUPABASE_ACCESS_TOKEN="token"` instead of interactive login

**"No such keg: /opt/homebrew/Cellar/supabase"**
- Install Supabase CLI: `brew install supabase/tap/supabase`

**Migration file not found**
- Make sure you're in the `/Users/tobychan/gutlog/supabase` directory

## Next Steps

1. Apply the migration using one of the methods above
2. Update .env with actual credentials
3. Test database connectivity in your Next.js app
4. Enable Supabase Auth
5. Start building your application!
