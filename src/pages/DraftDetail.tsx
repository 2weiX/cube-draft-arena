import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { DraftHeader } from '@/components/draft/DraftHeader';
import { RoundContent } from '@/components/draft/RoundContent';
import { DraftStandings } from '@/components/draft/DraftStandings';
import { DraftSeating } from '@/components/DraftSeating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Player } from '@/lib/types';

const DraftDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drafts, players, matches, startDraft, completeRound, updateMatchesResults, setCurrentDraft } = useAppContext();
  const draft = drafts.find(d => d.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const [roundResults, setRoundResults] = useState<Record<string, { player1Score: number; player2Score: number }>>({});

  useEffect(() => {
    if (draft) {
      setCurrentDraft(draft);
    } else {
      toast({
        title: "Draft not found",
        description: "The draft you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/draft');
    }

    return () => setCurrentDraft(null);
  }, [draft, navigate, setCurrentDraft]);

  if (!draft) {
    return null;
  }

  const draftPlayers = players.filter(p => draft.players.includes(p.id));

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

  const getDraftRecord = (playerId: string) => {
    const draftMatches = matches.filter(m => 
      m.draftId === draft.id && 
      (m.player1 === playerId || m.player2 === playerId) &&
      m.result !== 'pending'
    );
    
    let wins = 0, losses = 0, draws = 0;
    
    draftMatches.forEach(match => {
      if (match.result === 'player1Win' && match.player1 === playerId) wins++;
      else if (match.result === 'player2Win' && match.player2 === playerId) wins++;
      else if (match.result === 'player1Win' && match.player2 === playerId) losses++;
      else if (match.result === 'player2Win' && match.player1 === playerId) losses++;
      else if (match.result === 'draw') draws++;
    });
    
    return { wins, losses, draws };
  };

  const handleStartDraft = () => {
    if (draft.id) {
      const updatedDraft = startDraft(draft.id);
      if (updatedDraft) {
        setActiveTab('round1');
        toast({
          title: "Draft started",
          description: "The pairings have been created for round 1."
        });
      }
    }
  };

  const handleCompleteDraft = () => {
    if (draft.id) {
      // Always mark the current round as completed first
      completeRound(draft.id, draft.currentRound);

      toast({
        title: "Draft Ended",
        description: "The draft has been marked as completed.",
        variant: "default"
      });
      
      // Switch to standings view after completion
      setActiveTab('standings');
    }
  };

  const handleRoundCompletion = (roundNumber: number) => {
    if (draft?.id) {
      completeRound(draft.id, roundNumber);
      
      setRoundResults({});
      
      // Set the active tab to the next round or standings if it was the last round
      if (roundNumber < draft.totalRounds) {
        setActiveTab(`round${roundNumber + 1}`);
      } else {
        setActiveTab('standings');
      }
      
      toast({
        title: "Round completed",
        description: `Round ${roundNumber} has been completed${roundNumber < draft.totalRounds ? ` and new pairings created for round ${roundNumber + 1}.` : '.'}`,
      });
    }
  };

  const handleScoreChange = (matchId: string, player: 'player1Score' | 'player2Score', value: number) => {
    setRoundResults(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [player]: value
      }
    }));
  };

  const submitRoundResults = (roundNumber: number) => {
    const round = draft?.rounds.find(r => r.number === roundNumber);
    if (!round) {
      console.error("Cannot find round", roundNumber, "in draft", draft?.id);
      return;
    }

    const results = round.matches.map(match => {
      // Make sure we have results for every match
      const scoreData = roundResults[match.id] || { player1Score: 0, player2Score: 0 };
      return {
        id: match.id,
        player1Score: Number(scoreData.player1Score || 0),
        player2Score: Number(scoreData.player2Score || 0)
      };
    });

    console.log("Submitting round results:", results);
    
    if (results.length === 0) {
      console.warn("No results to submit for round", roundNumber);
      toast({
        title: "No results to submit",
        description: "Please enter scores for all matches.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get the array of updated matches from updateMatchesResults
      const updatedMatches = updateMatchesResults(results);
      
      if (updatedMatches && updatedMatches.length > 0) {
        console.log("Matches updated successfully:", updatedMatches.length);
        
        // Then complete the round, which will create the next round pairings if needed
        handleRoundCompletion(roundNumber);
      } else {
        console.error("No matches were updated");
        toast({
          title: "Warning",
          description: "No match results were updated. Please check your scores.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating matches:", error);
      toast({
        title: "Error",
        description: "Failed to update match results.",
        variant: "destructive"
      });
    }
  };

  const getRoundMatches = (roundNumber: number) => {
    const round = draft.rounds.find(r => r.number === roundNumber);
    return round ? round.matches : [];
  };

  const calculateStandings = () => {
    const standings = draftPlayers.map(player => {
      const record = getDraftRecord(player.id);
      
      return {
        ...player,
        draftWins: record.wins,
        draftLosses: record.losses,
        draftDraws: record.draws,
        points: (record.wins * 3) + record.draws
      };
    });
    
    return standings.sort((a, b) => b.points - a.points);
  };

  const isRoundComplete = (roundNumber: number): boolean => {
    const round = draft.rounds.find(r => r.number === roundNumber);
    if (!round) return false;
    
    return round.matches.every(match => {
      const matchInState = matches.find(m => m.id === match.id);
      const hasResultInState = matchInState && matchInState.result !== 'pending';
      const hasScoresInLocal = roundResults[match.id] !== undefined;
      
      return hasResultInState || hasScoresInLocal;
    });
  };

  const canCompleteRound = (roundNumber: number): boolean => {
    if (!draft || draft.status !== 'active') return false;
    
    const round = draft.rounds.find(r => r.number === roundNumber);
    if (!round || round.completed) return false;
    
    return isRoundComplete(roundNumber);
  };

  const isMatchEditable = (matchId: string): boolean => {
    const match = matches.find(m => m.id === matchId);
    return !match || match.result === 'pending';
  };

  const standings = calculateStandings();

  return (
    <div className="container my-8 animate-fade-in">
      <DraftHeader 
        draft={draft}
        onStartDraft={handleStartDraft}
        onCompleteDraft={handleCompleteDraft}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seating">Seating</TabsTrigger>
          {draft.rounds.map((round) => (
            <TabsTrigger key={round.number} value={`round${round.number}`}>
              Round {round.number}
            </TabsTrigger>
          ))}
          <TabsTrigger value="standings">Standings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Draft Details</CardTitle>
              <CardDescription>
                Created on {new Date(draft.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {draft.description && (
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-muted-foreground">{draft.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Rounds</p>
                    <p className="text-xl font-bold">{draft.rounds.length}/{draft.totalRounds}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Players</p>
                    <p className="text-xl font-bold">{draft.players.length}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Matches</p>
                    <p className="text-xl font-bold">
                      {draft.rounds.reduce((acc, round) => acc + round.matches.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Players</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {draftPlayers.map(player => {
                    const record = getDraftRecord(player.id);
                    return (
                      <div key={player.id} className="border rounded-md p-2 flex items-center space-x-2">
                        <div className="w-8 h-8 bg-mtg-purple text-white rounded-full flex items-center justify-center">
                          {player.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <span className="truncate block">{player.name}</span>
                          {record.wins > 0 || record.losses > 0 || record.draws > 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {record.wins}-{record.losses}-{record.draws}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {draft.status !== 'pending' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Current Leaders</CardTitle>
                <CardDescription>Top players in this draft</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {standings.slice(0, 3).map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                          ${index === 0 ? 'bg-yellow-400' : 
                            index === 1 ? 'bg-gray-300' : 
                            'bg-amber-700'} text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.draftWins}W - {player.draftLosses}L - {player.draftDraws}D
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-lg">{player.points} pts</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seating">
          <DraftSeating draftId={draft.id} />
        </TabsContent>

        {draft.rounds.map((round) => (
          <TabsContent key={round.number} value={`round${round.number}`}>
            <RoundContent
              roundNumber={round.number}
              matches={round.matches}
              completed={round.completed}
              getPlayerById={getPlayerById}
              getDraftRecord={getDraftRecord}
              roundResults={roundResults}
              isMatchEditable={isMatchEditable}
              canCompleteRound={canCompleteRound(round.number)}
              onScoreChange={handleScoreChange}
              onSubmitRound={() => submitRoundResults(round.number)}
            />
          </TabsContent>
        ))}

        <TabsContent value="standings">
          <DraftStandings standings={standings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DraftDetail;
