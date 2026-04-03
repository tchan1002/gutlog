# GutLog — Claude Code Build Prompt

---

## CLAUDE CODE SETUP INSTRUCTIONS (do these first)

### 1. MCP Configuration
Create a `.mcp.json` file in the project root to connect Claude Code to Supabase:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "<SUPABASE_URL>",
        "--supabase-key", "<SUPABASE_SERVICE_ROLE_KEY>"
      ]
    }
  }
}
```

Replace <SUPABASE_URL> and <SUPABASE_SERVICE_ROLE_KEY> with values from your
Supabase project dashboard → Settings → API.
Use the service_role key (not anon) for MCP — it needs full DB access.

### 2. Environment Variables
Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
```

The anon key is used client-side in the React app.
The service_role key is only used via MCP and should never be in client-side code.

### 3. Build Order
Follow this sequence — do not skip ahead:
  1. Initialize Supabase schema via MCP (run all migrations)
  2. Scaffold React + Vite project with Tailwind and React Router
  3. Build /onboarding (receipt upload + start fresh paths)
  4. Build /log/food (all three input modes + meal tray)
  5. Build /log/gut
  6. Build /library (editor)
  7. Build /dashboard (daily + weekly views first, correlation engine last)
  8. PWA manifest + service worker
  9. /settings

---

## PROJECT OVERVIEW

A mobile-first gut health and metabolic tracking web app called "GutLog"
built with React + Supabase (managed Postgres).

Two primary entry points triggered by NFC tap:
  1. FRIDGE NFC → /log/food — quick meal logging screen
  2. BATHROOM NFC → /log/gut — gut feel + Bristol stool log screen

---

## ONBOARDING (/onboarding)

Three starting paths — user picks one, all accessible later from /settings:

PATH 1 — RECEIPT UPLOAD
- Upload 1–4 grocery receipt images or PDFs
- Claude API parses each receipt's food items into the food library
- For each item, Claude estimates: category, emoji, calories_per_serving, serving_size,
  and cost_per_serving (derived from price_paid ÷ quantity_purchased)
- User reviews parsed items before confirming import (simple editable list)

PATH 2 — START FRESH
- Skip receipt upload entirely
- Library starts empty; items are added organically each time the user logs a meal
  and encounters something not yet in the library (see "Add New Item" flow below)

PATH 3 — HYBRID
- Skip for now, go directly to /log/food
- A persistent soft prompt in /settings: "Add receipts to build your library faster"

All paths lead to the same app. Receipts can be uploaded at any time from /settings.

---

## FOOD LIBRARY (/library)

The library is the source of truth for all food logging. It grows over time via
receipts, photo recognition, natural language entry, and manual addition.

Pantry staples (olive oil, salt, butter, garlic, etc.) are flagged is_pantry_staple = true.
They appear as a separate section in the meal tray and are opt-out rather than opt-in —
user unchecks them if not used in a meal.

Library editor (/library):
- Search, edit, or delete any item
- Manually add new items with a simple form
- Upload additional receipts at any time from this screen
- Items sourced from restaurants are marked source = "manual" with no price data —
  cost tracking is best-effort, never a required field

---

## MEAL LOGGING SCREEN (/log/food)

Primary daily interaction. Target: completable in under 30 seconds.
Three input modes, all converging on a shared meal tray before saving.

MODE 1 — TAP FROM LIBRARY
- Searchable scrollable grid of library items (large tap targets, emoji + name + cal estimate)
- Pantry staples shown as a pre-checked section at the bottom — uncheck to exclude
- Tap to select/deselect non-staple items
- Serving size prompt on each selected item: shows default serving, user adjusts with +/-
  in increments of 0.5. Always confirm portion — never silently default.
- Running total updates live as items are selected

MODE 2 — PHOTO
- Camera capture or image upload of a meal
- Send image to Claude API: identify foods, match to existing library items where possible,
  suggest new items for anything unrecognized
- Auto-select matched items in the tray; flag unmatched suggestions for quick-add
- User confirms, edits, adjusts servings, then saves

MODE 3 — NATURAL LANGUAGE / RECIPE SHORTHAND
- Text input: user types e.g. "bolognese pasta" or "big breakfast with eggs and toast"
  or "picked up a burrito bowl"
- Send to Claude API with the user's FULL food library as context
- Claude returns a ranked list of likely library matches + suggested new items for
  anything not found (e.g. restaurant dishes, unfamiliar ingredients)
- For unrecognized items: create with source = "manual", no price data, estimated calories
- Auto-select matched items in the tray — user taps to deselect wrong items or add missing ones
- Suggestions improve as the library grows

ADD NEW ITEM FLOW (accessible from any mode)
- Triggered when a food is not in the library
- Quick modal: name (pre-filled from AI suggestion if available), category, emoji,
  calories_per_serving, serving_size, optional price fields
- Saves to library immediately and adds to current meal tray
- Never interrupts or blocks the logging flow

MEAL TRAY (shared confirmation screen)
- All selected items with serving sizes and per-item calorie contribution
- Running totals: calories, estimated cost (where price data exists)
- Meal label: Breakfast / Lunch / Dinner / Snack — auto-suggested by time of day, editable
- Timestamp: auto-filled, editable
- Save commits to food_logs

---

## GUT LOG SCREEN (/log/gut)

Bristol Stool Scale selector:
- 7 options displayed as emoji + short description initially
  (e.g. Type 1 💩 Hard separate lumps / Type 4 💩 Smooth sausage / Type 7 💩 Entirely liquid)
- After 5+ uses, descriptions collapse to emoji-only by default (toggle to restore)
- Tap to select one type

Gut feel:
- 1–5 slider: 😣 Rough → 😊 Great
- Multi-select symptom tags (large tap targets):
  Bloated / Gassy / Crampy / Nauseous / Heavy / Normal / Energized

Activity level (single select):
  Rest / Light / Moderate / Active
  (This field is designed to receive Apple HealthKit step/activity data in a future phase)

Optional free text note (small, below the fold)
Timestamp: auto-filled, editable
Save commits to gut_logs

---

## DASHBOARD (/dashboard)

DAILY VIEW
- All meals logged today, grouped by meal label
- Daily calorie total: sum of (calories_per_serving × servings) for the day
- Daily cost total: sum of (cost_per_serving × servings) where price data exists
- Today's gut log entry if filed

WEEKLY DIGEST
- 7-day food + gut timeline: foods eaten each day with gut scores overlaid as color-coded dots
- Calorie intake as a bar chart, activity level as an overlaid line
- Weekly spend breakdown by food category (where price data exists)

METABOLIC VIEW (always visible, richer over time)
- Calorie intake vs. activity level trend
- Average daily food spend
- Cost-per-calorie by food item (sortable table also available in /library)
- TDEE estimate: marked "coming soon" in UI, pending HealthKit sync

CORRELATION ENGINE (activates after 14 days of data, shown as pending before then)
- Co-occurrence scoring: foods appearing most on high vs. low gut score days
- Lag analysis: foods correlating with poor gut scores 24–48 hours later
- Cost × gut impact matrix: quadrant view
    Cheap + good gut → Keep
    Expensive + bad gut → Cut first
    Cheap + bad gut → Consider reducing
    Expensive + good gut → Worthwhile
- Findings surfaced as plain-language dismissible cards, e.g.:
    "On your 3 worst gut days, you'd eaten X the day before"
    "Dairy costs ~$38/month and correlates with your lowest gut scores"
    "Eggs are your best value: low cost, appears on 80% of your best days"

All charts: Recharts, clean, minimal, high contrast, mobile-friendly

---

## TECH STACK
- React (Vite)
- Supabase: auth (magic link), Postgres database, file storage (receipts + meal images)
- Claude API (claude-sonnet-4-20250514) for receipt parsing, photo recognition,
  and natural language meal entry — always pass full food library as context for NL queries
- React Router: /onboarding, /log/food, /log/gut, /dashboard, /library, /settings
- Tailwind CSS: mobile-first, large tap targets, minimal keyboard use
- PWA: manifest + service worker so app installs to iPhone home screen

---

## SUPABASE SCHEMA (use MCP to run all migrations before building UI)

users
  id, email, created_at

food_library
  id, user_id, name, category, emoji,
  calories_per_serving (int),
  serving_size (text),
  price_paid (float, nullable),
  quantity_purchased (text, nullable),
  cost_per_serving (float, nullable),
  source (text: receipt/photo/manual/ai-suggested),
  is_pantry_staple (bool, default false),
  created_at

food_logs
  id, user_id, food_id (→ food_library),
  meal_label (text: breakfast/lunch/dinner/snack),
  servings (float),
  logged_at

gut_logs
  id, user_id,
  bristol_score (1–7),
  gut_score (int 1–5),
  tags (text[]),
  activity (text: rest/light/moderate/active),
  note (text, nullable),
  logged_at

Enable Row Level Security (RLS) on all tables.
Each user may only read and write their own rows.
Generate RLS policies via MCP alongside the schema migrations.

---

## NFC INTEGRATION
NFC stickers are programmed to open URLs directly:
  Fridge sticker → https://[domain]/log/food
  Bathroom sticker → https://[domain]/log/gut
Routes must load instantly — no splash screens, auth gates, or loading spinners
before the log UI is interactive. Auth state must be cached client-side.

---

## DESIGN PRINCIPLES
- Every logging action completable in under 30 seconds
- Large emoji-based selectors, minimal keyboard use
- Serving size always explicitly confirmed — never silently assumed
- Friendly, non-clinical tone throughout
- Restaurant and unpriced items are first-class citizens — missing price data
  should never block logging or feel like an error state
- Library grows over time — onboarding is a starting point, not a gate

---

## FUTURE PHASES (architect for these, do not build yet)
- Apple HealthKit step/activity sync via Capacitor native wrapper
  (activity field in gut_logs is already designed to receive this data)
- Longitudinal TDEE metabolic estimate
- Exportable correlation reports (PDF or share sheet)
- Richer Bristol scale with illustrated type diagrams
