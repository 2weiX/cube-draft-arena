
import { useState, useEffect } from 'react';
import { Player } from '@/lib/types';
import { mockPlayers, generateId } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/contexts/constants';
import { toast } from '@/components/ui/use-toast';

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return storedPlayers ? JSON.parse(storedPlayers) : mockPlayers;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  const addPlayer = (newPlayer: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => {
    // Check if player name already exists (case insensitive)
    const playerExists = players.some(
      p => p.name.toLowerCase() === newPlayer.name.toLowerCase()
    );

    if (playerExists) {
      toast({
        title: "Error",
        description: "A player with this name already exists.",
        variant: "destructive"
      });
      return null;
    }

    const player: Player = {
      id: generateId(),
      ...newPlayer,
      wins: 0,
      losses: 0,
      draws: 0,
      ranking: players.length + 1,
      createdAt: new Date()
    };
    
    setPlayers([...players, player]);
    toast({
      title: "Player added",
      description: `${player.name} has been added to the player pool.`
    });
    return player;
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedPlayer = { ...players[index], ...updates };
    const updatedPlayers = [...players];
    updatedPlayers[index] = updatedPlayer;
    
    setPlayers(updatedPlayers);
    return updatedPlayer;
  };

  const deletePlayer = (id: string) => {
    const playerExists = players.some(p => p.id === id);
    if (!playerExists) return false;
    
    setPlayers(players.filter(p => p.id !== id));
    toast({
      title: "Player removed",
      description: "The player has been removed from the player pool."
    });
    return true;
  };

  return {
    players,
    setPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer
  };
};
