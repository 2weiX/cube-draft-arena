
import { Star, TrendingUp, TrendingDown, GamepadIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Player } from '@/lib/types';

interface StatsCardsProps {
  players: Player[];
  playersWithStats: Array<Player & { matchWinPercentage: number }>;
  totalMatches: number;
}

export const StatsCards = ({ players, playersWithStats, totalMatches }: StatsCardsProps) => {
  const averageWinRate = players.length > 0
    ? (playersWithStats.reduce((sum, p) => sum + p.matchWinPercentage, 0) / players.length).toFixed(1)
    : '0';

  // Calculate total games
  const totalGames = players.reduce((sum, player) => {
    const gamesWon = player.wins * 2; // Assuming 2-0 for wins
    const gamesLost = player.losses * 2; // Assuming 0-2 for losses
    const gamesTied = player.draws * 1; // Assuming 1-1 for draws
    return sum + gamesWon + gamesLost + gamesTied;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{players.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMatches}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          <GamepadIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGames}</div>
          <div className="text-sm text-muted-foreground mt-1">
            W: {players.reduce((sum, p) => sum + p.wins * 2, 0)} 
            L: {players.reduce((sum, p) => sum + p.losses * 2, 0)} 
            T: {players.reduce((sum, p) => sum + p.draws, 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageWinRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
};

