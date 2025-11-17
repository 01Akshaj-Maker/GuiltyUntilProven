# Database Setup Summary

## What Was Done

I've created a comprehensive Supabase database setup for your AI Detective Game with proper authentication, user profiles, game statistics tracking, and leaderboard functionality.

## Database Schema

### 1. **profiles** Table
Stores user profile information linked to Supabase authentication:
- User ID (links to auth.users)
- Username (unique)
- Email (unique)
- Avatar URL (optional)
- Created/updated timestamps

### 2. **game_stats** Table
Records every game played with detailed statistics:
- Game ID
- User ID (who played)
- Win/loss status
- Difficulty level (easy/medium/hard)
- Questions used/available
- Suspects interrogated
- Evidence discovered
- Solve time in seconds
- Impostor name
- Accused name
- Correct accusation flag
- Timestamp

### 3. **user_leaderboard** Materialized View
Aggregated statistics for leaderboard rankings:
- Total games played
- Total wins/losses
- Win rate percentage
- Average questions used
- Fastest solve time
- Average solve time
- Interrogation rate
- Last played timestamp

## Security (Row Level Security)

The database uses RLS policies to ensure:
- **Public** users can view leaderboards and profiles (anonymous gameplay)
- **Authenticated** users can save their game stats
- Users can only modify/delete their own data
- Game stats are immutable once created

## Features

### ✅ Anonymous Gameplay
- Users can play without signing up
- Leaderboards are publicly viewable
- Stats are NOT saved for anonymous users

### ✅ Authenticated Users
- Sign up with email/password
- Automatic profile creation on signup
- Game stats saved to database
- Personal profile with statistics
- Leaderboard rankings

### ✅ Leaderboard System
- Ranks players by win rate and total wins
- Shows top detectives
- Highlights current user
- Displays performance metrics

### ✅ User Profiles
- Personal statistics dashboard
- Case record (wins/losses/success rate)
- Performance metrics
- Recent games history

## IMPORTANT: You Must Apply the Migration

The database schema has been created, but you need to apply the RLS policy fix manually:

### Steps to Apply Migration:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply Migration**
   - Open file: `supabase/migrations/20251104000000_fix_rls_policies.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Test by querying: `SELECT * FROM profiles LIMIT 1;`

See **SUPABASE_SETUP.md** for detailed instructions and troubleshooting.

## Code Changes Made

### 1. Migration Files
- `supabase/migrations/20251101143351_create_profiles_and_game_stats.sql` - Creates tables
- `supabase/migrations/20251104000000_fix_rls_policies.sql` - Fixes RLS for public access

### 2. API Functions (`lib/supabase/api.ts`)
- `saveGameStats()` - Saves game results (requires auth)
- `getLeaderboard()` - Fetches top players
- `getUserProfile()` - Gets user profile data
- `getUserStats()` - Gets detailed user statistics
- `signUp()` - Creates new user account
- `signIn()` - Authenticates user
- `signOut()` - Logs out user
- `refreshLeaderboard()` - Updates leaderboard view

### 3. Main App (`app/page.tsx`)
- Handles authenticated and anonymous users
- Saves stats only when user is logged in
- Graceful error handling for RLS issues
- Shows appropriate messages for anonymous users

## How It Works

### For Anonymous Users:
1. User plays game without logging in
2. Can view leaderboards
3. Stats are NOT saved
4. Can still complete games and see results

### For Authenticated Users:
1. User signs up or logs in
2. Profile automatically created
3. Plays game and completes it
4. Stats saved to database
5. Leaderboard automatically updated
6. Can view personal profile with all statistics

## Testing Checklist

After applying the migration, test:

- [ ] Anonymous user can view leaderboard
- [ ] Anonymous user can play game
- [ ] Sign up creates new user
- [ ] Login works correctly
- [ ] Authenticated user game stats are saved
- [ ] Leaderboard shows correct rankings
- [ ] Profile shows correct user stats
- [ ] Logout works properly

## Troubleshooting

### "new row violates row-level security policy"
**Solution**: Apply the RLS fix migration (20251104000000_fix_rls_policies.sql)

### "relation does not exist"
**Solution**: Apply the initial migration (20251101143351_create_profiles_and_game_stats.sql)

### Leaderboard not updating
**Solution**: Run `SELECT refresh_leaderboard();` in SQL Editor

### Can't see other users in leaderboard
**Solution**: Check RLS policies allow public SELECT

## Next Steps

1. Apply the RLS fix migration (REQUIRED)
2. Test anonymous gameplay
3. Test authenticated gameplay
4. Verify leaderboard updates
5. Check profile displays correctly

See SUPABASE_SETUP.md for complete setup instructions!
