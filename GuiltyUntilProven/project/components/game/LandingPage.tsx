'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Card } from '@/components/ui/card';
import { Search, Users, Brain, Trophy } from 'lucide-react';

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen wood-texture film-grain relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423]/40 to-[#4A3728]/80"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 p-6 paper-texture paper-shadow transform -rotate-1">
              <h1 className="text-5xl md:text-6xl font-bold typewriter-text text-[#1A1A1A] mb-2">
                AI DETECTIVE
              </h1>
              <div className="h-1 w-full bg-[#1A1A1A] mb-2"></div>
              <div className="h-0.5 w-full bg-[#1A1A1A]"></div>
            </div>

            <div className="paper-texture paper-shadow p-6 mb-8 max-w-3xl mx-auto transform rotate-1">
              <p className="text-lg md:text-xl typewriter-text text-[#2D2D2D]">
                CLASSIFIED CASE FILE:<br />
                Interrogate AI-powered suspects. Find the impostor. Solve the mystery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="paper-texture paper-shadow p-6 transform hover:-rotate-1 transition-transform">
                <div className="w-12 h-12 mx-auto bg-[#C41E3A] rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Search className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h3 className="font-bold typewriter-text text-[#1A1A1A] mb-2">INVESTIGATE</h3>
                <p className="text-sm typewriter-text text-[#2D2D2D]">
                  Question suspects to uncover the truth
                </p>
              </div>

              <div className="paper-texture paper-shadow p-6 transform hover:rotate-1 transition-transform">
                <div className="w-12 h-12 mx-auto bg-[#6B4423] rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Users className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h3 className="font-bold typewriter-text text-[#1A1A1A] mb-2">5 SUSPECTS</h3>
                <p className="text-sm typewriter-text text-[#2D2D2D]">
                  Each with unique personalities and alibis
                </p>
              </div>

              <div className="paper-texture paper-shadow p-6 transform hover:-rotate-1 transition-transform">
                <div className="w-12 h-12 mx-auto bg-[#4169E1] rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Brain className="w-6 h-6 text-[#F4E8D0]" />
                </div>
                <h3 className="font-bold typewriter-text text-[#1A1A1A] mb-2">AI-POWERED</h3>
                <p className="text-sm typewriter-text text-[#2D2D2D]">
                  Real conversations with intelligent responses
                </p>
              </div>

              <div className="paper-texture paper-shadow p-6 transform hover:rotate-1 transition-transform">
                <div className="w-12 h-12 mx-auto bg-[#FFD700] rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Trophy className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <h3 className="font-bold typewriter-text text-[#1A1A1A] mb-2">COMPETE</h3>
                <p className="text-sm typewriter-text text-[#2D2D2D]">
                  Climb the leaderboard and prove yourself
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="p-8 paper-texture paper-shadow border-4 border-[#6B4423]">
              <div className="mb-6">
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setShowLogin(true)}
                    className={`flex-1 py-2 px-4 font-bold typewriter-text transition-all ${
                      showLogin
                        ? 'bg-[#C41E3A] text-[#F4E8D0] shadow-lg'
                        : 'bg-[#E8DCC8] text-[#2D2D2D] hover:bg-[#F4E8D0]'
                    }`}
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={() => setShowLogin(false)}
                    className={`flex-1 py-2 px-4 font-bold typewriter-text transition-all ${
                      !showLogin
                        ? 'bg-[#C41E3A] text-[#F4E8D0] shadow-lg'
                        : 'bg-[#E8DCC8] text-[#2D2D2D] hover:bg-[#F4E8D0]'
                    }`}
                  >
                    SIGN UP
                  </button>
                </div>
              </div>

              {showLogin ? (
                <LoginForm
                  onSwitchToSignup={() => setShowLogin(false)}
                />
              ) : (
                <SignupForm
                  onSwitchToLogin={() => setShowLogin(true)}
                />
              )}
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block paper-texture paper-shadow p-6 border-4 border-[#C41E3A] relative">
              <div className="absolute top-2 right-2 stamp-text text-[#C41E3A] text-xs opacity-60 transform rotate-12">
                CLASSIFIED
              </div>
              <div className="coffee-stain" style={{ top: '-10px', right: '20px' }}></div>
              <p className="typewriter-text text-[#1A1A1A] text-sm leading-relaxed">
                <span className="font-bold">THE CRIME:</span><br />
                A serious crime has occurred on the space station.<br />
                One of the crew is lying. Can you find out who?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
