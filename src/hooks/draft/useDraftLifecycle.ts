
import { toast } from '@/components/ui/use-toast';
import { useDraftContext } from '@/contexts/AppContext';
import { Draft } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

export const useDraftLifecycle = (draft: Draft | undefined) => {
  const { startDraft: contextStartDraft, completeRound } = useDraftContext();
  const navigate = useNavigate();

  const handleStartDraft = () => {
    if (draft?.id) {
      try {
        console.log("Starting draft:", draft.id);
        const updatedDraft = contextStartDraft(draft.id);
        
        if (updatedDraft) {
          console.log("Draft started successfully:", updatedDraft);
          
          toast({
            title: "Draft started",
            description: "The pairings have been created for round 1."
          });
          
          // Force a reload of the current page to ensure the UI updates
          setTimeout(() => {
            navigate(0);
          }, 100);
          
          return 'round1';
        } else {
          console.error("Failed to start draft - no updated draft returned");
          toast({
            title: "Error",
            description: "Failed to start the draft. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error starting draft:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred when starting the draft.",
          variant: "destructive"
        });
      }
    } else {
      console.error("Cannot start draft - no draft ID available");
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
