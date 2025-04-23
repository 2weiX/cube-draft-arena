
import React, { createContext, useContext } from 'react';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { Player } from '@/lib/types';

interface PlayerContextType {
  players: Player[];
  addPlayer: (player: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => Player | null;
  deletePlayer: (id: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayerManagement();

  return (
    <PlayerContext.Provider value={{
      players,
      addPlayer,
      updatePlayer,
      deletePlayer
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};
