
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useDraftContext, usePlayerContext, useMatchContext } from '@/contexts/AppContext';
import { Draft, Player } from '@/lib/types';

export const useDraftDetail = (draft: Draft | undefined) => {
  const navigate = useNavigate();
  const { startDraft, completeRound, setCurrentDraft } = useDraftContext();
  const { players } = usePlayerContext();
  const { matches, updateMatchesResults } = useMatchContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [roundResults, setRoundResults] = useState<Record<string, { player1Score: number; player2Score: number }>>({});

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

  const getDraftRecord = (playerId: string) => {
    const draftMatches = matches.filter(m => 
      m.draftId === draft?.id && 
      (m.player1 === playerId || m.player2 === playerId) &&
      m.result !== 'pending'
    );
    
    let wins = 0, losses = 0, draws = 0;
    
    draftMatches.forEach(match => {
      if (match.result === 'player1Win' && match.player1 === playerId) wins++;
      else if (match.result === 'player2Win' && match.player2 === playerId) wins++;
      else if (match.result === 'player1Win' && match.player2 === playerId) losses++;
      else if (match.result === 'player2Win' && match.player1 === playerId) losses++;
      else if (match.result === 'draw') draws++;
    });
    
    return { wins, losses, draws };
  };

  const handleStartDraft = () => {
    if (draft?.id) {
      const updatedDraft = startDraft(draft.id);
      if (updatedDraft) {
        setActiveTab('round1');
        toast({
          title: "Draft started",
          description: "The pairings have been created for round 1."
        });
      }
    }
  };

  const handleCompleteDraft = () => {
    if (draft?.id && draft.status !== 'completed') {
      if (draft.currentRound < draft.totalRounds) {
        for (let i = draft.currentRound; i <= draft.totalRounds; i++) {
          completeRound(draft.id, i);
        }
      } else {
        completeRound(draft.id, draft.currentRound);
      }
      
      toast({
        title: "Draft Ended",
        description: "The draft has been marked as completed.",
        variant: "default"
      });
      
      setActiveTab('standings');
    } else if (draft?.status === 'completed') {
      toast({
        title: "Draft Already Completed",
        description: "This draft is already marked as completed.",
        variant: "default"
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

  const handleScoreChange = (matchId: string, player: 'player1Score' | 'player2Score', value: number) => {
    setRoundResults(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId] || { player1Score: 0, player2Score: 0 },
        [player]: value
      }
    }));
  };

  const submitRoundResults = (roundNumber: number) => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) {
      console.error("Cannot find round", roundNumber, "in draft", draft?.id);
      return;
    }

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

    if (results.length === 0) {
      toast({
        title: "No results to submit",
        description: "Please enter scores for all matches.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedMatches = updateMatchesResults(results);
      
      if (updatedMatches && updatedMatches.length > 0) {
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

  const getRoundMatches = (roundNumber: number) => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    return round ? round.matches : [];
  };

  const calculateStandings = () => {
    const standings = draftPlayers.map(player => {
      const record = getDraftRecord(player.id);
      
      return {
        ...player,
        draftWins: record.wins,
        draftLosses: record.losses,
        draftDraws: record.draws,
        points: (record.wins * 3) + record.draws
      };
    });
    
    return standings.sort((a, b) => b.points - a.points);
  };

  const isRoundComplete = (roundNumber: number): boolean => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) return false;
    
    return round.matches.every(match => {
      const matchInState = matches.find(m => m.id === match.id);
      const hasResultInState = matchInState && matchInState.result !== 'pending';
      const hasScoresInLocal = roundResults[match.id] !== undefined;
      
      return hasResultInState || hasScoresInLocal;
    });
  };

  const canCompleteRound = (roundNumber: number): boolean => {
    if (!draft || draft.status !== 'active') return false;
    const round = draft.rounds.find(r => r.number === roundNumber);
    if (!round || round.completed) return false;
    return isRoundComplete(roundNumber);
  };

  const isMatchEditable = (matchId: string): boolean => {
    const match = matches.find(m => m.id === matchId);
    return !match || match.result === 'pending';
  };

  return {
    activeTab,
    setActiveTab,
    roundResults,
    draftPlayers,
    getPlayerById,
    getDraftRecord,
    handleStartDraft,
    handleCompleteDraft,
    handleScoreChange,
    submitRoundResults,
    getRoundMatches,
    calculateStandings,
    canCompleteRound,
    isMatchEditable
  };
};
