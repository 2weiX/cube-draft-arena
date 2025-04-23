import React, { createContext, useContext, useState } from 'react';
import { Player, Draft, Match, MatchResult, Round } from '@/lib/types';
import { mockPlayers, mockDrafts, mockMatches, generateId } from '@/lib/mockData';
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
  createDraft: (draft: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt'>) => Draft;
  startDraft: (id: string) => Draft | null;
  completeDraft: (id: string) => Draft | null;
  
  // Match functions
  createMatch: (match: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => Match;
  updateMatchResult: (id: string, player1Score: number, player2Score: number) => Match | null;

  // Pairing functions
  createPairings: (draftId: string, players: string[]) => Match[];
  
  // Current draft
  currentDraft: Draft | null;
  setCurrentDraft: (draft: Draft | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [drafts, setDrafts] = useState<Draft[]>(mockDrafts);
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [currentDraft, setCurrentDraft] = useState<Draft | null>(null);

  // Player functions
  const addPlayer = (newPlayer: Omit<Player, 'id' | 'wins' | 'losses' | 'draws' | 'ranking' | 'createdAt'>) => {
    const player: Player = {
      id: generateId(),
      ...newPlayer,
      wins: 0,
      losses: 0,
      draws: 0,
      ranking: players.length + 1,
      createdAt: new Date()
    };
    
    setPlayers([...players, player]);
    toast({
      title: "Player added",
      description: `${player.name} has been added to the player pool.`
    });
    return player;
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedPlayer = { ...players[index], ...updates };
    const updatedPlayers = [...players];
    updatedPlayers[index] = updatedPlayer;
    
    setPlayers(updatedPlayers);
    return updatedPlayer;
  };

  const deletePlayer = (id: string) => {
    const playerExists = players.some(p => p.id === id);
    if (!playerExists) return false;
    
    setPlayers(players.filter(p => p.id !== id));
    toast({
      title: "Player removed",
      description: "The player has been removed from the player pool."
    });
    return true;
  };

  // Draft functions
  const createDraft = (draftData: Omit<Draft, 'id' | 'rounds' | 'status' | 'createdAt'>) => {
    const draft: Draft = {
      id: generateId(),
      ...draftData,
      rounds: [],
      status: 'pending',
      totalRounds: draftData.totalRounds,
      createdAt: new Date()
    };
    
    setDrafts([...drafts, draft]);
    toast({
      title: "Draft created",
      description: `${draft.name} has been created successfully.`
    });
    return draft;
  };

  const startDraft = (id: string) => {
    const draftIndex = drafts.findIndex(d => d.id === id);
    if (draftIndex === -1) return null;
    
    // Create initial pairings
    const draft = drafts[draftIndex];
    const initialPairings = createPairings(id, draft.players);
    
    // Update draft status
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

  // Match functions
  const createMatch = (matchData: Omit<Match, 'id' | 'result' | 'createdAt' | 'completedAt'>) => {
    const match: Match = {
      id: generateId(),
      ...matchData,
      player1Score: 0,
      player2Score: 0,
      result: 'pending',
      createdAt: new Date()
    };
    
    setMatches([...matches, match]);
    return match;
  };

  const updateMatchResult = (id: string, player1Score: number, player2Score: number) => {
    const matchIndex = matches.findIndex(m => m.id === id);
    if (matchIndex === -1) return null;
    
    let result: MatchResult = 'pending';
    
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
    
    setMatches(updatedMatches);
    
    // Update player stats
    if (result !== 'pending') {
      const player1 = players.find(p => p.id === match.player1);
      const player2 = players.find(p => p.id === match.player2);
      
      if (player1 && player2) {
        if (result === 'player1Win') {
          updatePlayer(player1.id, { wins: player1.wins + 1 });
          updatePlayer(player2.id, { losses: player2.losses + 1 });
        } else if (result === 'player2Win') {
          updatePlayer(player1.id, { losses: player1.losses + 1 });
          updatePlayer(player2.id, { wins: player2.wins + 1 });
        } else if (result === 'draw') {
          updatePlayer(player1.id, { draws: player1.draws + 1 });
          updatePlayer(player2.id, { draws: player2.draws + 1 });
        }
        
        // Update rankings
        updateRankings();
      }
    }
    
    // Check if we need to update the draft
    const draftId = match.draftId;
    const draft = drafts.find(d => d.id === draftId);
    
    if (draft) {
      const updatedDraft = { ...draft };
      
      // Find the round this match belongs to
      const roundIndex = updatedDraft.rounds.findIndex(r => r.number === match.round);
      if (roundIndex !== -1) {
        // Update the match in the round
        const round = updatedDraft.rounds[roundIndex];
        const matchInRoundIndex = round.matches.findIndex(m => m.id === match.id);
        
        if (matchInRoundIndex !== -1) {
          const updatedRoundMatches = [...round.matches];
          updatedRoundMatches[matchInRoundIndex] = updatedMatch;
          
          // Check if all matches in the round are completed
          const allMatchesCompleted = updatedRoundMatches.every(m => m.result !== 'pending');
          
          const updatedRound: Round = {
            ...round,
            matches: updatedRoundMatches,
            completed: allMatchesCompleted
          };
          
          const updatedRounds = [...updatedDraft.rounds];
          updatedRounds[roundIndex] = updatedRound;
          updatedDraft.rounds = updatedRounds;
          
          // If round is completed and it's not the last round (3), create next round
          if (allMatchesCompleted && round.number < 3) {
            const nextRoundNumber = round.number + 1;
            const nextRoundPairings = createPairingsForNextRound(updatedDraft, nextRoundNumber);
            
            updatedDraft.rounds.push({
              number: nextRoundNumber,
              matches: nextRoundPairings,
              completed: false
            });
            
            setMatches([...updatedMatches, ...nextRoundPairings]);
          }
          
          // Update draft in state
          const draftIndex = drafts.findIndex(d => d.id === draftId);
          if (draftIndex !== -1) {
            const updatedDrafts = [...drafts];
            updatedDrafts[draftIndex] = updatedDraft;
            setDrafts(updatedDrafts);
            
            // If current draft is the one being updated, update currentDraft as well
            if (currentDraft && currentDraft.id === draftId) {
              setCurrentDraft(updatedDraft);
            }
          }
        }
      }
    }
    
    toast({
      title: "Match result updated",
      description: `The match result has been recorded successfully.`
    });
    
    return updatedMatch;
  };

  // Pairing functions
  const createPairings = (draftId: string, playerIds: string[]) => {
    // Simple random pairing for the first round
    const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5);
    
    const pairings: Match[] = [];
    
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      if (i + 1 < shuffledPlayers.length) {
        pairings.push({
          id: generateId(),
          round: 1,
          draftId,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          player1Score: 0,
          player2Score: 0,
          result: 'pending',
          createdAt: new Date()
        });
      }
    }
    
    return pairings;
  };
  
  const createPairingsForNextRound = (draft: Draft, roundNumber: number) => {
    // Get the results from the previous round
    const previousRound = draft.rounds.find(r => r.number === roundNumber - 1);
    
    if (!previousRound) {
      return [];
    }
    
    // Calculate points for each player based on previous rounds
    const playerPoints: Record<string, number> = {};
    draft.players.forEach(playerId => {
      playerPoints[playerId] = 0;
    });
    
    // For all completed rounds, calculate points
    draft.rounds.forEach(round => {
      if (round.completed) {
        round.matches.forEach(match => {
          if (match.result === 'player1Win') {
            playerPoints[match.player1] = (playerPoints[match.player1] || 0) + 3;
          } else if (match.result === 'player2Win') {
            playerPoints[match.player2] = (playerPoints[match.player2] || 0) + 3;
          } else if (match.result === 'draw') {
            playerPoints[match.player1] = (playerPoints[match.player1] || 0) + 1;
            playerPoints[match.player2] = (playerPoints[match.player2] || 0) + 1;
          }
        });
      }
    });
    
    // Sort players by points
    const sortedPlayers = Object.entries(playerPoints)
      .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
      .map(([playerId]) => playerId);
    
    // Create pairings based on Swiss system (players with similar points play each other)
    const pairings: Match[] = [];
    
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      if (i + 1 < sortedPlayers.length) {
        pairings.push({
          id: generateId(),
          round: roundNumber,
          draftId: draft.id,
          player1: sortedPlayers[i],
          player2: sortedPlayers[i + 1],
          player1Score: 0,
          player2Score: 0,
          result: 'pending',
          createdAt: new Date()
        });
      }
    }
    
    return pairings;
  };
  
  const updateRankings = () => {
    // Calculate points for each player
    const playerPoints = players.map(player => ({
      player,
      points: (player.wins * 3) + player.draws
    }));
    
    // Sort by points (highest first)
    playerPoints.sort((a, b) => b.points - a.points);
    
    // Update rankings
    const updatedPlayers = playerPoints.map((item, index) => ({
      ...item.player,
      ranking: index + 1
    }));
    
    setPlayers(updatedPlayers);
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
    completeDraft,
    createMatch,
    updateMatchResult,
    createPairings,
    currentDraft,
    setCurrentDraft
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
