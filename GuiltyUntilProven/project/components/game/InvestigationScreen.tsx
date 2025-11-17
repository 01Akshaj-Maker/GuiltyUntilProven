'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, MessageSquare, Link as LinkIcon, X, Gavel, Lightbulb } from 'lucide-react';
import { ChatModal } from './ChatModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InvestigationScreenProps {
  onGameEnd: (stats: any) => void;
}

export function InvestigationScreen({ onGameEnd }: InvestigationScreenProps) {
  const suspects = useGameStore((state) => state.suspects);
  const allEvidence = useGameStore((state) => state.allEvidence);
  const discoveredEvidenceIds = useGameStore((state) => state.discoveredEvidenceIds);
  const questionsRemaining = useGameStore((state) => state.questionsRemaining);
  const currentInterrogationTarget = useGameStore((state) => state.currentInterrogationTarget);
  const newEvidenceMessage = useGameStore((state) => state.newEvidenceMessage);
  const startInterrogation = useGameStore((state) => state.startInterrogation);
  const linkEvidence = useGameStore((state) => state.linkEvidence);
  const unlinkEvidence = useGameStore((state) => state.unlinkEvidence);
  const makeAccusation = useGameStore((state) => state.makeAccusation);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [showAccusationDialog, setShowAccusationDialog] = useState(false);
  const [accusationTarget, setAccusationTarget] = useState<string | null>(null);

  const discoveredEvidence = allEvidence.filter(e => discoveredEvidenceIds.includes(e.id));
  const suspectsInterrogated = suspects.filter(s => s.conversationHistory.length > 0).length;

  const handleEvidenceClick = (evidenceId: string) => {
    if (selectedEvidenceId === evidenceId) {
      setSelectedEvidenceId(null);
    } else {
      setSelectedEvidenceId(evidenceId);
    }
  };

  const handleSuspectClick = (suspectName: string) => {
    if (selectedEvidenceId) {
      const evidence = allEvidence.find(e => e.id === selectedEvidenceId);
      if (evidence && evidence.linkedSuspects.includes(suspectName)) {
        unlinkEvidence(selectedEvidenceId, suspectName);
      } else {
        linkEvidence(selectedEvidenceId, suspectName);
      }
      setSelectedEvidenceId(null);
    } else {
      console.log('Starting interrogation with:', suspectName);
      startInterrogation(suspectName);
    }
  };

  const handleAccusation = (suspectName: string) => {
    setAccusationTarget(suspectName);
    setShowAccusationDialog(true);
  };

  const confirmAccusation = () => {
    if (accusationTarget) {
      const stats = makeAccusation(accusationTarget);
      if (stats) {
        onGameEnd(stats);
      }
    }
    setShowAccusationDialog(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[#4A3728] film-grain relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D2D2D]/60 to-[#1A1A1A]/80"></div>

        <div className="relative z-10 h-screen flex flex-col">
          <div className="border-b-4 border-[#1A1A1A] bg-[#6B4423] wood-texture shadow-lg">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="paper-texture px-6 py-3 shadow-lg border-2 border-[#1A1A1A] transform -rotate-1">
                  <h1 className="text-xl font-black stamp-text text-[#1A1A1A]">
                    INTERROGATION IN PROGRESS
                  </h1>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="paper-texture px-4 py-2 shadow-lg border-2 border-[#1A1A1A]">
                    <span className="typewriter-text text-[#2D2D2D] font-bold">QUESTIONS: </span>
                    <span className={`typewriter-text font-black ${questionsRemaining <= 3 ? 'text-[#C41E3A]' : 'text-[#1A1A1A]'}`}>
                      {questionsRemaining}
                    </span>
                  </div>
                  <div className="paper-texture px-4 py-2 shadow-lg border-2 border-[#1A1A1A]">
                    <span className="typewriter-text text-[#2D2D2D] font-bold">INTERROGATED: </span>
                    <span className="typewriter-text font-black text-[#1A1A1A]">{suspectsInterrogated}/{suspects.length}</span>
                  </div>
                  <div className="paper-texture px-4 py-2 shadow-lg border-2 border-[#1A1A1A]">
                    <span className="typewriter-text text-[#2D2D2D] font-bold">EVIDENCE: </span>
                    <span className="typewriter-text font-black text-[#1A1A1A]">{discoveredEvidenceIds.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 container mx-auto px-4 py-6 flex gap-6 overflow-hidden">
            <div className="w-80 flex flex-col gap-4 overflow-y-auto">
              <Card className="cork-texture border-4 border-[#6B4423] p-4 shadow-lg">
                <h2 className="text-lg font-black stamp-text text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  EVIDENCE BOARD
                </h2>
                <ScrollArea className="h-64">
                  <div className="space-y-2 pr-4">
                    {discoveredEvidence.map(evidence => {
                      const isSelected = selectedEvidenceId === evidence.id;
                      return (
                        <div
                          key={evidence.id}
                          onClick={() => handleEvidenceClick(evidence.id)}
                          className={`p-3 paper-texture paper-shadow cursor-pointer transition-all transform hover:-rotate-1 ${
                            isSelected
                              ? 'border-4 border-[#FFD700] scale-105'
                              : 'border-2 border-[#6B4423]'
                          }`}
                        >
                          <p className="text-xs typewriter-text text-[#1A1A1A] mb-2 leading-relaxed">{evidence.text}</p>
                          {evidence.linkedSuspects.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {evidence.linkedSuspects.map(suspectName => (
                                <Badge
                                  key={suspectName}
                                  className="text-xs bg-[#C41E3A] text-[#F4E8D0] border-2 border-[#1A1A1A] handwriting-text"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unlinkEvidence(evidence.id, suspectName);
                                  }}
                                >
                                  {suspectName}
                                  <X className="w-3 h-3 ml-1" />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                {selectedEvidenceId && (
                  <div className="mt-3 p-2 bg-[#FFD700] border-2 border-[#1A1A1A]">
                    <p className="text-xs typewriter-text text-[#1A1A1A] text-center font-bold">
                      CLICK A SUSPECT TO PIN THIS EVIDENCE
                    </p>
                  </div>
                )}
              </Card>

              <Card className="cork-texture border-4 border-[#6B4423] p-4 shadow-lg">
                <h2 className="text-lg font-black stamp-text text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  QUESTIONS
                </h2>
                <div className="space-y-2">
                  <div className="p-2 paper-texture border border-[#6B4423] shadow-sm">
                    <p className="text-xs typewriter-text text-[#2D2D2D]">"Prove your alibi - do you have witnesses?"</p>
                  </div>
                  <div className="p-2 paper-texture border border-[#6B4423] shadow-sm">
                    <p className="text-xs typewriter-text text-[#2D2D2D]">"Who has Engineer access?"</p>
                  </div>
                  <div className="p-2 paper-texture border border-[#6B4423] shadow-sm">
                    <p className="text-xs typewriter-text text-[#2D2D2D]">"Did you see anyone near Server Room?"</p>
                  </div>
                  <div className="p-2 paper-texture border border-[#6B4423] shadow-sm">
                    <p className="text-xs typewriter-text text-[#2D2D2D]">"What were you doing at 14:45?"</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <Card className="bg-[#708090] border-4 border-[#1A1A1A] p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black stamp-text text-[#F4E8D0]">SUSPECT LINE-UP</h2>
                  <div className="w-3 h-3 rounded-full bg-[#C41E3A] animate-pulse shadow-lg"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {suspects.map(suspect => (
                    <div
                      key={suspect.name}
                      onClick={() => handleSuspectClick(suspect.name)}
                      className="p-4 paper-texture paper-shadow border-2 border-[#1A1A1A] cursor-pointer group transform hover:-rotate-1 transition-all"
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-2">{suspect.emoji}</div>
                        <h3 className="font-black typewriter-text text-[#1A1A1A]">{suspect.name}</h3>
                        <p className="text-xs typewriter-text text-[#6B4423] mb-2">{suspect.role}</p>
                        {suspect.conversationHistory.length > 0 && (
                          <Badge className="text-xs bg-[#4169E1] text-[#F4E8D0] border border-[#1A1A1A]">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {suspect.conversationHistory.length} Q&A
                          </Badge>
                        )}
                        {suspect.linkedEvidence.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 justify-center">
                            {suspect.linkedEvidence.map(evidenceId => (
                              <div key={evidenceId} className="w-2 h-2 bg-[#FFD700] border border-[#1A1A1A]" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-[#C41E3A] border-4 border-[#1A1A1A] p-6 shadow-lg">
                <h2 className="text-xl font-black stamp-text text-[#F4E8D0] mb-4 flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  FINAL ACCUSATION
                </h2>
                <p className="text-sm typewriter-text text-[#F4E8D0] mb-4 font-bold">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  WARNING: You only get one chance. Choose carefully.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {suspects.map(suspect => (
                    <Button
                      key={suspect.name}
                      onClick={() => handleAccusation(suspect.name)}
                      className="bg-[#1A1A1A] hover:bg-[#2D2D2D] text-[#C41E3A] font-black stamp-text border-2 border-[#F4E8D0]"
                    >
                      ACCUSE {suspect.name.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {newEvidenceMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Card className="p-4 bg-[#2D5016] border-4 border-[#FFD700] paper-shadow max-w-md">
            <p className="typewriter-text text-[#FFD700] font-black">NEW EVIDENCE DISCOVERED!</p>
            <p className="text-sm typewriter-text text-[#F4E8D0] mt-1">{newEvidenceMessage}</p>
          </Card>
        </div>
      )}

      {currentInterrogationTarget && <ChatModal />}

      <AlertDialog open={showAccusationDialog} onOpenChange={setShowAccusationDialog}>
        <AlertDialogContent className="paper-texture border-4 border-[#C41E3A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="stamp-text text-[#1A1A1A] text-2xl">FINAL ACCUSATION?</AlertDialogTitle>
            <AlertDialogDescription className="typewriter-text text-[#2D2D2D]">
              Are you sure you want to accuse <span className="font-black text-[#C41E3A]">{accusationTarget}</span> of being the impostor?
              <br /><br />
              This is your final decision. There's no going back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#708090] hover:bg-[#A9A9A9] typewriter-text font-bold">CANCEL</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAccusation}
              className="bg-[#C41E3A] hover:bg-[#8B0000] stamp-text text-[#F4E8D0] border-2 border-[#1A1A1A]"
            >
              ACCUSE {accusationTarget?.toUpperCase()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
