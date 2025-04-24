
import { useState, useEffect } from 'react';
import { Match } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useMatchManagement = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  // Fetch matches on mount
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
      return;
    }

    setMatches(data);
  };

  const createMatch = async (matchData: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => {
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        ...matchData,
        result: 'pending'
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating match",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    setMatches(prev => [data, ...prev]);
    return data;
  };

  const updateMatchesResults = async (matchResults: { 
    id: string; 
    player1Score: number; 
    player2Score: number;
  }[]) => {
    const updatedMatches: Match[] = [];

    for (const result of matchResults) {
      const matchResult = result.player1Score > result.player2Score ? 'player1Win' :
                         result.player2Score > result.player1Score ? 'player2Win' :
                         result.player1Score === result.player2Score && 
                         (result.player1Score > 0 || result.player2Score > 0) ? 'draw' : 'pending';

      const { data, error } = await supabase
        .from('matches')
        .update({
          player1_score: result.player1Score,
          player2_score: result.player2Score,
          result: matchResult,
          completed_at: matchResult !== 'pending' ? new Date().toISOString() : null
        })
        .eq('id', result.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating match ${result.id}:`, error);
        continue;
      }

      updatedMatches.push(data);
    }

    if (updatedMatches.length > 0) {
      setMatches(prev => 
        prev.map(match => {
          const updated = updatedMatches.find(u => u.id === match.id);
          return updated || match;
        })
      );
    }

    return updatedMatches;
  };

  return {
    matches,
    setMatches,
    createMatch,
    updateMatchesResults
  };
};
