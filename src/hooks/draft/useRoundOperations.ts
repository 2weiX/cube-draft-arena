
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Draft } from '@/lib/types';

export const useRoundOperations = (draft: Draft | undefined) => {
  const [roundResults, setRoundResults] = useState<Record<string, { player1Score: number; player2Score: number }>>({});

  const handleScoreChange = (matchId: string, player: 'player1Score' | 'player2Score', value: number) => {
    setRoundResults(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId] || { player1Score: 0, player2Score: 0 },
        [player]: value
      }
    }));
  };

  const isRoundComplete = (roundNumber: number): boolean => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) return false;
    
    return round.matches.every(match => {
      const hasScoresInLocal = roundResults[match.id] !== undefined;
      return hasScoresInLocal;
    });
  };

  const canCompleteRound = (roundNumber: number): boolean => {
    if (!draft || draft.status !== 'active') return false;
    const round = draft.rounds.find(r => r.number === roundNumber);
    if (!round || round.completed) return false;
    return isRoundComplete(roundNumber);
  };

  const isMatchEditable = (matchId: string): boolean => {
    const match = draft?.rounds
      .flatMap(r => r.matches)
      .find(m => m.id === matchId);
    return !match?.result || match.result === 'pending';
  };

  return {
    roundResults,
    setRoundResults,
    handleScoreChange,
    canCompleteRound,
    isMatchEditable
  };
};
