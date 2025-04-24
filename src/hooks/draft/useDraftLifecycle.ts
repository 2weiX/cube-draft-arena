
import { toast } from '@/components/ui/use-toast';
import { useDraftContext } from '@/contexts/AppContext';
import { Draft } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

export const useDraftLifecycle = (draft: Draft | undefined) => {
  const { startDraft: contextStartDraft, completeRound } = useDraftContext();
  const navigate = useNavigate();

  const handleStartDraft = () => {
    if (draft?.id) {
      const updatedDraft = contextStartDraft(draft.id);
      
      if (updatedDraft) {
        toast({
          title: "Draft started",
          description: "The pairings have been created for round 1."
        });
        
        // Force a reload of the current page to ensure the UI updates
        navigate(0);
        
        return 'round1';
      }
    }
    return 'overview';
  };

  const handleCompleteDraft = () => {
    if (!draft?.id || draft.status === 'completed') {
      if (draft?.status === 'completed') {
        toast({
          title: "Draft Already Completed",
          description: "This draft is already marked as completed.",
          variant: "default"
        });
      }
      return false;
    }

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
    
    return true;
  };

  return {
    handleStartDraft,
    handleCompleteDraft
  };
};
