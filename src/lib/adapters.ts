
import { Match, Player } from './types';

/**
 * Converts snake_case database objects to camelCase application models
 */

export const dbToPlayerModel = (dbPlayer: any): Player => ({
  id: dbPlayer.id,
  name: dbPlayer.name,
  avatar: dbPlayer.avatar,
  wins: dbPlayer.wins,
  losses: dbPlayer.losses,
  draws: dbPlayer.draws,
  ranking: dbPlayer.ranking,
  createdAt: new Date(dbPlayer.created_at)
});

export const dbToMatchModel = (dbMatch: any): Match => ({
  id: dbMatch.id,
  round: dbMatch.round,
  draftId: dbMatch.draft_id,
  player1: dbMatch.player1,
  player2: dbMatch.player2,
  player1Score: dbMatch.player1_score,
  player2Score: dbMatch.player2_score,
  result: dbMatch.result,
  createdAt: new Date(dbMatch.created_at),
  completedAt: dbMatch.completed_at ? new Date(dbMatch.completed_at) : undefined
});

/**
 * Converts camelCase application models to snake_case database objects
 */

export const playerToDbModel = (player: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => ({
  name: player.name,
  avatar: player.avatar
});

export const matchToDbModel = (match: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => ({
  round: match.round,
  draft_id: match.draftId,
  player1: match.player1,
  player2: match.player2,
  player1_score: match.player1Score,
  player2_score: match.player2Score,
  result: 'pending',
  round_id: match.roundId || '00000000-0000-0000-0000-000000000000' // Default UUID if not provided
});
