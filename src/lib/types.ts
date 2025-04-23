
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

export interface Draft {
  id: string;
  name: string;
  description?: string;
  players: string[]; // Player IDs
  status: DraftStatus;
  rounds: Round[];
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
