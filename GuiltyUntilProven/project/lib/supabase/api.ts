import { supabase } from './client';
import { GameStats } from '../stores/game-store';
import { GameStat, LeaderboardEntry, Profile } from './types';

export async function saveGameStats(userId: string | null, stats: GameStats): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      console.log('No user ID provided - game stats not saved (anonymous user)');
      return { success: false, error: 'User not authenticated - stats not saved' };
    }

    const { error } = await supabase.from('game_stats').insert({
      user_id: userId,
      won: stats.won,
      difficulty: stats.difficulty,
      questions_used: stats.questionsUsed,
      questions_available: stats.questionsAvailable,
      suspects_interrogated: stats.suspectsInterrogated,
      total_suspects: stats.totalSuspects,
      evidence_discovered: stats.evidenceDiscovered,
      solve_time_seconds: stats.solveTimeSeconds,
      impostor_name: stats.impostorName,
      accused_name: stats.accusedName,
      correct_accusation: stats.correctAccusation,
    });

    if (error) {
      console.error('Error saving game stats:', error);
      return { success: false, error: error.message };
    }

    await refreshLeaderboard();

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error saving game stats:', error);
    return { success: false, error: error.message || 'Failed to save game stats' };
  }
}

export async function refreshLeaderboard(): Promise<void> {
  try {
    const { error } = await supabase.rpc('refresh_leaderboard');
    if (error) {
      console.error('Error refreshing leaderboard:', error);
    }
  } catch (error) {
    console.error('Unexpected error refreshing leaderboard:', error);
  }
}

export async function getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('user_leaderboard')
      .select('*')
      .order('win_rate', { ascending: false })
      .order('total_wins', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching leaderboard:', error);
    return [];
  }
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

export async function getUserStats(userId: string): Promise<{
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  avgQuestions: number;
  fastestSolve: number | null;
  avgSolveTime: number | null;
  recentGames: GameStat[];
} | null> {
  try {
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('user_leaderboard')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (leaderboardError) {
      console.error('Error fetching user leaderboard data:', leaderboardError);
    }

    const { data: recentGames, error: gamesError } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(10);

    if (gamesError) {
      console.error('Error fetching recent games:', gamesError);
    }

    if (!leaderboardData) {
      return {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        winRate: 0,
        avgQuestions: 0,
        fastestSolve: null,
        avgSolveTime: null,
        recentGames: recentGames || [],
      };
    }

    return {
      totalGames: Number(leaderboardData.total_games) || 0,
      totalWins: Number(leaderboardData.total_wins) || 0,
      totalLosses: Number(leaderboardData.total_losses) || 0,
      winRate: Number(leaderboardData.win_rate) || 0,
      avgQuestions: Number(leaderboardData.avg_questions_used) || 0,
      fastestSolve: leaderboardData.fastest_solve_seconds,
      avgSolveTime: leaderboardData.avg_solve_time_seconds,
      recentGames: recentGames || [],
    };
  } catch (error) {
    console.error('Unexpected error fetching user stats:', error);
    return null;
  }
}

export async function signUp(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to sign up' };
  }
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to sign in' };
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}