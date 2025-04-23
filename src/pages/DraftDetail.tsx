import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { DraftHeader } from '@/components/draft/DraftHeader';
import { RoundContent } from '@/components/draft/RoundContent';
import { DraftStandings } from '@/components/draft/DraftStandings';
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
