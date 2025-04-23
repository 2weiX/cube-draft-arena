
import { Draft, Player } from '@/lib/types';
import { usePlayerContext } from '@/contexts/AppContext';
import { useRoundOperations } from './draft/useRoundOperations';
import { useDraftStandings } from './draft/useDraftStandings';
import { useDraftLifecycle } from './draft/useDraftLifecycle';
import { useRoundSubmission } from './draft/useRoundSubmission';

export const useDraftDetail = (draft: Draft | undefined) => {
  const { players } = usePlayerContext();
  
  const {
    roundResults,
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

  const {
    activeTab,
    setActiveTab,
    submitRoundResults
  } = useRoundSubmission(draft);

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
