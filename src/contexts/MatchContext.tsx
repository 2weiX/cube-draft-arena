
import React, { createContext, useContext } from 'react';
import { useMatchManagement } from '@/hooks/useMatchManagement';
import { Match } from '@/lib/types';

interface MatchContextType {
  matches: Match[];
  createMatch: (match: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => Match;
  updateMatchesResults: (matchResults: { id: string; player1Score: number; player2Score: number; }[]) => Match[];
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { matches, createMatch, updateMatchesResults } = useMatchManagement();

  return (
    <MatchContext.Provider value={{
      matches,
      createMatch,
      updateMatchesResults
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatchContext must be used within a MatchProvider');
  }
  return context;
};
