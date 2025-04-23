import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import { Match, Player, Draft } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { DraftSeating } from '@/components/DraftSeating';

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

  const getPlayerById = (id: string) => {
    return players.find(p => p.id === id) || { name: 'Unknown Player', id: 'unknown' };
  };

  const getDraftRecord = (playerId: string): { wins: number, losses: number, draws: number } => {
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
      const finalRound = draft.currentRound || draft.rounds.length;
      completeRound(draft.id, finalRound);
      
      toast({
        title: "Draft Ended",
        description: "The draft has been marked as completed.",
        variant: "default"
      });
    }
  };

  const handleRoundCompletion = (roundNumber: number) => {
    if (draft?.id) {
      completeRound(draft.id, roundNumber);
      
      setRoundResults({});
      
      toast({
        title: "Round completed",
        description: `Round ${roundNumber} has been completed and new pairings created.`
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
    if (!round) return;

    const results = round.matches.map(match => ({
      id: match.id,
      player1Score: roundResults[match.id]?.player1Score || 0,
      player2Score: roundResults[match.id]?.player2Score || 0
    }));

    console.log("Submitting round results:", results);
    updateMatchesResults(results);
    handleRoundCompletion(roundNumber);

    if (roundNumber === draft.totalRounds) {
      setActiveTab('standings');
    }
  };

  const getRoundMatches = (roundNumber: number) => {
    const round = draft.rounds.find(r => r.number === roundNumber);
    return round ? round.matches : [];
  };

  const calculateStandings = () => {
    const standings = draftPlayers.map(player => {
      const draftMatches = matches.filter(m => 
        m.draftId === draft.id && (m.player1 === player.id || m.player2 === player.id)
      );
      
      let wins = 0;
      let losses = 0;
      let draws = 0;
      
      draftMatches.forEach(match => {
        if (match.result === 'player1Win' && match.player1 === player.id) wins++;
        else if (match.result === 'player2Win' && match.player2 === player.id) wins++;
        else if (match.result === 'player1Win' && match.player2 === player.id) losses++;
        else if (match.result === 'player2Win' && match.player1 === player.id) losses++;
        else if (match.result === 'draw') draws++;
      });
      
      return {
        ...player,
        draftWins: wins,
        draftLosses: losses,
        draftDraws: draws,
        points: (wins * 3) + draws
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
      <div className="mb-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Link to="/draft" className="hover:underline">
            Drafts
          </Link>
          <span>/</span>
          <span className="truncate">{draft.name}</span>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{draft.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={
                draft.status === 'pending' ? 'secondary' : 
                draft.status === 'active' ? 'default' : 
                'outline'
              }>
                {draft.status === 'pending' ? 'Pending' : 
                 draft.status === 'active' ? 'Active' : 
                 'Completed'}
              </Badge>
              <p className="text-muted-foreground">
                {draft.players.length} players
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {draft.status === 'pending' && (
              <Button onClick={handleStartDraft}>Start Draft</Button>
            )}
            {draft.status === 'active' && (
              <Button 
                variant="outline" 
                onClick={handleCompleteDraft}
              >
                End Draft
              </Button>
            )}
          </div>
        </div>
      </div>

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
        
        <TabsContent value="overview" className="space-y-4">
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
                  {draftPlayers.map(player => (
                    <div key={player.id} className="border rounded-md p-2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-mtg-purple text-white rounded-full flex items-center justify-center">
                        {player.name.charAt(0)}
                      </div>
                      <span className="truncate">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {draft.status !== 'pending' && (
            <Card>
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
          <TabsContent key={round.number} value={`round${round.number}`} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Round {round.number} Pairings</CardTitle>
                    <CardDescription>
                      {round.completed ? 'Completed' : 'In Progress'}
                    </CardDescription>
                  </div>
                  
                  {!round.completed && canCompleteRound(round.number) && (
                    <Button 
                      onClick={() => submitRoundResults(round.number)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Submit Round Results
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {round.matches.map(match => {
                    const player1 = getPlayerById(match.player1);
                    const player2 = getPlayerById(match.player2);
                    const player1Record = getDraftRecord(match.player1);
                    const player2Record = getDraftRecord(match.player2);
                    
                    const matchFromState = matches.find(m => m.id === match.id);
                    const matchResult = matchFromState?.result || 'pending';
                    const isEditable = isMatchEditable(match.id);
                    
                    const currentScores = roundResults[match.id] || { 
                      player1Score: matchFromState?.player1Score || 0, 
                      player2Score: matchFromState?.player2Score || 0
                    };
                    
                    return (
                      <Card key={match.id} className="border shadow-sm">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="mb-1">
                                <p className="font-medium">{player1.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {player1Record.wins}-{player1Record.losses}-{player1Record.draws}
                                </p>
                              </div>
                              {isEditable ? (
                                <div className="flex gap-2 justify-center mt-2">
                                  {[2, 1, 0].map((score) => (
                                    <Button
                                      key={score}
                                      variant={currentScores.player1Score === score ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleScoreChange(match.id, 'player1Score', score)}
                                    >
                                      {score}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-2xl font-bold mt-2">{matchFromState?.player1Score || 0}</p>
                              )}
                            </div>
                            
                            <div className="flex flex-col items-center justify-center">
                              {matchResult === 'pending' ? (
                                <p className="text-muted-foreground">vs</p>
                              ) : matchResult === 'player1Win' ? (
                                <div className="flex items-center">
                                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                  <p className="text-green-500 font-medium">Winner</p>
                                  <ArrowDown className="h-4 w-4 text-red-500 ml-4 mr-1" />
                                </div>
                              ) : matchResult === 'player2Win' ? (
                                <div className="flex items-center">
                                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                  <ArrowUp className="h-4 w-4 text-green-500 ml-4 mr-1" />
                                  <p className="text-green-500 font-medium">Winner</p>
                                </div>
                              ) : (
                                <div className="py-1 px-3 bg-gray-100 rounded text-sm">
                                  Draw
                                </div>
                              )}
                            </div>
                            
                            <div className="text-center">
                              <div className="mb-1">
                                <p className="font-medium">{player2.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {player2Record.wins}-{player2Record.losses}-{player2Record.draws}
                                </p>
                              </div>
                              {isEditable ? (
                                <div className="flex gap-2 justify-center mt-2">
                                  {[2, 1, 0].map((score) => (
                                    <Button
                                      key={score}
                                      variant={currentScores.player2Score === score ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handleScoreChange(match.id, 'player2Score', score)}
                                    >
                                      {score}
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-2xl font-bold mt-2">{matchFromState?.player2Score || 0}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {!round.completed && canCompleteRound(round.number) && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => submitRoundResults(round.number)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Submit Round Results
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="standings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Standings</CardTitle>
              <CardDescription>
                Player rankings for this draft
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Rank</th>
                      <th className="text-left py-2 px-4 font-medium">Player</th>
                      <th className="text-center py-2 px-4 font-medium">Wins</th>
                      <th className="text-center py-2 px-4 font-medium">Losses</th>
                      <th className="text-center py-2 px-4 font-medium">Draws</th>
                      <th className="text-center py-2 px-4 font-medium">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((player, index) => (
                      <tr key={player.id} className={index === 0 ? 'bg-accent/30' : ''}>
                        <td className="py-2 px-4">
                          {index === 0 ? (
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{index + 1}</span>
                            </div>
                          ) : (
                            index + 1
                          )}
                        </td>
                        <td className="py-2 px-4 font-medium">{player.name}</td>
                        <td className="text-center py-2 px-4">{player.draftWins}</td>
                        <td className="text-center py-2 px-4">{player.draftLosses}</td>
                        <td className="text-center py-2 px-4">{player.draftDraws}</td>
                        <td className="text-center py-2 px-4 font-bold">{player.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DraftDetail;
