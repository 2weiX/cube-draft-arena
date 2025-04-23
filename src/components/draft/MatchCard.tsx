
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Match, Player } from '@/lib/types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  player1: Player;
  player2: Player;
  player1Record: { wins: number; losses: number; draws: number };
  player2Record: { wins: number; losses: number; draws: number };
  currentScores: { player1Score: number; player2Score: number };
  isEditable: boolean;
  onScoreChange: (player: 'player1Score' | 'player2Score', value: number) => void;
}

export const MatchCard = ({
  match,
  player1,
  player2,
  player1Record,
  player2Record,
  currentScores,
  isEditable,
  onScoreChange
}: MatchCardProps) => {
  const matchResult = match.result;
  
  // Ensure we have valid scores
  const player1Score = Number(currentScores.player1Score) || 0;
  const player2Score = Number(currentScores.player2Score) || 0;

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="mb-1">
              <p className="font-medium">{player1.name}</p>
              <p className="text-sm text-muted-foreground">
                {player1Record.wins}-{player1Record.losses}-{player1Record.draws}
              </p>
            </div>
            {isEditable ? (
              <div className="flex gap-2 justify-center mt-2">
                {[2, 1, 0].map((score) => (
                  <Button
                    key={score}
                    variant={player1Score === score ? "default" : "outline"}
                    size="sm"
                    onClick={() => onScoreChange('player1Score', score)}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-2xl font-bold mt-2">{player1Score}</p>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {matchResult === 'pending' ? (
              <p className="text-muted-foreground">vs</p>
            ) : matchResult === 'player1Win' ? (
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-green-500 font-medium">Winner</p>
                <ArrowDown className="h-4 w-4 text-red-500 ml-4 mr-1" />
              </div>
            ) : matchResult === 'player2Win' ? (
              <div className="flex items-center">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <ArrowUp className="h-4 w-4 text-green-500 ml-4 mr-1" />
                <p className="text-green-500 font-medium">Winner</p>
              </div>
            ) : (
              <div className="py-1 px-3 bg-gray-100 rounded text-sm">
                Draw
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="mb-1">
              <p className="font-medium">{player2.name}</p>
              <p className="text-sm text-muted-foreground">
                {player2Record.wins}-{player2Record.losses}-{player2Record.draws}
              </p>
            </div>
            {isEditable ? (
              <div className="flex gap-2 justify-center mt-2">
                {[2, 1, 0].map((score) => (
                  <Button
                    key={score}
                    variant={player2Score === score ? "default" : "outline"}
                    size="sm"
                    onClick={() => onScoreChange('player2Score', score)}
                  >
                    {score}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-2xl font-bold mt-2">{player2Score}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
