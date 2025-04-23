
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/lib/types';

interface RankingsTableProps {
  players: Array<Player & {
    matchWinPercentage: number;
    gameWinPercentage: number;
  }>;
  sortBy: string;
}

export const RankingsTable = ({ players, sortBy }: RankingsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Rankings</CardTitle>
        <CardDescription>
          Players ranked by {
            sortBy === 'ranking' ? 'overall performance' :
            sortBy === 'wins' ? 'total wins' :
            sortBy === 'losses' ? 'least losses' : 'win rate'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Matches</TableHead>
              <TableHead className="text-right">Match Win %</TableHead>
              <TableHead className="text-right">Game Win %</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player, index) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  {index === 0 ? (
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>1</span>
                    </div>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{player.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {player.wins}-{player.losses}-{player.draws}
                </TableCell>
                <TableCell className="text-right">
                  {player.matchWinPercentage.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  {player.gameWinPercentage.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right font-medium">
                  {player.wins * 3 + player.draws}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
