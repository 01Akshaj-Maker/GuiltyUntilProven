/*
  # Fix RLS Policies for Public Access

  This migration fixes the Row Level Security policies to allow:
  1. Public/anonymous users to view profiles and game stats (for leaderboards)
  2. Anonymous users to play the game without authentication
  3. Authenticated users to save their game stats
  4. Proper user profile management

  ## Changes Made

  1. Drop existing restrictive policies
  2. Create new public-friendly policies
  3. Allow public SELECT on profiles and game_stats
  4. Allow authenticated INSERT on game_stats
  5. Keep UPDATE/DELETE restricted to owners
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Everyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

DROP POLICY IF EXISTS "Everyone can view game stats" ON game_stats;
DROP POLICY IF EXISTS "Users can insert own game stats" ON game_stats;
DROP POLICY IF EXISTS "Users can delete own game stats" ON game_stats;

-- Create new public-friendly policies for profiles
CREATE POLICY "Public can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create new public-friendly policies for game_stats
CREATE POLICY "Public can view all game stats"
  ON game_stats FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own game stats"
  ON game_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own game stats"
  ON game_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant necessary permissions to anon role for reading
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON game_stats TO anon;
GRANT SELECT ON user_leaderboard TO anon;

-- Grant necessary permissions to authenticated role
GRANT ALL ON profiles TO authenticated;
GRANT INSERT, SELECT, DELETE ON game_stats TO authenticated;
GRANT SELECT ON user_leaderboard TO authenticated;
