
import { useBasicDraftOperations } from './draft/useBasicDraftOperations';
import { useRoundManagement } from './draft/useRoundManagement';

export const useDraftManagement = () => {
  const {
    drafts,
    currentDraft,
    setCurrentDraft,
    createDraft,
    deleteDraft
  } = useBasicDraftOperations();

  const {
    startDraft,
    completeRound,
    createPairings
  } = useRoundManagement();

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
