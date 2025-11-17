# Supabase Database Setup Guide

This guide will help you set up the Supabase database with proper authentication, profiles, and leaderboard functionality.

## Prerequisites

- Supabase account with a project created
- Access to Supabase Dashboard

## Step 1: Apply Database Migrations

You need to apply three migrations to set up your database schema:

### Migration 1: Create Tables (Already Applied?)
Location: `supabase/migrations/20251101143351_create_profiles_and_game_stats.sql`

This migration creates:
- `profiles` table for user information
- `game_stats` table for game records
- `user_leaderboard` materialized view for rankings
- Triggers for auto-profile creation

### Migration 2: Fix RLS Policies (MUST APPLY)
Location: `supabase/migrations/20251104000000_fix_rls_policies.sql`

This migration fixes Row Level Security to allow:
- Public viewing of leaderboards and profiles
- Authenticated users to save game stats
- Anonymous users to view game data

### Migration 3: Fix Security Warnings (MUST APPLY)
Location: `supabase/migrations/20251104000001_fix_security_warnings.sql`

This migration fixes security warnings:
- Function search_path security issues
- Proper error handling in functions
- Security best practices

**To Apply Migrations 2 & 3:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20251104000000_fix_rls_policies.sql`
6. Paste into the SQL Editor
7. Click **Run** or press `Ctrl+Enter`
8. Verify success (you should see "Success. No rows returned")
9. **Repeat steps 4-8** for `supabase/migrations/20251104000001_fix_security_warnings.sql`

## Step 2: Verify Tables Exist

Run this query in SQL Editor to verify all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';
```

You should see:
- `profiles`
- `game_stats`

Also check for the materialized view:

```sql
SELECT matviewname
FROM pg_matviews
WHERE schemaname = 'public';
```

You should see:
- `user_leaderboard`

## Step 3: Test RLS Policies

Run these queries to verify RLS is working correctly:

```sql
-- Should return all profiles (public access)
SELECT * FROM profiles LIMIT 5;

-- Should return all game stats (public access)
SELECT * FROM game_stats LIMIT 5;

-- Should return leaderboard data (public access)
SELECT * FROM user_leaderboard LIMIT 5;
```

## Step 4: Configure Authentication & Security (REQUIRED)

### Enable Email/Password Authentication

1. Go to **Authentication** > **Providers** in Supabase Dashboard
2. Enable **Email** provider
3. Configure email templates (optional)
4. Save changes

### Enable Leaked Password Protection (REQUIRED)

This is a critical security feature that prevents users from using compromised passwords:

1. Go to **Authentication** > **Settings** in Supabase Dashboard
2. Scroll down to the **Security** section
3. Find **"Leaked Password Protection"**
4. Toggle it **ON** (Enable)
5. Click **Save**

This will check passwords against the HaveIBeenPwned.org database to prevent the use of compromised passwords.

## Step 5: Update Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

## Database Schema

### profiles Table
```sql
- id: uuid (primary key, links to auth.users)
- username: text (unique, not null)
- email: text (unique, not null)
- avatar_url: text (optional)
- created_at: timestamptz
- updated_at: timestamptz
```

### game_stats Table
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key to profiles)
- won: boolean (not null)
- difficulty: text (easy/medium/hard)
- questions_used: integer
- questions_available: integer
- suspects_interrogated: integer
- total_suspects: integer
- evidence_discovered: integer
- solve_time_seconds: integer
- impostor_name: text
- accused_name: text
- correct_accusation: boolean
- played_at: timestamptz
- created_at: timestamptz
```

### user_leaderboard Materialized View
```sql
- user_id: uuid
- username: text
- total_games: bigint
- total_wins: bigint
- total_losses: bigint
- win_rate: numeric (0-100)
- avg_questions_used: numeric
- fastest_solve_seconds: integer
- avg_solve_time_seconds: numeric
- avg_interrogation_rate: numeric
- last_played: timestamptz
```

## Troubleshooting

### Error: "new row violates row-level security policy"

This means the RLS policies are too restrictive. Apply Migration 2 (fix_rls_policies.sql) to fix this.

### Error: "relation does not exist"

This means the tables haven't been created. Apply Migration 1 (create_profiles_and_game_stats.sql).

### Leaderboard not updating

Run this SQL to manually refresh the leaderboard:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY user_leaderboard;
```

Or call the function:

```sql
SELECT refresh_leaderboard();
```

## Testing the Setup

1. Start your app: `npm run dev`
2. Try playing a game without logging in
3. Complete a game and check if stats appear
4. Check the leaderboard
5. Try signing up and logging in
6. Play another game while authenticated
7. Check your profile to see your stats

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the Supabase Dashboard > Logs for database errors
3. Verify all migrations were applied successfully
4. Ensure RLS policies are correct
