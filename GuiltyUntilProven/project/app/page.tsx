'use client';

import { useEffect, useState } from 'react';
import { useGameStore, GamePhase } from '@/lib/stores/game-store';
import { supabase } from '@/lib/supabase/client';
import { saveGameStats } from '@/lib/supabase/api';
import { LandingPage } from '@/components/game/LandingPage';
import { MainMenu } from '@/components/game/MainMenu';
import { BriefingScreen } from '@/components/game/BriefingScreen';
import { InvestigationScreen } from '@/components/game/InvestigationScreen';
import { WinScreen } from '@/components/game/WinScreen';
import { LoseScreen } from '@/components/game/LoseScreen';
import { LeaderboardScreen } from '@/components/game/LeaderboardScreen';
import { ProfileScreen } from '@/components/game/ProfileScreen';

type Screen = 'landing' | 'menu' | 'leaderboard' | 'profile' | 'game';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState<any>(null);

  const phase = useGameStore((state) => state.phase);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setScreen('menu');
      }
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          setUser(session.user);
          setScreen('menu');
        } else {
          setUser(null);
          setScreen('landing');
        }
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (phase === 'menu') {
      setScreen('menu');
    } else if (phase === 'briefing' || phase === 'playing') {
      setScreen('game');
    }
  }, [phase]);

  const handleGameEnd = async (stats: any) => {
    setGameStats(stats);

    const result = await saveGameStats(user?.id || null, stats);

    if (!result.success && result.error) {
      console.error('Error saving game stats:', result.error);

      if (result.error.includes('not authenticated')) {
        console.log('User not logged in - stats not saved to leaderboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && screen === 'landing') {
    return <LandingPage />;
  }

  if (screen === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen('menu')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen onBack={() => setScreen('menu')} />;
  }

  if (screen === 'menu') {
    return (
      <MainMenu
        onShowLeaderboard={() => setScreen('leaderboard')}
        onShowProfile={() => setScreen('profile')}
      />
    );
  }

  if (screen === 'game') {
    if (phase === 'menu') {
      return (
        <MainMenu
          onShowLeaderboard={() => setScreen('leaderboard')}
          onShowProfile={() => setScreen('profile')}
        />
      );
    }

    if (phase === 'briefing') {
      return <BriefingScreen />;
    }

    if (phase === 'playing') {
      return <InvestigationScreen onGameEnd={handleGameEnd} />;
    }

    if (phase === 'won' && gameStats) {
      return <WinScreen stats={gameStats} />;
    }

    if (phase === 'lost' && gameStats) {
      return <LoseScreen stats={gameStats} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <p className="text-slate-400">Loading game...</p>
    </div>
  );
}