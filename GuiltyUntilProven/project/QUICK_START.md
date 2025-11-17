# Quick Start Guide

## 🚀 Get Your Database Running in 5 Minutes

### Step 1: Apply Database Migrations (REQUIRED)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar

**Apply Migration 1 (RLS Policies):**
4. Click **New Query**
5. Open file: `supabase/migrations/20251104000000_fix_rls_policies.sql`
6. Copy all SQL and paste into SQL Editor
7. Click **Run** (Ctrl+Enter)
8. Verify: "Success. No rows returned"

**Apply Migration 2 (Security Fixes):**
9. Click **New Query** again
10. Open file: `supabase/migrations/20251104000001_fix_security_warnings.sql`
11. Copy all SQL and paste into SQL Editor
12. Click **Run** (Ctrl+Enter)
13. Verify: "Success. No rows returned"

**Enable Leaked Password Protection:**
14. Go to **Authentication** > **Settings**
15. Scroll to **Security** section
16. Toggle **"Leaked Password Protection"** ON
17. Click **Save**

**That's it! Your database is secure and ready.**

### Step 2: Verify It Works

Run this query in the SQL Editor to test:

```sql
SELECT * FROM profiles LIMIT 1;
```

If you see results or "0 rows" (not an error), it's working!

### Step 3: Start Your App

```bash
npm run dev
```

## What You Can Do Now

### ✅ Without Logging In (Anonymous):
- Play the detective game
- View leaderboards
- See other players' stats
- Complete cases

### ✅ After Logging In:
- All of the above, PLUS:
- Save your game stats
- Appear on leaderboard
- View your personal profile
- Track your statistics

## Testing Your Setup

### Test 1: Anonymous Play
1. Open the app
2. Click "Play as Guest" or similar
3. Complete a game
4. Check leaderboard (should be visible)
5. Your stats should NOT be saved (expected)

### Test 2: Authenticated Play
1. Sign up for an account
2. Log in
3. Complete a game
4. Check leaderboard (should show your username)
5. View your profile (should show your stats)

## Common Issues

### Error: "new row violates row-level security policy"
**Fix**: You haven't applied the migration yet. Go back to Step 1.

### Can't see leaderboard
**Fix**:
1. Check if you applied the migration
2. Run: `SELECT * FROM user_leaderboard;` in SQL Editor
3. If empty, no games have been played yet (that's okay!)

### Stats not saving
**Fix**:
1. Make sure you're logged in
2. Check browser console for errors
3. Verify migration was applied
4. Check Supabase Dashboard > Logs for errors

## Need Help?

See the detailed guides:
- **DATABASE_SUMMARY.md** - Overview of what was built
- **SUPABASE_SETUP.md** - Detailed setup instructions with troubleshooting

## That's It!

You now have a fully functional database with:
- ✅ User authentication
- ✅ Profile management
- ✅ Game statistics tracking
- ✅ Leaderboard system
- ✅ Public viewing (no login required)
- ✅ Secure data access
- ✅ Password leak protection
- ✅ SQL injection prevention

Enjoy your detective game! 🕵️
