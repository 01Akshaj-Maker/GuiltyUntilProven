export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameStat {
  id: string;
  user_id: string;
  won: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  questions_used: number;
  questions_available: number;
  suspects_interrogated: number;
  total_suspects: number;
  evidence_discovered: number;
  solve_time_seconds: number;
  impostor_name: string;
  accused_name: string;
  correct_accusation: boolean;
  played_at: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_games: number;
  total_wins: number;
  total_losses: number;
  win_rate: number;
  avg_questions_used: number;
  fastest_solve_seconds: number | null;
  avg_solve_time_seconds: number | null;
  avg_interrogation_rate: number;
  last_played: string;
}