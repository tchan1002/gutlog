# GutLog - TODO Items

## Immediate Next Steps

### PWA Icons (Required for Production)
The current icon files are SVG placeholders. You need to create proper PNG icons:

1. Create or design a proper logo for GutLog
2. Generate PNG files:
   - `/public/icon-192.png` - 192x192 pixels
   - `/public/icon-512.png` - 512x512 pixels

You can use tools like:
- Figma or Sketch for design
- ImageMagick for conversion: `convert icon.svg -resize 192x192 icon-192.png`
- Online tools like favicon.io or realfavicongenerator.net

### Environment Variables
Update the `.env` file with your actual credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_actual_anthropic_key
```

## Development Tasks

### Phase 1: Authentication
- [ ] Set up Supabase authentication UI
- [ ] Create login/signup pages
- [ ] Implement protected routes
- [ ] Add user profile management

### Phase 2: Database Schema
- [ ] Design and create Supabase tables:
  - `users` - User profiles
  - `food_logs` - Food intake records
  - `gut_logs` - Gut health records
  - `meals` - Meal details with AI analysis
- [ ] Set up row-level security policies

### Phase 3: Food Logging
- [ ] Create food logging form
- [ ] Implement meal photo upload
- [ ] Integrate Claude API for meal analysis
- [ ] Store food logs in Supabase
- [ ] Add search and filter functionality

### Phase 4: Gut Logging
- [ ] Create gut health logging form (Bristol Stool Scale)
- [ ] Add symptoms tracking
- [ ] Implement timestamp tracking
- [ ] Store gut logs in Supabase

### Phase 5: Dashboard
- [ ] Design dashboard layout
- [ ] Implement data visualization with Recharts:
  - Food intake timeline
  - Gut health trends
  - Correlations between food and gut health
- [ ] Add filtering by date range
- [ ] Show insights and patterns

### Phase 6: AI Features
- [ ] Integrate Claude for meal analysis
- [ ] Generate personalized insights
- [ ] Identify potential trigger foods
- [ ] Suggest dietary improvements

### Phase 7: Testing & Polish
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add offline support (PWA)
- [ ] Test on mobile devices
- [ ] Optimize performance
- [ ] Add user onboarding

## Technical Improvements
- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up CI/CD pipeline
- [ ] Configure error tracking (Sentry)
- [ ] Add analytics
- [ ] Optimize bundle size

## Nice-to-Have Features
- [ ] Export data functionality
- [ ] Share reports with healthcare providers
- [ ] Meal planning suggestions
- [ ] Reminder notifications
- [ ] Dark mode (already configured with Tailwind)
- [ ] Multi-language support
