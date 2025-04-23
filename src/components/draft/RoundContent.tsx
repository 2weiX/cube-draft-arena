
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Match, Player } from '@/lib/types';
import { MatchList } from './match/MatchList';
import { RoundHeader } from './round/RoundHeader';

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
  // Check if any scores have been entered
  const hasEnteredScores = Object.values(roundResults).length > 0;

  // Check if the "Submit Round Results" button should be enabled
  const canSubmit = !completed && (canCompleteRound || hasEnteredScores);

  return (
    <Card>
      <CardHeader>
        <RoundHeader
          roundNumber={roundNumber}
          completed={completed}
          canSubmit={canSubmit}
          onSubmitRound={onSubmitRound}
        />
      </CardHeader>
      <CardContent>
        <MatchList
          matches={matches}
          getPlayerById={getPlayerById}
          getDraftRecord={getDraftRecord}
          roundResults={roundResults}
          isMatchEditable={isMatchEditable}
          onScoreChange={onScoreChange}
        />
        
        {canSubmit && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onSubmitRound}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={!hasEnteredScores && !canCompleteRound}
            >
              Submit Round Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
