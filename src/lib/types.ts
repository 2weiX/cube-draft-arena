
// Player types
export interface Player {
  id: string;
  name: string;
  username?: string;
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
  cubeName?: string;
  players: string[]; // Player IDs
  seating: string[]; // Player IDs in seating order
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
