
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Player } from '@/lib/types';

interface StandingPlayer extends Player {
  draftWins: number;
  draftLosses: number;
  draftDraws: number;
  points: number;
}

interface DraftStandingsProps {
  standings: StandingPlayer[];
}

export const DraftStandings = ({ standings }: DraftStandingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Draft Standings</CardTitle>
        <CardDescription>
          Player rankings for this draft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium">Rank</th>
                <th className="text-left py-2 px-4 font-medium">Player</th>
                <th className="text-center py-2 px-4 font-medium">Wins</th>
                <th className="text-center py-2 px-4 font-medium">Losses</th>
                <th className="text-center py-2 px-4 font-medium">Draws</th>
                <th className="text-center py-2 px-4 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((player, index) => (
                <tr key={player.id} className={index === 0 ? 'bg-accent/30' : ''}>
                  <td className="py-2 px-4">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{index + 1}</span>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium">{player.name}</td>
                  <td className="text-center py-2 px-4">{player.draftWins}</td>
                  <td className="text-center py-2 px-4">{player.draftLosses}</td>
                  <td className="text-center py-2 px-4">{player.draftDraws}</td>
                  <td className="text-center py-2 px-4 font-bold">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
