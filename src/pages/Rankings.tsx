import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TopPlayerCard } from '@/components/rankings/TopPlayerCard';
import { StatsCards } from '@/components/rankings/StatsCards';
import { RankingsTable } from '@/components/rankings/RankingsTable';

type SortField = 'ranking' | 'wins' | 'losses' | 'winRate';

const Rankings = () => {
  const { players, matches } = useAppContext();
  const [sortBy, setSortBy] = useState<SortField>('ranking');

  // Calculate player stats including lifetime records
  const playersWithStats = players.map(player => {
    const totalMatches = player.wins + player.losses + player.draws;
    const totalGames = matches
      .filter(m => (m.player1 === player.id || m.player2 === player.id) && m.result !== 'pending')
      .reduce((total, match) => {
        const playerScore = match.player1 === player.id ? match.player1Score : match.player2Score;
        const opponentScore = match.player1 === player.id ? match.player2Score : match.player1Score;
        return total + playerScore + opponentScore;
      }, 0);
    
    const gameWins = matches
      .filter(m => (m.player1 === player.id || m.player2 === player.id) && m.result !== 'pending')
      .reduce((wins, match) => {
        const playerScore = match.player1 === player.id ? match.player1Score : match.player2Score;
        return wins + playerScore;
      }, 0);
    
    const matchWinPercentage = totalMatches > 0 ? (player.wins / totalMatches) * 100 : 0;
    const gameWinPercentage = totalGames > 0 ? (gameWins / totalGames) * 100 : 0;
    
    return {
      ...player,
      matchWinPercentage,
      gameWinPercentage,
      totalMatches,
      totalGames,
      gameWins
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
        return b.matchWinPercentage - a.matchWinPercentage;
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

      {topPlayer && <TopPlayerCard player={topPlayer} />}
      
      <StatsCards 
        players={players} 
        playersWithStats={playersWithStats}
        totalMatches={totalMatches}
      />
      
      <RankingsTable players={sortedPlayers} sortBy={sortBy} />
    </div>
  );
};

export default Rankings;
