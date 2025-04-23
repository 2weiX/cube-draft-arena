
import { useCallback } from 'react';
import { Match, Player } from '@/lib/types';

export const useRankingsManagement = () => {
  const calculatePlayerStats = useCallback((playerId: string, draftMatches: Match[]): { 
    matchWinPercentage: number;
    gameWinPercentage: number;
    points: number;
  } => {
    const playerMatches = draftMatches.filter(m => 
      (m.player1 === playerId || m.player2 === playerId) && m.result !== 'pending'
    );
    
    let matchWins = 0;
    let matchLosses = 0;
    let matchDraws = 0;
    let gameWins = 0;
    let gameLosses = 0;
    
    playerMatches.forEach(match => {
      const isPlayer1 = match.player1 === playerId;
      const playerScore = isPlayer1 ? match.player1Score : match.player2Score;
      const opponentScore = isPlayer1 ? match.player2Score : match.player1Score;
      
      gameWins += playerScore;
      gameLosses += opponentScore;
      
      if (match.result === 'draw') {
        matchDraws++;
      } else if (
        (isPlayer1 && match.result === 'player1Win') ||
        (!isPlayer1 && match.result === 'player2Win')
      ) {
        matchWins++;
      } else {
        matchLosses++;
      }
    });
    
    const totalMatches = matchWins + matchLosses + matchDraws;
    const totalGames = gameWins + gameLosses;
    
    return {
      matchWinPercentage: totalMatches > 0 ? (matchWins / totalMatches) * 100 : 0,
      gameWinPercentage: totalGames > 0 ? (gameWins / totalGames) * 100 : 0,
      points: (matchWins * 3) + matchDraws
    };
  }, []);

  const updateRankings = useCallback((players: Player[], matches: Match[]) => {
    const playerStats = players.map(player => {
      const stats = calculatePlayerStats(player.id, matches);
      return {
        player,
        ...stats
      };
    });
    
    playerStats.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.matchWinPercentage !== a.matchWinPercentage) {
        return b.matchWinPercentage - a.matchWinPercentage;
      }
      return b.gameWinPercentage - a.gameWinPercentage;
    });
    
    return playerStats.map((stats, index) => ({
      ...stats.player,
      ranking: index + 1
    }));
  }, [calculatePlayerStats]);

  return {
    calculatePlayerStats,
    updateRankings
  };
};
