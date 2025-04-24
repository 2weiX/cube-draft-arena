
import { useState, useEffect } from 'react';
import { Match } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { dbToMatchModel, matchToDbModel } from '@/lib/adapters';

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
      toast({
        title: "Error fetching matches",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Convert database objects to application models
    const matchModels = data.map(dbToMatchModel);
    setMatches(matchModels);
  };

  const createMatch = async (matchData: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => {
    const dbMatch = matchToDbModel(matchData);
    
    const { data, error } = await supabase
      .from('matches')
      .insert([dbMatch])
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

    const matchModel = dbToMatchModel(data);
    setMatches(prev => [matchModel, ...prev]);
    
    return matchModel;
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
        toast({
          title: "Error updating match",
          description: error.message,
          variant: "destructive"
        });
        continue;
      }

      updatedMatches.push(dbToMatchModel(data));
    }

    if (updatedMatches.length > 0) {
      // Fetch all matches again to ensure we have the latest data
      await fetchMatches();
      
      // Notify about success
      toast({
        title: "Matches updated",
        description: `${updatedMatches.length} match results saved successfully.`
      });
    }

    return updatedMatches;
  };

  return {
    matches,
    setMatches,
    createMatch,
    updateMatchesResults,
    fetchMatches
  };
};
