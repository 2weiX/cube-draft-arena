
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

  return {
    matches,
    setMatches,
    createMatch
  };
};
