
import { Player } from '@/lib/types';
import { useMatchContext } from '@/contexts/AppContext';

export const useDraftStandings = (draftId: string | undefined) => {
  const { matches } = useMatchContext();

  const getDraftRecord = (playerId: string) => {
    const draftMatches = matches.filter(m => 
      m.draftId === draftId && 
      (m.player1 === playerId || m.player2 === playerId) &&
      m.result !== 'pending'
    );
    
    let wins = 0, losses = 0, draws = 0;
    
    draftMatches.forEach(match => {
      if (match.result === 'player1Win' && match.player1 === playerId) wins++;
      else if (match.result === 'player2Win' && match.player2 === playerId) wins++;
      else if (match.result === 'player1Win' && match.player2 === playerId) losses++;
      else if (match.result === 'player2Win' && match.player1 === playerId) losses++;
      else if (match.result === 'draw') draws++;
    });
    
    return { wins, losses, draws };
  };

  const calculateStandings = (players: Player[]) => {
    const standings = players.map(player => {
      const record = getDraftRecord(player.id);
      
      return {
        ...player,
        draftWins: record.wins,
        draftLosses: record.losses,
        draftDraws: record.draws,
        points: (record.wins * 3) + record.draws
      };
    });
    
    return standings.sort((a, b) => b.points - a.points);
  };

  return {
    getDraftRecord,
    calculateStandings
  };
};
