
import React, { createContext, useContext } from 'react';
import { usePlayerManagement } from '@/hooks/usePlayerManagement';
import { useDraftManagement } from '@/hooks/useDraftManagement';
import { useMatchManagement } from '@/hooks/useMatchManagement';
import { useRankingsManagement } from '@/hooks/useRankingsManagement';
import { Player, Draft, Match } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  // Data
  players: Player[];
  drafts: Draft[];
  matches: Match[];
  
  // Player functions
  addPlayer: (player: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => Player | null;
  deletePlayer: (id: string) => boolean;
  
  // Draft functions
  createDraft: (draft: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt' | 'seating'>) => Draft;
  startDraft: (id: string) => Draft | null;
  completeRound: (draftId: string, roundNumber: number) => Draft | null;
  deleteDraft: (id: string) => void;
  
  // Match functions
  createMatch: (match: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => Match;
  updateMatchResult: (id: string, player1Score: number, player2Score: number) => Match | null;

  // Pairing functions
  createPairings: (draftId: string, players: string[], roundNumber?: number) => Match[];
  
  // Current draft
  currentDraft: Draft | null;
  setCurrentDraft: (draft: Draft | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayerManagement();
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
  const { matches, createMatch } = useMatchManagement();
  const { updateRankings } = useRankingsManagement();

  const updateMatchResult = (id: string, player1Score: number, player2Score: number) => {
    const matchIndex = matches.findIndex(m => m.id === id);
    if (matchIndex === -1) return null;
    
    let result: Match['result'] = 'pending';
    
    if (player1Score > player2Score) {
      result = 'player1Win';
    } else if (player2Score > player1Score) {
      result = 'player2Win';
    } else if (player1Score === player2Score && player1Score > 0) {
      result = 'draw';
    }
    
    const match = matches[matchIndex];
    const updatedMatch: Match = {
      ...match,
      player1Score,
      player2Score,
      result,
      completedAt: result !== 'pending' ? new Date() : undefined
    };
    
    const updatedMatches = [...matches];
    updatedMatches[matchIndex] = updatedMatch;
    
    const draft = drafts.find(d => d.id === match.draftId);
    if (draft) {
      const updatedDraft = { ...draft };
      const roundIndex = updatedDraft.rounds.findIndex(r => r.number === match.round);
      
      if (roundIndex !== -1) {
        const round = updatedDraft.rounds[roundIndex];
        const matchInRoundIndex = round.matches.findIndex(m => m.id === match.id);
        
        if (matchInRoundIndex !== -1) {
          const updatedRoundMatches = [...round.matches];
          updatedRoundMatches[matchInRoundIndex] = updatedMatch;
          const allMatchesCompleted = updatedRoundMatches.every(m => m.result !== 'pending');
          
          const updatedRounds = [...updatedDraft.rounds];
          updatedRounds[roundIndex] = {
            ...round,
            matches: updatedRoundMatches,
            completed: round.completed
          };
          
          updatedDraft.rounds = updatedRounds;
          
          const draftIndex = drafts.findIndex(d => d.id === match.draftId);
          if (draftIndex !== -1) {
            const updatedDrafts = [...drafts];
            updatedDrafts[draftIndex] = updatedDraft;
            
            if (currentDraft && currentDraft.id === match.draftId) {
              setCurrentDraft(updatedDraft);
            }
          }
        }
      }
    }

    const updatedPlayers = updateRankings(players, updatedMatches);
    updatePlayer(match.player1, { 
      wins: updatedPlayers.find(p => p.id === match.player1)?.wins || 0,
      losses: updatedPlayers.find(p => p.id === match.player1)?.losses || 0,
      draws: updatedPlayers.find(p => p.id === match.player1)?.draws || 0,
      ranking: updatedPlayers.find(p => p.id === match.player1)?.ranking || 0
    });
    updatePlayer(match.player2, {
      wins: updatedPlayers.find(p => p.id === match.player2)?.wins || 0,
      losses: updatedPlayers.find(p => p.id === match.player2)?.losses || 0,
      draws: updatedPlayers.find(p => p.id === match.player2)?.draws || 0,
      ranking: updatedPlayers.find(p => p.id === match.player2)?.ranking || 0
    });

    toast({
      title: "Match result updated",
      description: "The match result has been recorded successfully."
    });
    
    return updatedMatch;
  };

  const value = {
    players,
    drafts,
    matches,
    addPlayer,
    updatePlayer,
    deletePlayer,
    createDraft,
    startDraft,
    completeRound,
    createMatch,
    updateMatchResult,
    createPairings,
    currentDraft,
    setCurrentDraft,
    deleteDraft
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
