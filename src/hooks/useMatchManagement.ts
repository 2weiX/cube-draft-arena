
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
  }[]): Match[] => {
    console.log("useMatchManagement: Updating match results:", matchResults);
    
    // Return early if no match results provided
    if (!matchResults.length) {
      console.warn("No match results provided to update");
      return [];
    }
    
    // Sanitize and validate input scores
    const sanitizedResults = matchResults.map(result => ({
      id: result.id,
      player1Score: typeof result.player1Score === 'number' ? result.player1Score : 0,
      player2Score: typeof result.player2Score === 'number' ? result.player2Score : 0
    }));
    
    console.log("Sanitized match results:", sanitizedResults);
    
    // Create a copy of matches to work with
    const updatedMatches = [...matches];
    const changedMatches: Match[] = [];
    
    // Update each match in the copy
    sanitizedResults.forEach(result => {
      const index = updatedMatches.findIndex(m => m.id === result.id);
      if (index === -1) return;
      
      const match = updatedMatches[index];
      
      // Calculate the match result based on scores
      let matchResult: MatchResult = 'pending';
      if (result.player1Score > result.player2Score) {
        matchResult = 'player1Win';
      } else if (result.player2Score > result.player1Score) {
        matchResult = 'player2Win';
      } else if (result.player1Score === result.player2Score && (result.player1Score > 0 || result.player2Score > 0)) {
        matchResult = 'draw';
      }
      
      console.log(`Match ${match.id} result: ${matchResult} (${result.player1Score}-${result.player2Score}) between players ${match.player1} and ${match.player2}`);
      
      const updatedMatch = {
        ...match,
        player1Score: result.player1Score,
        player2Score: result.player2Score,
        result: matchResult,
        completedAt: matchResult !== 'pending' ? new Date() : undefined
      };
      
      // Update the match in our copy
      updatedMatches[index] = updatedMatch;
      changedMatches.push(updatedMatch);
    });
    
    console.log("Updated matches:", changedMatches);
    
    // Only update state if we actually changed something
    if (changedMatches.length > 0) {
      setMatches(updatedMatches);
    } else {
      console.warn("No matches were changed");
    }
    
    // Return only the matches that were updated
    return changedMatches;
  };

  return {
    matches,
    setMatches,
    createMatch,
    updateMatchesResults
  };
};
