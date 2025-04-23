
// Player types
export interface Player {
  id: string;
  name: string;
  avatar?: string;
  wins: number;
  losses: number;
  draws: number;
  ranking: number;
  createdAt: Date;
}

// Draft types
export type DraftStatus = "pending" | "active" | "completed";

export interface PlayerStats {
  matchWinPercentage: number;
  gameWinPercentage: number;
  points: number;
}

export interface Draft {
  id: string;
  name: string;
  description?: string;
  cubeName?: string;  // Already optional, but ensuring it's clear
  players: string[]; 
  seating: string[];
  status: DraftStatus;
  rounds: Round[];
  totalRounds: 3 | 4;
  currentRound: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Round {
  number: number;
  matches: Match[];
  completed: boolean;
}

// Match types
export type MatchResult = "player1Win" | "player2Win" | "draw" | "pending";

export interface Match {
  id: string;
  round: number;
  draftId: string;
  player1: string; // Player ID
  player2: string; // Player ID
  player1Score: number;
  player2Score: number;
  result: MatchResult;
  createdAt: Date;
  completedAt?: Date;
}

// Context type
export interface AppContextType {
  players: Player[];
  drafts: Draft[];
  matches: Match[];
  
  // Player functions
  addPlayer: (player: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => Player | null;
  deletePlayer: (id: string) => boolean;
  
  // Draft functions
  createDraft: (draft: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt' | 'seating'>) => Draft;
  startDraft: (id: string) => Draft | null;
  completeRound: (draftId: string, roundNumber: number) => Draft | null;
  deleteDraft: (id: string) => void;
  
  // Match functions
  createMatch: (match: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => Match;
  updateMatchResult: (id: string, player1Score: number, player2Score: number) => Match | null;

  // Pairing functions
  createPairings: (draftId: string, players: string[], roundNumber?: number) => Match[];
  
  // Current draft
  currentDraft: Draft | null;
  setCurrentDraft: (draft: Draft | null) => void;
  updateMatchesResults: (matchResults: { id: string; player1Score: number; player2Score: number; }[]) => Match[];
}
