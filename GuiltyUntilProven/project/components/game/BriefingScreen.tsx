'use client';

import { useGameStore } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, ArrowRight } from 'lucide-react';
import { getCrimeTypeLabel, getCrimeTypeColor } from '@/lib/game/scenario-generator';

export function BriefingScreen() {
  const suspects = useGameStore((state) => state.suspects);
  const scenario = useGameStore((state) => state.scenario);
  const allEvidence = useGameStore((state) => state.allEvidence);
  const discoveredEvidenceIds = useGameStore((state) => state.discoveredEvidenceIds);
  const startPlaying = useGameStore((state) => state.startPlaying);

  const initialEvidence = allEvidence.filter(e => discoveredEvidenceIds.includes(e.id));

  if (!scenario) return null;

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block paper-texture paper-shadow p-6 border-4 border-[#C41E3A] transform -rotate-1 relative">
              <div className="absolute -top-2 -right-2 stamp-text text-[#C41E3A] bg-[#F4E8D0] px-4 py-2 transform rotate-12 border-2 border-[#C41E3A]">
                {getCrimeTypeLabel(scenario.crimeType)}
              </div>
              <h1 className="text-4xl font-black stamp-text text-[#1A1A1A] mb-2">
                CASE FILE #{Math.floor(Math.random() * 9000) + 1000}
              </h1>
              <div className="h-1 w-full bg-[#1A1A1A]"></div>
            </div>
            <div className="mt-6 paper-texture paper-shadow p-4 inline-block transform rotate-1">
              <p className="typewriter-text text-[#2D2D2D]">Study the case file before beginning your investigation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="paper-texture paper-shadow border-4 border-[#6B4423] p-8 relative">
              <div className="coffee-stain" style={{ top: '10px', right: '20px' }}></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#C41E3A] flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h2 className="text-2xl font-black stamp-text text-[#1A1A1A]">THE CRIME</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#E8DCC8] border-2 border-[#C41E3A]">
                  <h3 className="font-bold typewriter-text text-[#C41E3A] mb-2">INCIDENT REPORT:</h3>
                  <p className="typewriter-text text-[#2D2D2D] text-sm leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="p-4 bg-[#E8DCC8] border-2 border-[#4169E1]">
                  <h3 className="font-bold typewriter-text text-[#4169E1] mb-2">KEY FACTS:</h3>
                  <ul className="space-y-2 typewriter-text text-[#2D2D2D] text-sm">
                    {initialEvidence.map(evidence => (
                      <li key={evidence.id} className="flex items-start gap-2">
                        <span className="text-[#4169E1] mt-0.5">■</span>
                        <span>{evidence.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#E8DCC8] border-2 border-[#F4C430]">
                  <h3 className="font-bold typewriter-text text-[#8B5A3C] mb-2">YOUR MISSION:</h3>
                  <p className="typewriter-text text-[#2D2D2D] text-sm leading-relaxed">
                    Interrogate the crew members, discover evidence, and identify the impostor.
                    You have limited questions, so make them count. Once you accuse someone, there's no going back.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="paper-texture paper-shadow border-4 border-[#6B4423] p-8 relative">
              <div className="coffee-stain" style={{ bottom: '15px', left: '25px' }}></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#6B4423] flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h2 className="text-2xl font-black stamp-text text-[#1A1A1A]">THE SUSPECTS</h2>
              </div>

              <div className="space-y-3">
                {suspects.map((suspect, index) => (
                  <div
                    key={suspect.name}
                    className="p-4 bg-[#E8DCC8] border-2 border-[#6B4423] relative transform hover:-rotate-1 transition-transform"
                  >
                    <div className="absolute -top-1 -right-1 w-8 h-8">
                      <div className="w-full h-full rounded-full bg-[#C41E3A] border-2 border-[#1A1A1A]"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{suspect.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-black typewriter-text text-[#1A1A1A] text-lg">{suspect.name}</h3>
                        <p className="text-sm typewriter-text text-[#6B4423] font-bold">{suspect.role}</p>
                        <p className="text-xs typewriter-text text-[#2D2D2D] mt-1">
                          <span className="font-bold">ALIBI:</span> {suspect.alibi}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Card className="paper-texture paper-shadow p-6 border-4 border-[#FFD700] mb-6 relative transform rotate-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 stamp-text text-[#1A1A1A] bg-[#FFD700] px-6 py-2 border-2 border-[#1A1A1A]">
                PRO TIP
              </div>
              <div className="mt-4">
                <p className="typewriter-text text-[#2D2D2D] text-sm leading-relaxed">
                  <span className="font-bold">INVESTIGATION STRATEGY:</span> Ask about alibis, witnesses, and access credentials.
                  Link evidence to suspects to build your case. Look for contradictions in their stories.
                </p>
              </div>
            </Card>

            <Button
              onClick={startPlaying}
              className="bg-[#C41E3A] hover:bg-[#8B0000] text-[#F4E8D0] font-black stamp-text text-xl px-12 py-8 shadow-lg border-4 border-[#1A1A1A] transform hover:scale-105 transition-transform"
            >
              BEGIN INVESTIGATION
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
