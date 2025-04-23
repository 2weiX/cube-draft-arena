
import React from 'react';
import { PlayerProvider, usePlayerContext } from './PlayerContext';
import { DraftProvider, useDraftContext } from './DraftContext';
import { MatchProvider, useMatchContext } from './MatchContext';

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
export { usePlayerContext, useDraftContext, useMatchContext };

// Create a combined hook for backwards compatibility
export const useAppContext = () => {
  const playerContext = usePlayerContext();
  const draftContext = useDraftContext();
  const matchContext = useMatchContext();

  return {
    ...playerContext,
    ...draftContext,
    ...matchContext
  };
};
