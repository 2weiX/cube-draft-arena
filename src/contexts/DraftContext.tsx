
import React, { createContext, useContext } from 'react';
import { useDraftManagement } from '@/hooks/useDraftManagement';
import { Draft, Match } from '@/lib/types';

interface DraftContextType {
  drafts: Draft[];
  currentDraft: Draft | null;
  setCurrentDraft: (draft: Draft | null) => void;
  createDraft: (draft: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt' | 'seating'>) => Draft;
  startDraft: (id: string) => Draft | null;
  completeRound: (draftId: string, roundNumber: number) => Draft | null;
  createPairings: (draftId: string, players: string[], roundNumber?: number) => Match[];
  deleteDraft: (id: string) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export const DraftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    drafts,
    currentDraft,
    setCurrentDraft,
    createDraft,
    startDraft,
    completeRound,
    createPairings,
    deleteDraft
  } = useDraftManagement();

  return (
    <DraftContext.Provider value={{
      drafts,
      currentDraft,
      setCurrentDraft,
      createDraft,
      startDraft,
      completeRound,
      createPairings,
      deleteDraft
    }}>
      {children}
    </DraftContext.Provider>
  );
};

export const useDraftContext = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraftContext must be used within a DraftProvider');
  }
  return context;
};
