
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

  /**
   * Determines if two players have already played against each other
   */
  const havePlayedAgainst = useCallback((player1Id: string, player2Id: string, matches: Match[]): boolean => {
    return matches.some(match => 
      (match.player1 === player1Id && match.player2 === player2Id) ||
      (match.player1 === player2Id && match.player2 === player1Id)
    );
  }, []);
  
  /**
   * Creates optimal pairings based on standings with restrictions
   */
  const generatePairings = useCallback((draftId: string, playerIds: string[], matches: Match[], currentRound: number): {
    player1: string;
    player2: string;
  }[] => {
    // Clone the array to avoid modifying the original
    const availablePlayers = [...playerIds];
    const draftMatches = matches.filter(m => m.draftId === draftId);
    const pairings: { player1: string; player2: string }[] = [];
    
    // Sort players by their performance in this draft
    availablePlayers.sort((a, b) => {
      const statsA = calculatePlayerStats(a, draftMatches);
      const statsB = calculatePlayerStats(b, draftMatches);
      
      if (statsB.points !== statsA.points) {
        return statsB.points - statsA.points;
      }
      if (statsB.matchWinPercentage !== statsA.matchWinPercentage) {
        return statsB.matchWinPercentage - statsA.matchWinPercentage;
      }
      return statsB.gameWinPercentage - statsA.gameWinPercentage;
    });
    
    // Create pairings
    while (availablePlayers.length > 0) {
      const player1 = availablePlayers.shift()!;
      let bestOpponentIndex = -1;
      
      // Find the highest-ranked player who hasn't played against player1 yet
      for (let i = 0; i < availablePlayers.length; i++) {
        if (!havePlayedAgainst(player1, availablePlayers[i], draftMatches)) {
          bestOpponentIndex = i;
          break;
        }
      }
      
      // If all available players have played against player1, pick the highest-ranked one
      if (bestOpponentIndex === -1) {
        bestOpponentIndex = 0;
        console.log(`Warning: Player ${player1} has already played against all remaining players. Pairing with highest ranked available player.`);
      }
      
      const player2 = availablePlayers.splice(bestOpponentIndex, 1)[0];
      pairings.push({ player1, player2 });
    }
    
    return pairings;
  }, [calculatePlayerStats, havePlayedAgainst]);

  return {
    calculatePlayerStats,
    updateRankings,
    havePlayedAgainst,
    generatePairings
  };
};
