
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Match, Player } from '@/lib/types';
import { MatchCard } from './MatchCard';

interface RoundContentProps {
  roundNumber: number;
  matches: Match[];
  completed: boolean;
  getPlayerById: (id: string) => Player;
  getDraftRecord: (playerId: string) => { wins: number; losses: number; draws: number };
  roundResults: Record<string, { player1Score: number; player2Score: number }>;
  isMatchEditable: (matchId: string) => boolean;
  canCompleteRound: boolean;
  onScoreChange: (matchId: string, player: 'player1Score' | 'player2Score', value: number) => void;
  onSubmitRound: () => void;
}

export const RoundContent = ({
  roundNumber,
  matches,
  completed,
  getPlayerById,
  getDraftRecord,
  roundResults,
  isMatchEditable,
  canCompleteRound,
  onScoreChange,
  onSubmitRound
}: RoundContentProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Round {roundNumber} Pairings</CardTitle>
            <CardDescription>
              {completed ? 'Completed' : 'In Progress'}
            </CardDescription>
          </div>
          
          {!completed && canCompleteRound && (
            <Button 
              onClick={onSubmitRound}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Submit Round Results
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
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
        
        {!completed && canCompleteRound && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onSubmitRound}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Submit Round Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
