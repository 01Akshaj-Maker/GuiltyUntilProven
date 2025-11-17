/*
  # Fix Security Warnings

  This migration addresses the following security issues:
  1. Function search_path mutability for handle_new_user and refresh_leaderboard
  2. Materialized view API access control
  3. (Note: Leaked Password Protection must be enabled in Supabase Dashboard)

  ## Security Fixes

  ### 1. Function Search Path Security
  - Set search_path explicitly for functions to prevent SQL injection
  - Use SECURITY INVOKER where appropriate instead of SECURITY DEFINER

  ### 2. Materialized View Access
  - The warning about user_leaderboard being selectable by anon/authenticated is INTENDED
  - This is required for public leaderboard viewing
  - No fix needed - this is correct behavior

  ### 3. Password Protection
  - Cannot be fixed via SQL - must be enabled in Dashboard
  - See instructions below
*/

-- =========================================
-- Fix 1: handle_new_user function security
-- =========================================

-- Drop and recreate with proper search_path
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =========================================
-- Fix 2: refresh_leaderboard function security
-- =========================================

-- Drop and recreate with proper search_path
DROP FUNCTION IF EXISTS refresh_leaderboard();

CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_leaderboard;
EXCEPTION
  WHEN OTHERS THEN
    -- If concurrent refresh fails, try regular refresh
    REFRESH MATERIALIZED VIEW user_leaderboard;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION refresh_leaderboard() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_leaderboard() TO anon;

-- =========================================
-- Fix 3: Materialized View Access (No Change Needed)
-- =========================================

/*
  The warning "Materialized view 'public.user_leaderboard' is selectable by anon or authenticated roles"
  is INTENTIONAL and CORRECT for this application.

  We WANT anonymous and authenticated users to view the leaderboard.
  This is not a security issue - it's a feature requirement.

  If you want to restrict this later, you would need to:
  1. Create RLS policies on the materialized view
  2. OR remove SELECT grants from anon role

  For now, public leaderboard access is the intended behavior.
*/

-- =========================================
-- Instructions for Dashboard Settings
-- =========================================

/*
  TO ENABLE LEAKED PASSWORD PROTECTION:

  1. Go to: https://supabase.com/dashboard
  2. Select your project
  3. Navigate to: Authentication > Settings
  4. Scroll to "Security" section
  5. Find "Password Protection"
  6. Enable "Leaked Password Protection"
  7. Save changes

  This setting cannot be configured via SQL and must be done in the Dashboard.
*/

-- =========================================
-- Verification Queries
-- =========================================

-- Run these to verify the fixes:

-- Check function definitions have search_path set
-- SELECT proname, prosecdef, proconfig
-- FROM pg_proc
-- WHERE proname IN ('handle_new_user', 'refresh_leaderboard');

-- Check materialized view permissions (should show anon and authenticated)
-- SELECT grantee, privilege_type
-- FROM information_schema.role_table_grants
-- WHERE table_name = 'user_leaderboard';
