
import { useState, useEffect } from 'react';
import { Draft } from '@/lib/types';
import { mockDrafts, generateId } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/contexts/constants';
import { toast } from '@/components/ui/use-toast';

export const useBasicDraftOperations = () => {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    const storedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    return storedDrafts ? JSON.parse(storedDrafts) : mockDrafts;
  });

  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

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

  const deleteDraft = (id: string) => {
    const draftToDelete = drafts.find(d => d.id === id);
    if (!draftToDelete) return;

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
    
    toast({
      title: "Draft deleted",
      description: `${draftToDelete.name} has been deleted. Player records have been preserved.`
    });
  };

  return {
    drafts,
    currentDraft,
    setCurrentDraft,
    setDrafts,
    createDraft,
    deleteDraft,
  };
};
