'use client';

import { useGameStore, Difficulty } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signOut, getUserProfile } from '@/lib/supabase/api';
import { supabase } from '@/lib/supabase/client';
import { LogOut, Trophy, User, PlayCircle, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MainMenuProps {
  onShowLeaderboard: () => void;
  onShowProfile: () => void;
}

export function MainMenu({ onShowLeaderboard, onShowProfile }: MainMenuProps) {
  const initGame = useGameStore((state) => state.initGame);
  const [username, setUsername] = useState<string>('Player');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await getUserProfile(user.id);
        if (profile) {
          setUsername(profile.username);
        }
      }
    };
    loadProfile();
  }, []);

  const handleStartGame = (difficulty: Difficulty) => {
    initGame(difficulty);
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="paper-texture paper-shadow p-6 transform -rotate-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#6B4423] rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-[#F4E8D0]" />
                </div>
                <div>
                  <p className="typewriter-text text-sm text-[#2D2D2D] mb-1">DETECTIVE</p>
                  <h1 className="text-2xl font-bold typewriter-text text-[#1A1A1A]">
                    {username}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={onShowLeaderboard}
                className="bg-[#F4C430] hover:bg-[#FFD700] text-[#1A1A1A] font-bold typewriter-text shadow-lg"
              >
                <Trophy className="w-4 h-4 mr-2" />
                LEADERBOARD
              </Button>
              <Button
                onClick={onShowProfile}
                className="bg-[#4169E1] hover:bg-[#4169E1]/90 text-[#F4E8D0] font-bold typewriter-text shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                PROFILE
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-[#C41E3A] hover:bg-[#8B0000] text-[#F4E8D0] font-bold typewriter-text shadow-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="inline-block paper-texture paper-shadow p-6 mb-6 transform rotate-1 relative">
              <div className="coffee-stain" style={{ top: '10px', right: '15px' }}></div>
              <h2 className="text-3xl font-bold typewriter-text text-[#1A1A1A] mb-2">
                SELECT CASE FILE
              </h2>
              <div className="h-0.5 w-full bg-[#1A1A1A]"></div>
            </div>
            <div className="paper-texture paper-shadow p-4 max-w-2xl mx-auto transform -rotate-1">
              <p className="typewriter-text text-[#2D2D2D]">
                Choose your investigation difficulty level.<br />
                Higher difficulty = More suspects + Fewer questions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => handleStartGame('easy')}
              className="cursor-pointer group transform hover:-rotate-1 transition-transform"
            >
              <Card className="p-8 bg-[#F4C430] border-4 border-[#6B4423] shadow-lg relative overflow-hidden">
                <div className="absolute top-2 right-2 stamp-text text-[#2D5016] text-xs opacity-40 transform -rotate-12">
                  APPROVED
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#2D5016] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-[#F4E8D0]" />
                  </div>
                  <h3 className="text-3xl font-black stamp-text text-[#1A1A1A] mb-4">EASY</h3>
                  <div className="space-y-2 typewriter-text text-[#2D2D2D] mb-6 font-bold">
                    <p>■ 3 SUSPECTS</p>
                    <p>■ 15 QUESTIONS</p>
                    <p>■ BEGINNER FRIENDLY</p>
                  </div>
                  <Button className="w-full bg-[#2D5016] hover:bg-[#4A7C2C] text-[#F4E8D0] font-black stamp-text shadow-lg">
                    OPEN CASE
                  </Button>
                </div>
              </Card>
            </div>

            <div
              onClick={() => handleStartGame('medium')}
              className="cursor-pointer group transform hover:rotate-1 transition-transform"
            >
              <Card className="p-8 bg-[#FFA500] border-4 border-[#6B4423] shadow-lg relative overflow-hidden">
                <div className="absolute top-2 right-2 stamp-text text-[#8B5A3C] text-xs opacity-40 transform rotate-12">
                  PRIORITY
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#8B5A3C] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-[#F4E8D0]" />
                  </div>
                  <h3 className="text-3xl font-black stamp-text text-[#1A1A1A] mb-4">MEDIUM</h3>
                  <div className="space-y-2 typewriter-text text-[#2D2D2D] mb-6 font-bold">
                    <p>■ 5 SUSPECTS</p>
                    <p>■ 12 QUESTIONS</p>
                    <p>■ BALANCED CASE</p>
                  </div>
                  <Button className="w-full bg-[#8B5A3C] hover:bg-[#6B4423] text-[#F4E8D0] font-black stamp-text shadow-lg">
                    OPEN CASE
                  </Button>
                </div>
              </Card>
            </div>

            <div
              onClick={() => handleStartGame('hard')}
              className="cursor-pointer group transform hover:-rotate-1 transition-transform"
            >
              <Card className="p-8 bg-[#C41E3A] border-4 border-[#1A1A1A] shadow-lg relative overflow-hidden">
                <div className="absolute top-2 right-2 stamp-text text-[#1A1A1A] text-xs opacity-40 transform -rotate-12">
                  URGENT
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#1A1A1A] shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-[#C41E3A]" />
                  </div>
                  <h3 className="text-3xl font-black stamp-text text-[#F4E8D0] mb-4">HARD</h3>
                  <div className="space-y-2 typewriter-text text-[#F4E8D0] mb-6 font-bold">
                    <p>■ 5 SUSPECTS</p>
                    <p>■ 8 QUESTIONS</p>
                    <p>■ EXPERT ONLY</p>
                  </div>
                  <Button className="w-full bg-[#1A1A1A] hover:bg-[#2D2D2D] text-[#C41E3A] font-black stamp-text shadow-lg">
                    OPEN CASE
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-center">
            <Card className="paper-texture paper-shadow p-8 border-4 border-[#C41E3A] relative transform rotate-1">
              <div className="absolute top-3 right-3 stamp-text text-[#C41E3A] opacity-60 transform rotate-12 text-lg">
                CLASSIFIED
              </div>
              <div className="coffee-stain" style={{ bottom: '20px', left: '30px' }}></div>
              <h3 className="text-xl font-black stamp-text text-[#1A1A1A] mb-4">MISSION BRIEFING</h3>
              <div className="h-0.5 w-full bg-[#1A1A1A] mb-4"></div>
              <p className="typewriter-text text-[#2D2D2D] leading-relaxed">
                <span className="font-bold">INCIDENT REPORT:</span><br />
                A serious crime has occurred on the space station.<br />
                Security cameras were disabled during the incident.<br />
                One of the crew members is the impostor.<br />
                <span className="text-[#C41E3A] font-bold block mt-2">▶ USE YOUR QUESTIONS WISELY TO UNCOVER THE TRUTH</span>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
