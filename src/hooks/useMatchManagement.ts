
import { useState, useEffect } from 'react';
import { Match, MatchResult } from '@/lib/types';
import { mockMatches, generateId } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/contexts/constants';
import { toast } from '@/components/ui/use-toast';

export const useMatchManagement = () => {
  const [matches, setMatches] = useState<Match[]>(() => {
    const storedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return storedMatches ? JSON.parse(storedMatches) : mockMatches;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  const createMatch = (matchData: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => {
    const match: Match = {
      id: generateId(),
      ...matchData,
      player1Score: 0,
      player2Score: 0,
      result: 'pending',
      createdAt: new Date()
    };
    
    setMatches([...matches, match]);
    return match;
  };

  const updateMatchesResults = (matchResults: { 
    id: string; 
    player1Score: number; 
    player2Score: number;
  }[]) => {
    console.log("useMatchManagement: Updating match results:", matchResults);
    
    const updatedMatches = matches.map(match => {
      const result = matchResults.find(r => r.id === match.id);
      if (!result) return match;

      // Calculate the match result based on scores
      let matchResult: MatchResult = 'pending';
      if (result.player1Score > result.player2Score) {
        matchResult = 'player1Win';
      } else if (result.player2Score > result.player1Score) {
        matchResult = 'player2Win';
      } else if (result.player1Score === result.player2Score && (result.player1Score > 0 || result.player2Score > 0)) {
        matchResult = 'draw';
      }

      console.log(`Match ${match.id} result: ${matchResult} (${result.player1Score}-${result.player2Score})`);
      
      return {
        ...match,
        player1Score: result.player1Score,
        player2Score: result.player2Score,
        result: matchResult,
        completedAt: matchResult !== 'pending' ? new Date() : undefined
      };
    });

    console.log("Updated matches:", updatedMatches);
    setMatches(updatedMatches);
    
    // Return only the matches that were updated
    return updatedMatches.filter(match => 
      matchResults.some(result => result.id === match.id)
    );
  };

  return {
    matches,
    setMatches,
    createMatch,
    updateMatchesResults
  };
};
