/*
  # AI Detective Game Database Schema

  ## Overview
  This migration sets up the complete database schema for the AI Detective Game, including user profiles, game statistics tracking, and leaderboard functionality.

  ## Tables Created

  ### 1. profiles
  User profile information linked to auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `username` (text, unique, not null) - Player's display name
  - `email` (text, unique, not null) - Player's email
  - `avatar_url` (text) - Optional profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. game_stats
  Detailed statistics for every game played
  - `id` (uuid, primary key) - Unique game record ID
  - `user_id` (uuid, foreign key) - Links to profiles.id
  - `won` (boolean, not null) - Whether the player won
  - `difficulty` (text, not null) - Game difficulty (easy/medium/hard)
  - `questions_used` (integer, not null) - Number of questions asked
  - `questions_available` (integer, not null) - Total questions allowed
  - `suspects_interrogated` (integer, not null) - Number of suspects questioned
  - `total_suspects` (integer, not null) - Total suspects in game
  - `evidence_discovered` (integer, not null, default 0) - Evidence pieces found
  - `solve_time_seconds` (integer) - Time taken to complete game
  - `impostor_name` (text, not null) - Who was the actual impostor
  - `accused_name` (text, not null) - Who the player accused
  - `correct_accusation` (boolean, not null) - Whether accusation was correct
  - `played_at` (timestamptz, not null, default now()) - When game was played
  - `created_at` (timestamptz, default now()) - Record creation time

  ### 3. user_leaderboard (Materialized View)
  Aggregated player statistics for rankings
  - `user_id` (uuid) - Player identifier
  - `username` (text) - Player name
  - `total_games` (bigint) - Total games played
  - `total_wins` (bigint) - Total games won
  - `total_losses` (bigint) - Total games lost
  - `win_rate` (numeric) - Win percentage (0-100)
  - `avg_questions_used` (numeric) - Average questions per game
  - `fastest_solve_seconds` (integer) - Best solve time
  - `avg_solve_time_seconds` (numeric) - Average solve time
  - `avg_interrogation_rate` (numeric) - Average suspects interrogated
  - `last_played` (timestamptz) - Most recent game

  ## Security (Row Level Security)

  ### profiles table
  - **SELECT**: Everyone can view all profiles (for leaderboards)
  - **INSERT**: Authenticated users can create their own profile
  - **UPDATE**: Users can only update their own profile
  - **DELETE**: Users can only delete their own profile

  ### game_stats table
  - **SELECT**: Everyone can read game stats (for leaderboards)
  - **INSERT**: Authenticated users can insert their own game stats
  - **UPDATE**: No updates allowed (immutable game records)
  - **DELETE**: Users can only delete their own game stats

  ## Indexes
  Created for optimal query performance on leaderboards and user stats:
  - game_stats: user_id, won, difficulty, played_at
  - user_leaderboard: win_rate (DESC), total_wins (DESC)

  ## Functions
  - `refresh_leaderboard()`: Refreshes the materialized view with latest stats
  - Trigger: Auto-create profile on user signup

  ## Important Notes
  1. All timestamps use timestamptz for timezone awareness
  2. Game stats are immutable once created (no updates allowed)
  3. Leaderboard is a materialized view for performance
  4. Must refresh leaderboard after game completion
  5. Indexes optimize common leaderboard queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create game_stats table
CREATE TABLE IF NOT EXISTS game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  won boolean NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions_used integer NOT NULL CHECK (questions_used >= 0),
  questions_available integer NOT NULL CHECK (questions_available > 0),
  suspects_interrogated integer NOT NULL CHECK (suspects_interrogated >= 0),
  total_suspects integer NOT NULL CHECK (total_suspects > 0),
  evidence_discovered integer NOT NULL DEFAULT 0 CHECK (evidence_discovered >= 0),
  solve_time_seconds integer CHECK (solve_time_seconds >= 0),
  impostor_name text NOT NULL,
  accused_name text NOT NULL,
  correct_accusation boolean NOT NULL,
  played_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Everyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
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

-- Game stats policies
CREATE POLICY "Everyone can view game stats"
  ON game_stats FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own game stats"
  ON game_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own game stats"
  ON game_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_stats_user_id ON game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_won ON game_stats(won);
CREATE INDEX IF NOT EXISTS idx_game_stats_difficulty ON game_stats(difficulty);
CREATE INDEX IF NOT EXISTS idx_game_stats_played_at ON game_stats(played_at DESC);

-- Create materialized view for leaderboard
CREATE MATERIALIZED VIEW IF NOT EXISTS user_leaderboard AS
SELECT 
  p.id AS user_id,
  p.username,
  COUNT(gs.id) AS total_games,
  SUM(CASE WHEN gs.won THEN 1 ELSE 0 END) AS total_wins,
  SUM(CASE WHEN NOT gs.won THEN 1 ELSE 0 END) AS total_losses,
  CASE 
    WHEN COUNT(gs.id) > 0 
    THEN ROUND((SUM(CASE WHEN gs.won THEN 1 ELSE 0 END)::numeric / COUNT(gs.id)::numeric) * 100, 2)
    ELSE 0 
  END AS win_rate,
  ROUND(AVG(gs.questions_used), 2) AS avg_questions_used,
  MIN(CASE WHEN gs.won THEN gs.solve_time_seconds ELSE NULL END) AS fastest_solve_seconds,
  ROUND(AVG(CASE WHEN gs.won THEN gs.solve_time_seconds ELSE NULL END), 2) AS avg_solve_time_seconds,
  ROUND(AVG(gs.suspects_interrogated::numeric / gs.total_suspects::numeric) * 100, 2) AS avg_interrogation_rate,
  MAX(gs.played_at) AS last_played
FROM profiles p
LEFT JOIN game_stats gs ON p.id = gs.user_id
GROUP BY p.id, p.username;

-- Create indexes on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_leaderboard_user_id ON user_leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_user_leaderboard_win_rate ON user_leaderboard(win_rate DESC);
CREATE INDEX IF NOT EXISTS idx_user_leaderboard_total_wins ON user_leaderboard(total_wins DESC);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_leaderboard;
END;
$$;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();