import { useState, useEffect } from 'react';
import { Draft, Match } from '@/lib/types';
import { mockDrafts, generateId } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/contexts/constants';
import { toast } from '@/hooks/use-toast';
import { useMatchManagement } from './useMatchManagement';

export const useDraftManagement = () => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const storedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return storedDrafts ? JSON.parse(storedDrafts) : mockDrafts;
  });

  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);
  const { createMatch, matches, setMatches } = useMatchManagement();

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

  const completeDraft = (id: string) => {
    const draftIndex = drafts.findIndex(d => d.id === id);
    if (draftIndex === -1) return null;
    
    const updatedDraft = { 
      ...drafts[draftIndex], 
      status: 'completed' as const, 
      completedAt: new Date() 
    };
    
    const updatedDrafts = [...drafts];
    updatedDrafts[draftIndex] = updatedDraft;
    
    setDrafts(updatedDrafts);
    toast({
      title: "Draft completed",
      description: `${updatedDraft.name} has been marked as completed.`
    });
    
    return updatedDraft;
  };

  const createPairings = (draftId: string, playerIds: string[]) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return [];
    
    const seating = draft.seating;
    const numPlayers = seating.length;
    const pairings: Match[] = [];
    
    if (numPlayers === 4) {
      pairings.push(createPairingForPlayers(draftId, seating[0], seating[2]));
      pairings.push(createPairingForPlayers(draftId, seating[1], seating[3]));
    } else if (numPlayers === 6) {
      pairings.push(createPairingForPlayers(draftId, seating[0], seating[3]));
      pairings.push(createPairingForPlayers(draftId, seating[1], seating[4]));
      pairings.push(createPairingForPlayers(draftId, seating[2], seating[5]));
    } else if (numPlayers === 8) {
      pairings.push(createPairingForPlayers(draftId, seating[0], seating[4]));
      pairings.push(createPairingForPlayers(draftId, seating[1], seating[5]));
      pairings.push(createPairingForPlayers(draftId, seating[2], seating[6]));
      pairings.push(createPairingForPlayers(draftId, seating[3], seating[7]));
    }
    
    return pairings;
  };

  const createPairingForPlayers = (draftId: string, player1: string, player2: string): Match => ({
    id: generateId(),
    round: 1,
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

    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    
    // Remove associated matches
    const updatedMatches = matches.filter(m => m.draftId !== id);
    setMatches(updatedMatches);
    
    toast({
      title: "Draft deleted",
      description: `${draftToDelete.name} has been deleted.`
    });
  };

  return {
    drafts,
    currentDraft,
    setCurrentDraft,
    createDraft,
    startDraft,
    completeDraft,
    createPairings,
    deleteDraft
  };
};
