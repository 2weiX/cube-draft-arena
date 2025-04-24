
import { useState, useEffect } from 'react';
import { Player } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

    setPlayers(data);
  };

  const addPlayer = async (newPlayer: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('players')
      .insert([newPlayer])
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

    setPlayers(prev => [...prev, data]);
    toast({
      title: "Player added",
      description: `${data.name} has been added to the player pool.`
    });
    return data;
  };

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
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

    setPlayers(prev => prev.map(p => p.id === id ? data : p));
    return data;
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
