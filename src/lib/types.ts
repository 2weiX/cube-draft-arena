
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
