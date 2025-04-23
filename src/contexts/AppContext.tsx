
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

  updateMatchesResults: (matchResults: { id: string; player1Score: number; player2Score: number; }[]) => Match[];
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
  const { matches, createMatch, updateMatchesResults: updateMatches } = useMatchManagement();
  const { updateRankings } = useRankingsManagement();

  const updateMatchResult = (id: string, player1Score: number, player2Score: number) => {
    const matchIndex = matches.findIndex(m => m.id === id);
    if (matchIndex === -1) return null;
    
    // Ensure scores are valid numbers
    const validPlayer1Score = Number(player1Score) || 0;
    const validPlayer2Score = Number(player2Score) || 0;
    
    let result: Match['result'] = 'pending';
    
    if (validPlayer1Score > validPlayer2Score) {
      result = 'player1Win';
    } else if (validPlayer2Score > validPlayer1Score) {
      result = 'player2Win';
    } else if (validPlayer1Score === validPlayer2Score && validPlayer1Score > 0) {
      result = 'draw';
    }
    
    const match = matches[matchIndex];
    const updatedMatch: Match = {
      ...match,
      player1Score: validPlayer1Score,
      player2Score: validPlayer2Score,
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

    // Update player rankings based on the new match result
    const updatedPlayers = updateRankings(players, updatedMatches);
    
    // Update each player's stats
    if (match.player1) {
      const player1Stats = updatedPlayers.find(p => p.id === match.player1);
      if (player1Stats) {
        updatePlayer(match.player1, { 
          wins: player1Stats.wins,
          losses: player1Stats.losses,
          draws: player1Stats.draws,
          ranking: player1Stats.ranking
        });
      }
    }
    
    if (match.player2) {
      const player2Stats = updatedPlayers.find(p => p.id === match.player2);
      if (player2Stats) {
        updatePlayer(match.player2, {
          wins: player2Stats.wins,
          losses: player2Stats.losses,
          draws: player2Stats.draws,
          ranking: player2Stats.ranking
        });
      }
    }

    toast({
      title: "Match result updated",
      description: "The match result has been recorded successfully."
    });
    
    return updatedMatch;
  };

  const updateMatchesResults = (
    matchResults: { id: string; player1Score: number; player2Score: number; }[]
  ): Match[] => {
    console.log("AppContext: Updating match results:", matchResults);
    
    // Validate match results before processing
    const validatedResults = matchResults.map(result => ({
      id: result.id,
      player1Score: Number(result.player1Score) || 0,
      player2Score: Number(result.player2Score) || 0
    }));
    
    console.log("Validated results:", validatedResults);
    
    // First update the matches in state
    const updatedMatches = updateMatches(validatedResults);
    
    if (!updatedMatches || updatedMatches.length === 0) {
      console.warn("No matches were updated");
      return [];
    }
    
    // Then update the player rankings based on the new match results
    const updatedPlayers = updateRankings(players, matches);
    
    // Update player stats for affected players
    const affectedPlayers = new Set<string>();
    
    // Collect all players involved in the matches being updated
    validatedResults.forEach(result => {
      const match = matches.find(m => m.id === result.id);
      if (match) {
        affectedPlayers.add(match.player1);
        affectedPlayers.add(match.player2);
      }
    });

    console.log("Affected players:", Array.from(affectedPlayers));
    
    // Update each affected player's record
    affectedPlayers.forEach(playerId => {
      const updatedPlayerStats = updatedPlayers.find(p => p.id === playerId);
      if (updatedPlayerStats) {
        console.log(`Updating player ${playerId} stats:`, {
          wins: updatedPlayerStats.wins,
          losses: updatedPlayerStats.losses,
          draws: updatedPlayerStats.draws
        });
        
        updatePlayer(playerId, {
          wins: updatedPlayerStats.wins,
          losses: updatedPlayerStats.losses,
          draws: updatedPlayerStats.draws,
          ranking: updatedPlayerStats.ranking
        });
      }
    });

    toast({
      title: "Round results updated",
      description: "All match results have been recorded successfully."
    });
    
    return updatedMatches;
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
    deleteDraft,
    updateMatchesResults,
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
