'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Trophy, Crown, Medal, Award } from 'lucide-react';
import { getLeaderboard } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import { LeaderboardEntry } from '@/lib/supabase/types';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      const data = await getLeaderboard(100);
      setLeaderboard(data);
      setLoading(false);
    };

    loadLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-[#FFD700]" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-[#A9A9A9]" />;
    if (rank === 3) return <Award className="w-5 h-5 text-[#FFA500]" />;
    return null;
  };

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              className="bg-[#6B4423] hover:bg-[#8B5A3C] text-[#F4E8D0] font-bold typewriter-text border-2 border-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO MENU
            </Button>
            <div className="paper-texture paper-shadow p-6 border-4 border-[#FFD700] transform -rotate-1">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-[#FFD700]" />
                <h1 className="text-4xl font-black stamp-text text-[#1A1A1A]">
                  HALL OF FAME
                </h1>
                <Trophy className="w-8 h-8 text-[#FFD700]" />
              </div>
            </div>
            <div className="w-32"></div>
          </div>

          <Card className="cork-texture border-4 border-[#6B4423] shadow-xl">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#6B4423] border-t-transparent rounded-full animate-spin"></div>
                <p className="typewriter-text text-[#1A1A1A] font-bold">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-12 text-center">
                <div className="paper-texture paper-shadow p-8 inline-block border-2 border-[#1A1A1A]">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-[#6B4423]" />
                  <p className="typewriter-text text-[#1A1A1A] text-lg font-bold">NO DETECTIVES YET</p>
                  <p className="typewriter-text text-[#2D2D2D] text-sm mt-2">Be the first to solve a case!</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="p-6">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 paper-texture border-2 border-[#1A1A1A] mb-4">
                    <div className="col-span-1 typewriter-text text-xs font-black text-[#1A1A1A]">RANK</div>
                    <div className="col-span-3 typewriter-text text-xs font-black text-[#1A1A1A]">DETECTIVE</div>
                    <div className="col-span-2 text-center typewriter-text text-xs font-black text-[#1A1A1A]">WIN RATE</div>
                    <div className="col-span-2 text-center typewriter-text text-xs font-black text-[#1A1A1A]">CASES WON</div>
                    <div className="col-span-2 text-center typewriter-text text-xs font-black text-[#1A1A1A]">AVG Q&A</div>
                    <div className="col-span-2 text-center typewriter-text text-xs font-black text-[#1A1A1A]">BEST TIME</div>
                  </div>

                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => {
                      const rank = index + 1;
                      const isCurrentUser = entry.user_id === currentUserId;

                      return (
                        <div
                          key={entry.user_id}
                          className={`grid grid-cols-12 gap-4 px-4 py-4 paper-texture paper-shadow transition-all transform hover:-rotate-1 ${
                            isCurrentUser
                              ? 'border-4 border-[#FFD700] bg-[#F4E8D0]'
                              : 'border-2 border-[#6B4423]'
                          }`}
                        >
                          <div className="col-span-1 flex items-center gap-2">
                            <span className={`font-black stamp-text ${rank <= 3 ? 'text-[#1A1A1A] text-xl' : 'text-[#6B4423] text-lg'}`}>
                              {rank}
                            </span>
                            {getRankIcon(rank)}
                          </div>

                          <div className="col-span-3 flex items-center">
                            <span className={`font-bold typewriter-text ${isCurrentUser ? 'text-[#C41E3A]' : 'text-[#1A1A1A]'}`}>
                              {entry.username}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs handwriting-text text-[#C41E3A]">(YOU)</span>
                              )}
                            </span>
                          </div>

                          <div className="col-span-2 text-center flex items-center justify-center">
                            <span className="font-black stamp-text text-[#1A1A1A]">
                              {Number(entry.win_rate).toFixed(1)}%
                            </span>
                          </div>

                          <div className="col-span-2 text-center flex items-center justify-center">
                            <span className="typewriter-text text-[#2D2D2D] font-bold">
                              {entry.total_wins} / {entry.total_games}
                            </span>
                          </div>

                          <div className="col-span-2 text-center flex items-center justify-center">
                            <span className="typewriter-text text-[#2D2D2D] font-bold">
                              {entry.avg_questions_used ? Number(entry.avg_questions_used).toFixed(1) : '-'}
                            </span>
                          </div>

                          <div className="col-span-2 text-center flex items-center justify-center">
                            <span className="typewriter-text text-[#2D2D2D] font-bold">
                              {entry.fastest_solve_seconds
                                ? `${Math.floor(entry.fastest_solve_seconds / 60)}:${(entry.fastest_solve_seconds % 60)
                                    .toString()
                                    .padStart(2, '0')}`
                                : '-'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            )}
          </Card>

          <Card className="mt-6 p-4 paper-texture paper-shadow border-2 border-[#6B4423] transform rotate-1">
            <p className="text-sm typewriter-text text-[#2D2D2D] text-center font-bold">
              ▶ Rankings based on win rate, then total wins. Keep solving cases to climb the board!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
