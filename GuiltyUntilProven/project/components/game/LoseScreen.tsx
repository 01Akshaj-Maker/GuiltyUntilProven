'use client';

import { useGameStore } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, Clock, Users, Brain, RotateCcw, Lightbulb } from 'lucide-react';

interface LoseScreenProps {
  stats: {
    questionsUsed: number;
    questionsAvailable: number;
    suspectsInterrogated: number;
    totalSuspects: number;
    evidenceDiscovered: number;
    solveTimeSeconds: number;
    impostorName: string;
    accusedName: string;
  };
}

export function LoseScreen({ stats }: LoseScreenProps) {
  const resetGame = useGameStore((state) => state.resetGame);
  const impostor = useGameStore((state) => state.suspects.find(s => s.name === stats.impostorName));
  const accused = useGameStore((state) => state.suspects.find(s => s.name === stats.accusedName));

  const minutes = Math.floor(stats.solveTimeSeconds / 60);
  const seconds = stats.solveTimeSeconds % 60;

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block paper-texture paper-shadow p-12 border-4 border-[#C41E3A] mb-8 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#C41E3A] px-8 py-4 border-4 border-[#1A1A1A] transform rotate-3 shadow-xl">
                <XCircle className="w-16 h-16 text-[#F4E8D0] mx-auto" />
              </div>
              <div className="mt-8 mb-6">
                <div className="stamp-text text-6xl text-[#C41E3A] transform rotate-2 mb-4">
                  CASE UNSOLVED
                </div>
                <div className="h-1 w-full bg-[#C41E3A] mb-2"></div>
                <div className="h-0.5 w-full bg-[#C41E3A]"></div>
              </div>

              <p className="text-2xl typewriter-text text-[#1A1A1A] mb-2 font-bold">
                Wrong Accusation
              </p>
              <p className="typewriter-text text-[#2D2D2D]">
                The impostor escaped while you accused the wrong person.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
              {accused && (
                <Card className="p-6 paper-texture paper-shadow border-4 border-[#C41E3A] relative">
                  <div className="absolute -top-4 -right-4 bg-[#C41E3A] px-6 py-3 stamp-text text-[#F4E8D0] border-2 border-[#1A1A1A] transform -rotate-12">
                    INNOCENT
                  </div>
                  <p className="text-xs typewriter-text text-[#6B4423] mb-3 font-bold">YOU ACCUSED:</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl border-4 border-[#1A1A1A] p-3 bg-[#E8DCC8]">{accused.emoji}</div>
                    <div className="text-left">
                      <h3 className="text-xl font-black stamp-text text-[#1A1A1A]">{accused.name}</h3>
                      <p className="text-sm typewriter-text text-[#6B4423] font-bold">{accused.role}</p>
                    </div>
                  </div>
                  <div className="typewriter-text text-[#2D2D2D] italic bg-[#E8DCC8] p-4 border-2 border-[#6B4423]">
                    "What? I had nothing to do with this! I was exactly where I said I was!"
                  </div>
                </Card>
              )}

              {impostor && (
                <Card className="p-6 paper-texture paper-shadow border-4 border-[#2D5016] relative">
                  <div className="absolute -top-4 -right-4 bg-[#2D5016] px-6 py-3 stamp-text text-[#FFD700] border-2 border-[#1A1A1A] transform rotate-12">
                    ESCAPED
                  </div>
                  <p className="text-xs typewriter-text text-[#6B4423] mb-3 font-bold">THE ACTUAL IMPOSTOR:</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-5xl border-4 border-[#1A1A1A] p-3 bg-[#E8DCC8]">{impostor.emoji}</div>
                    <div className="text-left">
                      <h3 className="text-xl font-black stamp-text text-[#1A1A1A]">{impostor.name}</h3>
                      <p className="text-sm typewriter-text text-[#2D5016] font-bold">{impostor.role}</p>
                    </div>
                  </div>
                  <div className="typewriter-text text-[#2D2D2D] italic bg-[#E8DCC8] p-4 border-2 border-[#6B4423]">
                    "Thanks for the distraction! While you were interrogating everyone else, I made my escape."
                  </div>
                </Card>
              )}
            </div>
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
                <Lightbulb className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">EVIDENCE FOUND</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">{stats.evidenceDiscovered}</p>
            </Card>

            <Card className="paper-texture paper-shadow border-2 border-[#6B4423] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#C41E3A] flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-[#F4E8D0]" />
              </div>
              <p className="text-xs typewriter-text text-[#6B4423] mb-1 font-bold">TIME SPENT</p>
              <p className="text-2xl font-black stamp-text text-[#1A1A1A]">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </p>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-[#FFD700] border-4 border-[#1A1A1A] paper-shadow max-w-2xl mx-auto transform -rotate-1">
              <h3 className="font-black stamp-text text-[#1A1A1A] mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                TIPS FOR NEXT TIME
              </h3>
              <ul className="space-y-2 text-sm typewriter-text text-[#1A1A1A]">
                <li>■ Ask about alibis and who can verify their location</li>
                <li>■ Check who has access credentials to the crime scene</li>
                <li>■ Look for suspects with vague answers or no witnesses</li>
                <li>■ Link evidence to suspects to track inconsistencies</li>
                <li>■ The impostor will try to lie convincingly - look for contradictions</li>
              </ul>
            </Card>

            <div className="text-center">
              <Button
                onClick={resetGame}
                size="lg"
                className="bg-[#6B4423] hover:bg-[#8B5A3C] text-[#F4E8D0] font-black stamp-text text-xl px-12 py-8 border-4 border-[#1A1A1A] shadow-xl transform hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-6 h-6 mr-3" />
                TRY AGAIN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
