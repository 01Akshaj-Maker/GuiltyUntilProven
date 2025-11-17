import { create } from 'zustand';
import { generateScenario, CrimeScenario } from '../game/scenario-generator';

export type GamePhase = 'menu' | 'briefing' | 'playing' | 'won' | 'lost';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ConversationEntry {
  question: string;
  answer: string;
}

export interface Suspect {
  name: string;
  role: string;
  emoji: string;
  personality: string;
  alibi: string;
  actualLocation: string;
  isImpostor: boolean;
  conversationHistory: ConversationEntry[];
  linkedEvidence: string[];
}

export interface Evidence {
  id: string;
  text: string;
  discovered: boolean;
  linkedSuspects: string[];
  keywords: string[];
  // NEW: Specify which suspect must be interrogated to unlock this evidence
  unlockedBy?: string; // Name of the suspect who reveals this evidence
}

export interface GameStats {
  won: boolean;
  difficulty: Difficulty;
  questionsUsed: number;
  questionsAvailable: number;
  suspectsInterrogated: number;
  totalSuspects: number;
  evidenceDiscovered: number;
  solveTimeSeconds: number;
  impostorName: string;
  accusedName: string;
  correctAccusation: boolean;
}

interface GameStore {
  phase: GamePhase;
  difficulty: Difficulty | null;
  scenario: CrimeScenario | null;
  suspects: Suspect[];
  impostorName: string | null;
  questionsRemaining: number;
  maxQuestions: number;
  allEvidence: Evidence[];
  discoveredEvidenceIds: string[];
  currentInterrogationTarget: string | null;
  gameStartTime: number | null;
  newEvidenceMessage: string | null;

  initGame: (difficulty: Difficulty) => void;
  startInterrogation: (name: string) => void;
  endInterrogation: () => void;
  addConversation: (name: string, question: string, answer: string) => void;
  useQuestion: () => void;
  makeAccusation: (name: string) => GameStats | null;
  linkEvidence: (evidenceId: string, suspectName: string) => void;
  unlinkEvidence: (evidenceId: string, suspectName: string) => void;
  discoverEvidence: (evidenceId: string) => void;
  checkForEvidenceDiscovery: (question: string, answer: string, suspect: Suspect) => void;
  resetGame: () => void;
  goToBriefing: () => void;
  startPlaying: () => void;
}

const ALL_SUSPECTS: Omit<Suspect, 'isImpostor' | 'conversationHistory' | 'linkedEvidence'>[] = [
  {
    name: 'Alex Chen',
    role: 'Engineer',
    emoji: '👨‍🔧',
    personality: 'confident and straightforward',
    alibi: 'Engine Room',
    actualLocation: 'Engine Room',
  },
  {
    name: 'Sam Rivera',
    role: 'Pilot',
    emoji: '👨‍✈️',
    personality: 'nervous and defensive',
    alibi: 'Cockpit',
    actualLocation: 'Cockpit',
  },
  {
    name: 'Jamie Park',
    role: 'Scientist',
    emoji: '👩‍🔬',
    personality: 'analytical and precise',
    alibi: 'Research Lab',
    actualLocation: 'Research Lab',
  },
  {
    name: 'Riley Moore',
    role: 'Communications Officer',
    emoji: '👩‍💼',
    personality: 'friendly and talkative',
    alibi: 'Communications Bay',
    actualLocation: 'Communications Bay',
  },
  {
    name: 'Morgan Blake',
    role: 'Security Officer',
    emoji: '👮',
    personality: 'suspicious and interrogative',
    alibi: 'Security Office',
    actualLocation: 'Security Office',
  },
];

const ALL_EVIDENCE: Evidence[] = [
  {
    id: 'crime',
    text: 'Data drive stolen from Server Room at exactly 14:45',
    discovered: true,
    linkedSuspects: [],
    keywords: [],
  },
  {
    id: 'access',
    text: 'Server Room requires Engineer-level access credentials',
    discovered: true,
    linkedSuspects: [],
    keywords: [],
  },
  {
    id: 'cameras',
    text: 'Security cameras disabled for 2 minutes (14:43-14:45)',
    discovered: true,
    linkedSuspects: [],
    keywords: [],
  },
  {
    id: 'engineer_credentials',
    text: 'Only Alex and Sam have Engineer-level access',
    discovered: false,
    linkedSuspects: [],
    keywords: ['engineer access', 'who has access', 'credentials', 'engineer credential', 'access level', 'security clearance'],
    unlockedBy: 'Morgan Blake', // Security Officer knows about access levels
  },
  {
    id: 'alex_witness',
    text: 'Jamie confirms seeing Alex in Engine Room at 14:40',
    discovered: false,
    linkedSuspects: [],
    keywords: ['alex', 'see', 'saw', 'witness', 'engine room', 'where was alex', 'alex location'],
    unlockedBy: 'Jamie Park', // Jamie must confirm seeing Alex
  },
  {
    id: 'sam_alone',
    text: 'Sam admits being alone with no witnesses during theft',
    discovered: false,
    linkedSuspects: [],
    keywords: ['alone', 'witness', 'prove', 'no one saw', 'can you prove', 'anyone see you', 'alibi'],
    unlockedBy: 'Sam Rivera', // Sam must admit this themselves
  },
  {
    id: 'footsteps',
    text: 'Riley heard footsteps near Server Room at 14:44',
    discovered: false,
    linkedSuspects: [],
    keywords: ['heard', 'footsteps', 'server room', 'corridor', 'sound', 'noise', 'hear anything'],
    unlockedBy: 'Riley Moore', // Riley heard the footsteps
  },
  {
    id: 'jamie_working',
    text: 'Jamie was conducting experiment, lab logs confirm',
    discovered: false,
    linkedSuspects: [],
    keywords: ['experiment', 'lab', 'logs', 'confirm', 'research', 'what were you doing'],
    unlockedBy: 'Jamie Park', // Jamie discusses their work
  },
  {
    id: 'morgan_cameras',
    text: 'Morgan was monitoring cameras until offline at 14:43',
    discovered: false,
    linkedSuspects: [],
    keywords: ['cameras', 'monitoring', 'security', 'watching', 'offline', 'disabled'],
    unlockedBy: 'Morgan Blake', // Morgan discusses security monitoring
  },
  {
    id: 'riley_comms',
    text: 'Riley was on scheduled call, logs verify',
    discovered: false,
    linkedSuspects: [],
    keywords: ['call', 'communication', 'logs', 'talking', 'comm', 'scheduled'],
    unlockedBy: 'Riley Moore', // Riley discusses their communications
  },
];

const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, questions: 15 },
  medium: { suspects: 5, questions: 12 },
  hard: { suspects: 5, questions: 8 },
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  difficulty: null,
  scenario: null,
  suspects: [],
  impostorName: null,
  questionsRemaining: 0,
  maxQuestions: 0,
  allEvidence: ALL_EVIDENCE.map(e => ({ ...e, linkedSuspects: [], discovered: e.discovered })),
  discoveredEvidenceIds: ['crime', 'access', 'cameras'],
  currentInterrogationTarget: null,
  gameStartTime: null,
  newEvidenceMessage: null,

  initGame: (difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const selectedSuspects = difficulty === 'easy'
      ? ALL_SUSPECTS.slice(0, 3)
      : ALL_SUSPECTS;

    const scenario = generateScenario();
    const impostorIndex = Math.floor(Math.random() * selectedSuspects.length);

    const suspects: Suspect[] = selectedSuspects.map((s, idx) => {
      const isImpostor = idx === impostorIndex;
      return {
        ...s,
        isImpostor,
        actualLocation: isImpostor ? scenario.location.name : s.actualLocation,
        conversationHistory: [],
        linkedEvidence: [],
      };
    });

    const alibiEvidence: Evidence = {
      id: 'alibis',
      text: `SUSPECT ALIBIS (What they claim): ${suspects.map(s => `${s.name} claims: ${s.alibi}`).join('; ')}`,
      discovered: true,
      linkedSuspects: [],
      keywords: [],
    };

    const detailedEvidenceItems: Evidence[] = scenario.detailedEvidence.map((evidence, index) => ({
      id: `evidence-${index}`,
      text: evidence,
      discovered: true,
      linkedSuspects: [],
      keywords: [scenario.location.name.toLowerCase(), scenario.crimeType],
    }));

    const hiddenEvidence: Evidence[] = scenario.hiddenEvidence.map((e, index) => ({
      ...e,
      id: `hidden-${index}`,
      text: e.description,
      discovered: false,
      linkedSuspects: [],
      keywords: [scenario.location.name.toLowerCase(), scenario.crimeType],
    }));

    const initialEvidence = [alibiEvidence, ...detailedEvidenceItems, ...hiddenEvidence];

    const discoveredIds = ['alibis', ...detailedEvidenceItems.map(e => e.id)];

    set({
      phase: 'briefing',
      difficulty,
      scenario,
      suspects,
      impostorName: suspects[impostorIndex].name,
      questionsRemaining: config.questions,
      maxQuestions: config.questions,
      allEvidence: initialEvidence,
      discoveredEvidenceIds: discoveredIds,
      currentInterrogationTarget: null,
      gameStartTime: null,
      newEvidenceMessage: null,
    });
  },

  goToBriefing: () => set({ phase: 'briefing' }),

  startPlaying: () => set({ phase: 'playing', gameStartTime: Date.now() }),

  startInterrogation: (name: string) => {
    set({ currentInterrogationTarget: name });
  },

  endInterrogation: () => {
    set({ currentInterrogationTarget: null });
  },

  addConversation: (name: string, question: string, answer: string) => {
    const state = get();
    const suspects = state.suspects.map(s => {
      if (s.name === name) {
        return {
          ...s,
          conversationHistory: [...s.conversationHistory, { question, answer }],
        };
      }
      return s;
    });
    set({ suspects });
  },

  useQuestion: () => {
    const state = get();
    if (state.questionsRemaining > 0) {
      set({ questionsRemaining: state.questionsRemaining - 1 });
    }
  },

  makeAccusation: (name: string): GameStats | null => {
    const state = get();
    if (!state.impostorName || !state.gameStartTime || !state.difficulty) return null;

    const correct = name === state.impostorName;
    const solveTimeSeconds = Math.floor((Date.now() - state.gameStartTime) / 1000);
    const suspectsInterrogated = state.suspects.filter(s => s.conversationHistory.length > 0).length;

    const stats: GameStats = {
      won: correct,
      difficulty: state.difficulty,
      questionsUsed: state.maxQuestions - state.questionsRemaining,
      questionsAvailable: state.maxQuestions,
      suspectsInterrogated,
      totalSuspects: state.suspects.length,
      evidenceDiscovered: state.discoveredEvidenceIds.length,
      solveTimeSeconds,
      impostorName: state.impostorName,
      accusedName: name,
      correctAccusation: correct,
    };

    set({ phase: correct ? 'won' : 'lost' });
    return stats;
  },

  linkEvidence: (evidenceId: string, suspectName: string) => {
    const state = get();

    const allEvidence = state.allEvidence.map(e => {
      if (e.id === evidenceId && !e.linkedSuspects.includes(suspectName)) {
        return {
          ...e,
          linkedSuspects: [...e.linkedSuspects, suspectName],
        };
      }
      return e;
    });

    const suspects = state.suspects.map(s => {
      if (s.name === suspectName && !s.linkedEvidence.includes(evidenceId)) {
        return {
          ...s,
          linkedEvidence: [...s.linkedEvidence, evidenceId],
        };
      }
      return s;
    });

    set({ allEvidence, suspects });
  },

  unlinkEvidence: (evidenceId: string, suspectName: string) => {
    const state = get();

    const allEvidence = state.allEvidence.map(e => {
      if (e.id === evidenceId) {
        return {
          ...e,
          linkedSuspects: e.linkedSuspects.filter(s => s !== suspectName),
        };
      }
      return e;
    });

    const suspects = state.suspects.map(s => {
      if (s.name === suspectName) {
        return {
          ...s,
          linkedEvidence: s.linkedEvidence.filter(e => e !== evidenceId),
        };
      }
      return s;
    });

    set({ allEvidence, suspects });
  },

  discoverEvidence: (evidenceId: string) => {
    const state = get();
    if (!state.discoveredEvidenceIds.includes(evidenceId)) {
      const evidence = state.allEvidence.find(e => e.id === evidenceId);
      if (evidence) {
        set({
          discoveredEvidenceIds: [...state.discoveredEvidenceIds, evidenceId],
          newEvidenceMessage: evidence.text,
        });

        setTimeout(() => {
          set({ newEvidenceMessage: null });
        }, 5000);
      }
    }
  },

  // FIXED: Evidence discovery now checks if we're interrogating the correct suspect
  checkForEvidenceDiscovery: (question: string, answer: string, suspect: Suspect) => {
    const state = get();
    const combinedText = `${question} ${answer}`.toLowerCase();

    state.allEvidence.forEach(evidence => {
      // Skip if already discovered
      if (evidence.discovered || state.discoveredEvidenceIds.includes(evidence.id)) {
        return;
      }

      // Check if keywords match
      if (!evidence.keywords || evidence.keywords.length === 0) {
        return;
      }

      const hasKeyword = evidence.keywords.some(keyword =>
        combinedText.includes(keyword.toLowerCase())
      );

      if (!hasKeyword) {
        return;
      }

      // Check if the suspect's role matches who should unlock this evidence
      if (evidence.unlockedBy) {
        const canUnlock =
          evidence.unlockedBy === 'Any' ||
          (evidence.unlockedBy === 'Security' && (suspect.role.includes('Security') || suspect.role.includes('Officer'))) ||
          (evidence.unlockedBy === 'Engineer' && suspect.role.includes('Engineer')) ||
          (evidence.unlockedBy === 'Medical' && (suspect.role.includes('Doctor') || suspect.role.includes('Medic') || suspect.role.includes('Scientist')));

        if (canUnlock) {
          get().discoverEvidence(evidence.id);
        }
      } else {
        // Fallback for evidence without unlockedBy specified
        get().discoverEvidence(evidence.id);
      }
    });
  },

  resetGame: () => {
    set({
      phase: 'menu',
      difficulty: null,
      suspects: [],
      impostorName: null,
      questionsRemaining: 0,
      maxQuestions: 0,
      allEvidence: ALL_EVIDENCE.map(e => ({ ...e, linkedSuspects: [], discovered: e.discovered })),
      discoveredEvidenceIds: ['crime', 'access', 'cameras'],
      currentInterrogationTarget: null,
      gameStartTime: null,
      newEvidenceMessage: null,
    });
  },
}));