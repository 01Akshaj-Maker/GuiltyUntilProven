'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/stores/game-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { X, Send, AlertCircle, Loader2, Radio } from 'lucide-react';

export function ChatModal() {
  const currentTarget = useGameStore((state) => state.currentInterrogationTarget);
  const suspects = useGameStore((state) => state.suspects);
  const scenario = useGameStore((state) => state.scenario);
  const questionsRemaining = useGameStore((state) => state.questionsRemaining);
  const endInterrogation = useGameStore((state) => state.endInterrogation);
  const addConversation = useGameStore((state) => state.addConversation);
  const useQuestion = useGameStore((state) => state.useQuestion);
  const checkForEvidenceDiscovery = useGameStore((state) => state.checkForEvidenceDiscovery);

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suspect = suspects.find(s => s.name === currentTarget);

  useEffect(() => {
    console.log('ChatModal mounted/updated. currentTarget:', currentTarget, 'suspect:', suspect);
  }, [currentTarget, suspect]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [suspect?.conversationHistory]);

  if (!suspect) {
    console.log('ChatModal: No suspect found for target:', currentTarget);
    return null;
  }

  const handleSendQuestion = async () => {
    if (!question.trim() || loading || questionsRemaining <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        suspect: {
          name: suspect.name,
          role: suspect.role,
          personality: suspect.personality,
          alibi: suspect.alibi,
          actualLocation: suspect.actualLocation,
          isImpostor: suspect.isImpostor,
        },
        question: question.trim(),
        history: suspect.conversationHistory,
        scenario: scenario ? {
          crimeType: scenario.crimeType,
          location: {
            name: scenario.location.name,
            description: scenario.location.description,
          },
          timeOfCrime: scenario.timeOfCrime,
          description: scenario.description,
          motive: scenario.motive,
        } : undefined,
      };

      console.log('Sending request to /api/ai/ask:', requestBody);

      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError(`Server error (${response.status}): ${errorText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (!data.answer) {
        setError('Received empty response from AI. Please try again.');
        setLoading(false);
        return;
      }

      addConversation(suspect.name, question.trim(), data.answer);
      useQuestion();
      checkForEvidenceDiscovery(question.trim(), data.answer, suspect);
      setQuestion('');
    } catch (err: any) {
      console.error('Error sending question:', err);
      setError('Failed to send question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4 film-grain">
      <Card className="w-full max-w-4xl h-[90vh] bg-[#708090] border-4 border-[#1A1A1A] flex flex-col shadow-2xl">
        <div className="p-6 border-b-4 border-[#1A1A1A] bg-[#4A3728] wood-texture flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 paper-texture paper-shadow border-2 border-[#1A1A1A] flex items-center justify-center text-5xl">
              {suspect.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-black stamp-text text-[#F4E8D0]">{suspect.name}</h2>
              <p className="text-sm typewriter-text text-[#E8DCC8] font-bold">{suspect.role}</p>
              <p className="text-xs typewriter-text text-[#E8DCC8] mt-1">
                <span className="font-bold">ALIBI:</span> {suspect.alibi}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="paper-texture p-3 border-2 border-[#1A1A1A] shadow-lg">
              <p className="text-xs typewriter-text text-[#2D2D2D] font-bold">QUESTIONS LEFT</p>
              <p className={`text-3xl font-black stamp-text text-center ${questionsRemaining <= 3 ? 'text-[#C41E3A]' : 'text-[#1A1A1A]'}`}>
                {questionsRemaining}
              </p>
            </div>
            <Button
              onClick={endInterrogation}
              size="icon"
              className="bg-[#C41E3A] hover:bg-[#8B0000] border-2 border-[#1A1A1A]"
            >
              <X className="w-6 h-6 text-[#F4E8D0]" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-2 bg-[#1A1A1A] border-b-2 border-[#6B4423]">
          <div className="w-3 h-3 rounded-full bg-[#C41E3A] animate-pulse shadow-lg"></div>
          <Radio className="w-4 h-4 text-[#C41E3A]" />
          <span className="text-xs typewriter-text text-[#F4E8D0] font-bold">RECORDING IN PROGRESS</span>
        </div>

        <ScrollArea className="flex-1 p-6 bg-[#708090]" ref={scrollRef}>
          <div className="space-y-4">
            {suspect.conversationHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="paper-texture paper-shadow p-6 inline-block border-2 border-[#1A1A1A]">
                  <p className="typewriter-text text-[#2D2D2D] mb-4 font-bold">BEGIN INTERROGATION</p>
                  <div className="max-w-md mx-auto space-y-2 text-sm typewriter-text text-[#2D2D2D]">
                    <p className="font-bold">SUGGESTED QUESTIONS:</p>
                    <ul className="list-none space-y-1">
                      <li>■ Their whereabouts at 14:45</li>
                      <li>■ Who saw them</li>
                      <li>■ Their access credentials</li>
                      <li>■ What they were doing</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              suspect.conversationHistory.map((entry, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[70%] paper-texture paper-shadow p-4 border-2 border-[#4169E1] transform rotate-1">
                      <p className="text-xs typewriter-text text-[#4169E1] font-black mb-1">DETECTIVE:</p>
                      <p className="typewriter-text text-[#1A1A1A]">{entry.question}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[70%] paper-texture paper-shadow p-4 border-2 border-[#6B4423] transform -rotate-1">
                      <p className="text-xs typewriter-text text-[#6B4423] font-black mb-1">{suspect.name.toUpperCase()}:</p>
                      <p className="typewriter-text text-[#1A1A1A]">{entry.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] paper-texture paper-shadow p-4 border-2 border-[#6B4423] transform -rotate-1">
                  <p className="text-xs typewriter-text text-[#6B4423] font-black mb-1">{suspect.name.toUpperCase()}:</p>
                  <div className="flex items-center gap-2 typewriter-text text-[#1A1A1A]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t-4 border-[#1A1A1A] bg-[#6B4423] wood-texture">
          {error && (
            <div className="mb-4 p-3 bg-[#C41E3A] border-2 border-[#1A1A1A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F4E8D0] flex-shrink-0" />
              <p className="text-sm typewriter-text text-[#F4E8D0] font-bold">{error}</p>
            </div>
          )}

          {questionsRemaining <= 3 && questionsRemaining > 0 && (
            <div className="mb-4 p-3 bg-[#FFD700] border-2 border-[#1A1A1A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#1A1A1A] flex-shrink-0" />
              <p className="text-sm typewriter-text text-[#1A1A1A] font-bold">
                WARNING: Only {questionsRemaining} question{questionsRemaining === 1 ? '' : 's'} remaining!
              </p>
            </div>
          )}

          {questionsRemaining === 0 ? (
            <div className="p-4 bg-[#C41E3A] border-2 border-[#1A1A1A] text-center">
              <p className="typewriter-text text-[#F4E8D0] font-black">NO QUESTIONS REMAINING</p>
              <p className="text-sm typewriter-text text-[#F4E8D0] mt-1">Close this window and make your accusation</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                disabled={loading}
                className="flex-1 paper-texture border-2 border-[#1A1A1A] typewriter-text text-[#1A1A1A] placeholder:text-[#6B4423]"
              />
              <Button
                onClick={handleSendQuestion}
                disabled={loading || !question.trim()}
                className="bg-[#2D5016] hover:bg-[#4A7C2C] text-[#F4E8D0] font-black stamp-text border-2 border-[#1A1A1A]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    SEND
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
