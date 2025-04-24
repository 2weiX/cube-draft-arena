
import { useState, useEffect } from 'react';
import { Player } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { dbToPlayerModel, playerToDbModel } from '@/lib/adapters';

export const usePlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  // Fetch players on mount
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('ranking', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching players",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Convert database objects to application models
    const playerModels = data.map(dbToPlayerModel);
    setPlayers(playerModels);
  };

  const addPlayer = async (newPlayer: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('players')
      .insert([playerToDbModel(newPlayer)])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding player",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    const playerModel = dbToPlayerModel(data);
    setPlayers(prev => [...prev, playerModel]);
    
    toast({
      title: "Player added",
      description: `${data.name} has been added to the player pool.`
    });
    
    return playerModel;
  };

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    // Convert any camelCase properties to snake_case
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.avatar) dbUpdates.avatar = updates.avatar;
    
    const { data, error } = await supabase
      .from('players')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error updating player",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    const playerModel = dbToPlayerModel(data);
    setPlayers(prev => prev.map(p => p.id === id ? playerModel : p));
    
    return playerModel;
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting player",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    setPlayers(prev => prev.filter(p => p.id !== id));
    
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
