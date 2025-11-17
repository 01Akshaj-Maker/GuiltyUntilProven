'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, User, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { getUserProfile, getUserStats } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<{
    totalGames: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    avgQuestions: number;
    fastestSolve: number | null;
    avgSolveTime: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profileData = await getUserProfile(user.id);
        const statsData = await getUserStats(user.id);

        setProfile(profileData);
        setStats(statsData);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen wood-texture film-grain flex items-center justify-center">
        <div className="text-center paper-texture paper-shadow p-8 border-2 border-[#1A1A1A]">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#6B4423] border-t-transparent rounded-full animate-spin"></div>
          <p className="typewriter-text text-[#1A1A1A] font-bold">Loading detective file...</p>
        </div>
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen wood-texture film-grain flex items-center justify-center">
        <Card className="p-8 paper-texture paper-shadow border-4 border-[#C41E3A] text-center">
          <p className="typewriter-text text-[#1A1A1A] font-bold">Failed to load detective file</p>
          <Button onClick={onBack} className="mt-4 bg-[#6B4423] hover:bg-[#8B5A3C] text-[#F4E8D0] font-bold stamp-text">
            BACK TO MENU
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              className="bg-[#6B4423] hover:bg-[#8B5A3C] text-[#F4E8D0] font-bold typewriter-text border-2 border-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO MENU
            </Button>
            <div className="paper-texture paper-shadow p-4 border-4 border-[#1A1A1A] transform -rotate-1">
              <h1 className="text-2xl font-black stamp-text text-[#1A1A1A]">DETECTIVE FILE</h1>
            </div>
          </div>

          <Card className="p-8 paper-texture paper-shadow border-4 border-[#6B4423] mb-6 relative">
            <div className="absolute top-2 right-2 stamp-text text-[#C41E3A] text-xs opacity-60 transform rotate-12">
              CONFIDENTIAL
            </div>
            <div className="coffee-stain" style={{ top: '20px', right: '80px' }}></div>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-[#6B4423] border-4 border-[#1A1A1A] flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-[#F4E8D0]" />
              </div>
              <div>
                <h1 className="text-4xl font-black stamp-text text-[#1A1A1A] mb-2">{profile.username}</h1>
                <p className="typewriter-text text-[#6B4423] font-bold">{profile.email}</p>
                <p className="text-sm typewriter-text text-[#2D2D2D] mt-1">
                  <span className="font-bold">BADGE ISSUED:</span> {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 paper-texture paper-shadow border-4 border-[#6B4423] relative">
              <div className="coffee-stain" style={{ bottom: '15px', left: '20px' }}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#FFD700] flex items-center justify-center shadow-lg border-2 border-[#1A1A1A]">
                  <Trophy className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <h2 className="text-xl font-black stamp-text text-[#1A1A1A]">CASE RECORD</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#E8DCC8] border-2 border-[#6B4423]">
                  <span className="typewriter-text text-[#6B4423] font-bold">TOTAL CASES</span>
                  <span className="text-2xl font-black stamp-text text-[#1A1A1A]">{stats.totalGames}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#E8DCC8] border-2 border-[#2D5016]">
                  <span className="typewriter-text text-[#6B4423] font-bold">SOLVED</span>
                  <span className="text-2xl font-black stamp-text text-[#2D5016]">{stats.totalWins}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#E8DCC8] border-2 border-[#C41E3A]">
                  <span className="typewriter-text text-[#6B4423] font-bold">UNSOLVED</span>
                  <span className="text-2xl font-black stamp-text text-[#C41E3A]">{stats.totalLosses}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#FFD700] border-4 border-[#1A1A1A]">
                  <span className="stamp-text text-[#1A1A1A]">SUCCESS RATE</span>
                  <span className="text-3xl font-black stamp-text text-[#1A1A1A]">
                    {stats.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 paper-texture paper-shadow border-4 border-[#6B4423] relative">
              <div className="coffee-stain" style={{ top: '15px', right: '25px' }}></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#4169E1] flex items-center justify-center shadow-lg border-2 border-[#1A1A1A]">
                  <TrendingUp className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h2 className="text-xl font-black stamp-text text-[#1A1A1A]">PERFORMANCE</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#E8DCC8] border-2 border-[#6B4423]">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-xs typewriter-text text-[#6B4423] font-bold">AVG QUESTIONS USED</span>
                  </div>
                  <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                    {stats.avgQuestions > 0 ? stats.avgQuestions.toFixed(1) : 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-[#E8DCC8] border-2 border-[#6B4423]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#4169E1]" />
                    <span className="text-xs typewriter-text text-[#6B4423] font-bold">FASTEST SOLVE</span>
                  </div>
                  <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                    {stats.fastestSolve
                      ? `${Math.floor(stats.fastestSolve / 60)}:${(stats.fastestSolve % 60)
                          .toString()
                          .padStart(2, '0')}`
                      : 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-[#E8DCC8] border-2 border-[#6B4423]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#2D5016]" />
                    <span className="text-xs typewriter-text text-[#6B4423] font-bold">AVG SOLVE TIME</span>
                  </div>
                  <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                    {stats.avgSolveTime
                      ? `${Math.floor(stats.avgSolveTime / 60)}:${Math.floor(stats.avgSolveTime % 60)
                          .toString()
                          .padStart(2, '0')}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {stats.totalGames === 0 && (
            <Card className="p-8 bg-[#FFD700] border-4 border-[#1A1A1A] paper-shadow text-center transform -rotate-1">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-[#1A1A1A]" />
              <h3 className="text-2xl font-black stamp-text text-[#1A1A1A] mb-2">START YOUR DETECTIVE CAREER!</h3>
              <p className="typewriter-text text-[#1A1A1A]">
                Solve your first case to start tracking statistics and climb the leaderboard.
              </p>
            </Card>
          )}

          {stats.totalGames > 0 && stats.winRate >= 50 && (
            <Card className="p-6 bg-[#2D5016] border-4 border-[#FFD700] paper-shadow transform rotate-1">
              <p className="typewriter-text text-[#FFD700] text-center font-black">
                <Trophy className="w-5 h-5 inline mr-2" />
                EXCELLENT DETECTIVE WORK! SOLVING OVER HALF YOUR CASES!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
