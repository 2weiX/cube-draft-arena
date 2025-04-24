
import { useState } from 'react';
import { Draft, Match } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { useDraftContext, useMatchContext } from '@/contexts/AppContext';

export const useRoundSubmission = (draft: Draft | undefined) => {
  const { completeRound } = useDraftContext();
  const { updateMatchesResults } = useMatchContext();
  const [activeTab, setActiveTab] = useState('overview');

  const submitRoundResults = async (roundNumber: number) => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) return;

    const results = round.matches.map(match => ({
      id: match.id,
      player1Score: Number(match.player1Score || 0),
      player2Score: Number(match.player2Score || 0)
    }));

    if (!results.length) {
      toast({
        title: "No results to submit",
        description: "Please enter scores for all matches.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedMatches = await updateMatchesResults(results);
      
      if (updatedMatches && updatedMatches.length > 0) {
        handleRoundCompletion(roundNumber);
      } else {
        toast({
          title: "Warning",
          description: "No match results were updated. Please check your scores.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating matches:", error);
      toast({
        title: "Error",
        description: "Failed to update match results.",
        variant: "destructive"
      });
    }
  };

  const handleRoundCompletion = (roundNumber: number) => {
    if (draft?.id) {
      completeRound(draft.id, roundNumber);
      
      if (roundNumber < draft.totalRounds) {
        setActiveTab(`round${roundNumber + 1}`);
      } else {
        setActiveTab('standings');
      }
      
      toast({
        title: "Round completed",
        description: `Round ${roundNumber} has been completed${roundNumber < draft.totalRounds ? ` and new pairings created for round ${roundNumber + 1}.` : '.'}`,
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    submitRoundResults
  };
};
