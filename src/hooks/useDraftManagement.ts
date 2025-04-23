
import { useState, useEffect } from 'react';
import { Draft, Match } from '@/lib/types';
import { mockDrafts, generateId } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/contexts/constants';
import { toast } from '@/components/ui/use-toast';
import { useMatchManagement } from './useMatchManagement';
import { useRankingsManagement } from './useRankingsManagement';

export const useDraftManagement = () => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const storedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return storedDrafts ? JSON.parse(storedDrafts) : mockDrafts;
  });

  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
  const { createMatch, matches, setMatches } = useMatchManagement();
  const { generatePairings } = useRankingsManagement();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  }, [drafts]);

  const createDraft = (draftData: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt' | 'seating'>) => {
    const randomizedSeating = [...draftData.players].sort(() => Math.random() - 0.5);
    
    const draft: Draft = {
      id: generateId(),
      ...draftData,
      seating: randomizedSeating,
      rounds: [],
      status: 'pending',
      currentRound: draftData.currentRound || 0,
      createdAt: new Date()
    };
    
    setDrafts([...drafts, draft]);
    toast({
      title: "Draft created",
      description: `${draft.name} has been created with random seating arrangements.`
    });
    return draft;
  };

  const startDraft = (id: string) => {
    const draftIndex = drafts.findIndex(d => d.id === id);
    if (draftIndex === -1) return null;
    
    const draft = drafts[draftIndex];
    const initialPairings = createPairings(id, draft.players);
    
    const updatedDraft = { 
      ...draft, 
      status: 'active' as const,
      currentRound: 1,
      startedAt: new Date(),
      rounds: [{ number: 1, matches: initialPairings, completed: false }]
    };
    
    const updatedDrafts = [...drafts];
    updatedDrafts[draftIndex] = updatedDraft;
    
    setDrafts(updatedDrafts);
    setMatches([...matches, ...initialPairings]);
    toast({
      title: "Draft started",
      description: `${updatedDraft.name} has started with ${initialPairings.length} initial pairings.`
    });
    
    return updatedDraft;
  };

  const completeRound = (draftId: string, roundNumber: number) => {
    const draftIndex = drafts.findIndex(d => d.id === draftId);
    if (draftIndex === -1) return null;

    const draft = drafts[draftIndex];
    const updatedDraft = { ...draft };
    const roundIndex = updatedDraft.rounds.findIndex(r => r.number === roundNumber);

    if (roundIndex === -1) return null;

    // Mark the round as completed
    updatedDraft.rounds[roundIndex].completed = true;

    // If there are more rounds to play, create new pairings
    if (roundNumber < updatedDraft.totalRounds) {
      const nextRoundNumber = roundNumber + 1;
      const nextRoundPairings = createPairings(draftId, draft.players, nextRoundNumber);
      
      updatedDraft.rounds.push({
        number: nextRoundNumber,
        matches: nextRoundPairings,
        completed: false
      });
      
      updatedDraft.currentRound = nextRoundNumber;
      setMatches([...matches, ...nextRoundPairings]);
    } else {
      // If this was the last round, complete the draft
      updatedDraft.status = 'completed';
      updatedDraft.completedAt = new Date();
    }

    const updatedDrafts = [...drafts];
    updatedDrafts[draftIndex] = updatedDraft;
    setDrafts(updatedDrafts);

    toast({
      title: roundNumber < updatedDraft.totalRounds ? "Round Completed" : "Draft Completed",
      description: roundNumber < updatedDraft.totalRounds 
        ? `Round ${roundNumber} completed. New pairings created for round ${roundNumber + 1}.`
        : "All rounds completed. Draft has been marked as completed."
    });

    return updatedDraft;
  };

  const createPairings = (draftId: string, playerIds: string[], roundNumber: number = 1) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return [];
    
    // Use the improved pairing algorithm from useRankingsManagement
    if (roundNumber > 1) {
      // For rounds after the first, use the standings-based pairings
      const pairings = generatePairings(draftId, playerIds, matches, roundNumber);
      return pairings.map(pair => createPairingForPlayers(draftId, pair.player1, pair.player2, roundNumber));
    } else {
      // For the first round, use the original random seating logic
      const seating = draft.seating;
      const numPlayers = seating.length;
      const pairings: Match[] = [];
      
      if (numPlayers === 4) {
        pairings.push(createPairingForPlayers(draftId, seating[0], seating[2], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[1], seating[3], roundNumber));
      } else if (numPlayers === 6) {
        pairings.push(createPairingForPlayers(draftId, seating[0], seating[3], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[1], seating[4], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[2], seating[5], roundNumber));
      } else if (numPlayers === 8) {
        pairings.push(createPairingForPlayers(draftId, seating[0], seating[4], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[1], seating[5], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[2], seating[6], roundNumber));
        pairings.push(createPairingForPlayers(draftId, seating[3], seating[7], roundNumber));
      }
      
      return pairings;
    }
  };

  const createPairingForPlayers = (draftId: string, player1: string, player2: string, round: number = 1): Match => ({
    id: generateId(),
    round,
    draftId,
    player1,
    player2,
    player1Score: 0,
    player2Score: 0,
    result: 'pending',
    createdAt: new Date()
  });

  const deleteDraft = (id: string) => {
    const draftToDelete = drafts.find(d => d.id === id);
    if (!draftToDelete) return;

    // Only allow deletion of completed drafts
    if (draftToDelete.status !== 'completed') {
      toast({
        title: "Cannot delete draft",
        description: "Only completed drafts can be deleted.",
        variant: "destructive"
      });
      return;
    }

    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    
    // Remove associated matches
    const updatedMatches = matches.filter(m => m.draftId !== id);
    setMatches(updatedMatches);
    
    toast({
      title: "Draft deleted",
      description: `${draftToDelete.name} has been deleted. Player records have been preserved.`
    });
  };

  return {
    drafts,
    currentDraft,
    setCurrentDraft,
    createDraft,
    startDraft,
    completeRound,
    createPairings,
    deleteDraft
  };
};
