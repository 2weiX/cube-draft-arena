
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '@/contexts/AppContext';
import { Trophy, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortField = 'ranking' | 'wins' | 'losses' | 'winRate';

const Rankings = () => {
  const { players } = useAppContext();
  const [sortBy, setSortBy] = useState<SortField>('ranking');

  // Calculate win rates and sort players
  const playersWithStats = players.map(player => {
    const totalMatches = player.wins + player.losses + player.draws;
    const winRate = totalMatches > 0 ? (player.wins / totalMatches) * 100 : 0;
    return {
      ...player,
      winRate,
      totalMatches
    };
  });

  const sortedPlayers = [...playersWithStats].sort((a, b) => {
    switch (sortBy) {
      case 'ranking':
        return a.ranking - b.ranking;
      case 'wins':
        return b.wins - a.wins;
      case 'losses':
        return a.losses - b.losses;
      case 'winRate':
        return b.winRate - a.winRate;
      default:
        return a.ranking - b.ranking;
    }
  });

  const topPlayer = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
  const totalMatches = players.reduce((sum, player) => sum + player.wins + player.losses + player.draws, 0);

  return (
    <div className="container my-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Player Rankings</h1>
          <p className="text-muted-foreground">Global rankings across all drafts</p>
        </div>
        <Select value={sortBy} onValueChange={(value: SortField) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ranking">Ranking</SelectItem>
              <SelectItem value="wins">Most Wins</SelectItem>
              <SelectItem value="losses">Least Losses</SelectItem>
              <SelectItem value="winRate">Win Rate</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {topPlayer && (
        <Card className="mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary">
                    <AvatarImage src={topPlayer.avatar} alt={topPlayer.name} />
                    <AvatarFallback className="text-2xl">{topPlayer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">{topPlayer.name}</h2>
                <p className="text-muted-foreground mb-2">
                  {topPlayer.username ? `@${topPlayer.username}` : 'Top Ranked Player'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Wins</p>
                    <p className="text-xl font-bold text-green-500">{topPlayer.wins}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Losses</p>
                    <p className="text-xl font-bold text-red-500">{topPlayer.losses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Draws</p>
                    <p className="text-xl font-bold">{topPlayer.draws}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-xl font-bold">{topPlayer.winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {players.length > 0 
                ? (playersWithStats.reduce((sum, p) => sum + p.winRate, 0) / players.length).toFixed(1) + '%'
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings</CardTitle>
          <CardDescription>Players ranked by {
            sortBy === 'ranking' ? 'overall performance' :
            sortBy === 'wins' ? 'total wins' :
            sortBy === 'losses' ? 'least losses' : 'win rate'
          }</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Draws</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player, index) => (
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
                  <TableCell className="text-right text-green-600 font-medium">{player.wins}</TableCell>
                  <TableCell className="text-right text-red-600">{player.losses}</TableCell>
                  <TableCell className="text-right">{player.draws}</TableCell>
                  <TableCell className="text-right">{player.totalMatches}</TableCell>
                  <TableCell className="text-right font-medium">{player.winRate.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rankings;
