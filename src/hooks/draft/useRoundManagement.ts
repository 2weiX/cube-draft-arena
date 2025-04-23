
import { Draft, Match } from '@/lib/types';
import { generateId } from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';
import { useBasicDraftOperations } from './useBasicDraftOperations';
import { useRankingsManagement } from '../useRankingsManagement';
import { useMatchManagement } from '../useMatchManagement';

export const useRoundManagement = () => {
  const { drafts, setDrafts, currentDraft, setCurrentDraft } = useBasicDraftOperations();
  const { generatePairings: generateRankingPairings } = useRankingsManagement();
  const { matches, setMatches } = useMatchManagement();

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

    updatedDraft.rounds[roundIndex].completed = true;

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
      
      toast({
        title: "Round Completed",
        description: `Round ${roundNumber} completed. Starting round ${nextRoundNumber}.`
      });
    } else {
      updatedDraft.status = 'completed';
      updatedDraft.completedAt = new Date();
      
      toast({
        title: "Draft Completed",
        description: "All rounds completed. Final standings are available."
      });
    }

    const updatedDrafts = [...drafts];
    updatedDrafts[draftIndex] = updatedDraft;
    setDrafts(updatedDrafts);

    if (currentDraft?.id === draftId) {
      setCurrentDraft(updatedDraft);
    }

    return updatedDraft;
  };

  const createPairings = (draftId: string, playerIds: string[], roundNumber: number = 1) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return [];
    
    if (roundNumber > 1) {
      const pairings = generateRankingPairings(draftId, playerIds, matches, roundNumber);
      return pairings.map(pair => createPairingForPlayers(draftId, pair.player1, pair.player2, roundNumber));
    } else {
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

  return {
    startDraft,
    completeRound,
    createPairings
  };
};
