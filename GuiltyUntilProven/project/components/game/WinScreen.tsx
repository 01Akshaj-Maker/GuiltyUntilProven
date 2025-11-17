'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Clock, Users, Brain, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinScreenProps {
  stats: {
    questionsUsed: number;
    questionsAvailable: number;
    suspectsInterrogated: number;
    totalSuspects: number;
    evidenceDiscovered: number;
    solveTimeSeconds: number;
    impostorName: string;
  };
}

export function WinScreen({ stats }: WinScreenProps) {
  const resetGame = useGameStore((state) => state.resetGame);
  const suspect = useGameStore((state) => state.suspects.find(s => s.name === stats.impostorName));

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#2D5016', '#F4C430'],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#2D5016', '#F4C430'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const minutes = Math.floor(stats.solveTimeSeconds / 60);
  const seconds = stats.solveTimeSeconds % 60;

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block paper-texture paper-shadow p-12 border-4 border-[#2D5016] mb-8 relative animate-in zoom-in duration-500">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D5016] px-8 py-4 border-4 border-[#1A1A1A] transform -rotate-3 shadow-xl">
                <Trophy className="w-16 h-16 text-[#FFD700] mx-auto" />
              </div>
              <div className="mt-8 mb-6">
                <div className="stamp-text text-6xl text-[#2D5016] transform -rotate-3 mb-4">
                  CASE CLOSED
                </div>
                <div className="h-1 w-full bg-[#2D5016] mb-2"></div>
                <div className="h-0.5 w-full bg-[#2D5016]"></div>
              </div>

              <p className="text-2xl typewriter-text text-[#1A1A1A] mb-2 font-bold">
                Excellent detective work!
              </p>
              <p className="typewriter-text text-[#2D2D2D]">
                You've successfully identified the impostor.
              </p>
            </div>

            {suspect && (
              <Card className="p-6 paper-texture paper-shadow border-4 border-[#C41E3A] max-w-2xl mx-auto mb-8 relative">
                <div className="absolute -top-4 -right-4 bg-[#C41E3A] px-6 py-3 stamp-text text-[#F4E8D0] border-2 border-[#1A1A1A] transform rotate-12">
                  GUILTY
                </div>
                <div className="flex items-center gap-4 justify-center mb-4">
                  <div className="text-6xl border-4 border-[#1A1A1A] p-4 bg-[#E8DCC8]">{suspect.emoji}</div>
                  <div className="text-left">
                    <h2 className="text-2xl font-black stamp-text text-[#1A1A1A]">{suspect.name}</h2>
                    <p className="typewriter-text text-[#C41E3A] font-bold">{suspect.role}</p>
                  </div>
                </div>
                <div className="typewriter-text text-[#2D2D2D] italic bg-[#E8DCC8] p-4 border-2 border-[#6B4423]">
                  "Alright, you got me. I disabled the cameras and committed the crime.
                  I thought I could get away with it, but you were too clever."
                </div>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="paper-texture paper-shadow border-2 border-[#6B4423] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#4169E1] flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-[#F4E8D0]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">QUESTIONS USED</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                {stats.questionsUsed}/{stats.questionsAvailable}
              </p>
            </Card>

            <Card className="paper-texture paper-shadow border-2 border-[#6B4423] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#6B4423] flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-[#F4E8D0]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">INTERROGATED</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                {stats.suspectsInterrogated}/{stats.totalSuspects}
              </p>
            </Card>

            <Card className="paper-texture paper-shadow border-2 border-[#6B4423] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#FFD700] flex items-center justify-center shadow-lg">
                <Trophy className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">EVIDENCE FOUND</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">{stats.evidenceDiscovered}</p>
            </Card>

            <Card className="paper-texture paper-shadow border-2 border-[#6B4423] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#C41E3A] flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-[#F4E8D0]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">SOLVE TIME</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Card className="p-4 bg-[#2D5016] border-4 border-[#FFD700] paper-shadow max-w-md mx-auto transform rotate-1">
              <p className="typewriter-text text-[#FFD700] font-black">
                YOUR STATS HAVE BEEN SAVED TO THE LEADERBOARD!
              </p>
            </Card>

            <Button
              onClick={resetGame}
              size="lg"
              className="bg-[#6B4423] hover:bg-[#8B5A3C] text-[#F4E8D0] font-black stamp-text text-xl px-12 py-8 border-4 border-[#1A1A1A] shadow-xl transform hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              SOLVE ANOTHER CASE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
