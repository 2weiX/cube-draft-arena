
import React from 'react';
import { PlayerProvider } from './PlayerContext';
import { DraftProvider } from './DraftContext';
import { MatchProvider } from './MatchContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PlayerProvider>
      <DraftProvider>
        <MatchProvider>
          {children}
        </MatchProvider>
      </DraftProvider>
    </PlayerProvider>
  );
};

// Re-export all context hooks for convenience
export { usePlayerContext } from './PlayerContext';
export { useDraftContext } from './DraftContext';
export { useMatchContext } from './MatchContext';
