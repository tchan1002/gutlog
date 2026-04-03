# Fix Magic Link Authentication

## The Issue
Magic links need a callback URL configured in Supabase to work properly.

## Quick Fix (2 steps)

### Step 1: Add Redirect URL in Supabase

1. Go to: https://supabase.com/dashboard/project/iolenyutbulfpgikfsfi/auth/url-configuration

2. Scroll to **"Redirect URLs"** section

3. Add this URL:
   ```
   http://localhost:3000/auth/callback
   ```

4. Click **"Save"**

### Step 2: Test It

1. Go to http://localhost:3000/login
2. Enter your email
3. Click "Send Magic Link"
4. Check your inbox
5. Click the magic link in the email
6. You'll be redirected to /dashboard ✅

## What Was Fixed

- ✅ Created `/app/auth/callback/route.ts` - handles magic link tokens
- ✅ Updated `useAuth` hook to use correct redirect URL
- ✅ Added error handling if auth fails

## For Production

When you deploy to Vercel, add your production URL too:
```
https://your-app.vercel.app/auth/callback
```

## Troubleshooting

**"Could not authenticate" error?**
- Make sure you added the redirect URL in Supabase dashboard
- Check that your email is correct
- Try signing out and back in

**Magic link expired?**
- Links expire after a few minutes for security
- Just request a new one

**Not receiving emails?**
- Check spam folder
- Make sure email is typed correctly
- Supabase free tier has email limits - check your dashboard
