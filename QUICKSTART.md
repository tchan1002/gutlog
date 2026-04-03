# 🚀 GutLog Quick Start - Get Running in 2 Minutes

No auth needed! Just set up your database and start tapping.

---

## Step 1: Apply Database Schema (60 seconds)

### Option A: Copy/Paste (Easiest)

1. **Copy the SQL:**
   ```bash
   cat /Users/tobychan/gutlog/supabase/migrations/20260403_initial_schema.sql | pbcopy
   ```

2. **Open Supabase SQL Editor:**
   https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/sql/new

3. **Paste and Run:**
   - Paste (Cmd+V)
   - Click "Run" or press Cmd+Enter

4. **Disable RLS (Row Level Security):**
   Since we removed auth, run this too:
   ```bash
   cat /Users/tobychan/gutlog/supabase/migrations/20260403_disable_rls.sql | pbcopy
   ```
   
   Then paste and run in the same SQL editor.

### What This Creates:
- ✅ 4 tables (users, food_library, food_logs, gut_logs)
- ✅ 1 test user (you!)
- ✅ 24 pre-loaded food items (eggs, bread, chicken, etc.)
- ✅ No security gates (RLS disabled for simplicity)

---

## Step 2: Start Using It (30 seconds)

### Open the App:
**http://localhost:3000**

You'll land on the dashboard → no login required!

### Test the Flow:

1. **📊 Dashboard** - See today's meals and gut logs
   
2. **🍽️ Log Food** (http://localhost:3000/log/food)
   - Tap food items from the grid
   - Adjust servings
   - Save meal
   
3. **💩 Log Gut** (http://localhost:3000/log/gut)
   - Select Bristol score
   - Rate gut feel (1-5)
   - Pick symptoms
   - Save

---

## Step 3: Set Up Your NFC Tags

### Fridge Tag:
Program to open: **http://localhost:3000/log/food**

### Bathroom Tag:
Program to open: **http://localhost:3000/log/gut**

When you tap, it opens the page instantly → log your data → done!

---

## 🎯 You're Done!

- No login required
- All data saves to Supabase
- Dark theme, mobile-optimized
- NFC taps work immediately

---

## Troubleshooting

**"No food items showing"?**
→ You need to run the SQL schema (Step 1)

**"Failed to fetch"?**
→ Check your `.env` file has the correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Data not saving?**
→ Make sure you ran BOTH SQL files (initial schema + disable RLS)

**Want to see your data?**
→ Check Supabase Table Editor:
https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/editor

---

Ready to log! 🚀
