
import { useState } from 'react';
import { Draft, Player } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { usePlayerContext, useDraftContext, useMatchContext } from '@/contexts/AppContext';
import { useRoundOperations } from './draft/useRoundOperations';
import { useDraftStandings } from './draft/useDraftStandings';
import { useDraftLifecycle } from './draft/useDraftLifecycle';

export const useDraftDetail = (draft: Draft | undefined) => {
  const { players } = usePlayerContext();
  const { completeRound } = useDraftContext();
  const { updateMatchesResults } = useMatchContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    roundResults,
    setRoundResults,
    handleScoreChange,
    canCompleteRound,
    isMatchEditable
  } = useRoundOperations(draft);

  const {
    getDraftRecord,
    calculateStandings
  } = useDraftStandings(draft?.id);

  const {
    handleStartDraft,
    handleCompleteDraft
  } = useDraftLifecycle(draft);

  const draftPlayers = players.filter(p => draft?.players.includes(p.id));

  const getPlayerById = (id: string): Player => {
    const player = players.find(p => p.id === id);
    if (player) return player;
    return {
      id: 'unknown',
      name: 'Unknown Player',
      avatar: undefined,
      wins: 0,
      losses: 0,
      draws: 0,
      ranking: 0,
      createdAt: new Date()
    };
  };

  const submitRoundResults = (roundNumber: number) => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) return;

    const results = round.matches.map(match => {
      const scoreData = roundResults[match.id] || { 
        player1Score: match.player1Score || 0, 
        player2Score: match.player2Score || 0 
      };
      
      return {
        id: match.id,
        player1Score: Number(scoreData.player1Score || 0),
        player2Score: Number(scoreData.player2Score || 0)
      };
    });

    if (!results.length) {
      toast({
        title: "No results to submit",
        description: "Please enter scores for all matches.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedMatches = updateMatchesResults(results);
      
      if (updatedMatches?.length > 0) {
        handleRoundCompletion(roundNumber);
        setRoundResults({});
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
      setRoundResults({});
      
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
    draftPlayers,
    getPlayerById,
    getDraftRecord,
    handleStartDraft,
    handleCompleteDraft,
    handleScoreChange,
    submitRoundResults,
    calculateStandings,
    canCompleteRound,
    isMatchEditable,
    roundResults
  };
};
