# Apply Database Schema - Quick Guide

## Step 1: Open Supabase SQL Editor

Click this link to open the SQL editor:
https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/sql/new

## Step 2: Copy & Paste

Copy the ENTIRE contents of this file:
`/Users/tobychan/gutlog/supabase/migrations/20260403_initial_schema.sql`

Or use this command to copy it to your clipboard:
```bash
cat /Users/tobychan/gutlog/supabase/migrations/20260403_initial_schema.sql | pbcopy
```

## Step 3: Run

Paste into the SQL editor and click **"Run"** button (or press Cmd+Enter)

## Expected Result

You should see a table showing:
- users: 1 record
- food_library: 24 records
- food_logs: 0 records
- gut_logs: 0 records

✅ That means your database is ready!

## If You See Errors

If you see "already exists" errors, that's okay - it means some tables were already created. Just ignore those.

## Next Step

Refresh your browser at http://localhost:3000 and you should see the seed food items!
