
import { Match, Player } from '@/lib/types';
import { MatchCard } from '../MatchCard';

interface MatchListProps {
  matches: Match[];
  getPlayerById: (id: string) => Player;
  getDraftRecord: (playerId: string) => { wins: number; losses: number; draws: number };
  roundResults: Record<string, { player1Score: number; player2Score: number }>;
  isMatchEditable: (matchId: string) => boolean;
  onScoreChange: (matchId: string, player: 'player1Score' | 'player2Score', value: number) => void;
}

export const MatchList = ({
  matches,
  getPlayerById,
  getDraftRecord,
  roundResults,
  isMatchEditable,
  onScoreChange
}: MatchListProps) => {
  return (
    <div className="space-y-4">
      {matches.map(match => {
        const player1 = getPlayerById(match.player1);
        const player2 = getPlayerById(match.player2);
        const player1Record = getDraftRecord(match.player1);
        const player2Record = getDraftRecord(match.player2);
        
        // Default to match scores if no round results are available
        const defaultScores = { 
          player1Score: match.player1Score, 
          player2Score: match.player2Score 
        };
        
        // Ensure we have valid scores in the roundResults
        const roundResult = roundResults[match.id];
        const currentScores = roundResult ? {
          player1Score: Number(roundResult.player1Score || 0),
          player2Score: Number(roundResult.player2Score || 0)
        } : defaultScores;
        
        return (
          <MatchCard
            key={match.id}
            match={match}
            player1={player1}
            player2={player2}
            player1Record={player1Record}
            player2Record={player2Record}
            currentScores={currentScores}
            isEditable={isMatchEditable(match.id)}
            onScoreChange={(player, value) => onScoreChange(match.id, player, value)}
          />
        );
      })}
    </div>
  );
};
