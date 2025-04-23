
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDraftContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { DraftHeader } from '@/components/draft/DraftHeader';
import { RoundContent } from '@/components/draft/RoundContent';
import { DraftStandings } from '@/components/draft/DraftStandings';
import { DraftSeating } from '@/components/DraftSeating';
import { DraftOverview } from '@/components/draft/DraftOverview';
import { useDraftDetail } from '@/hooks/useDraftDetail';

const DraftDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drafts, setCurrentDraft } = useDraftContext();
  const draft = drafts.find(d => d.id === id);

  const {
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
  } = useDraftDetail(draft);

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

  const standings = calculateStandings(draftPlayers);

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
          <DraftOverview 
            draft={draft}
            draftPlayers={draftPlayers}
            standings={standings}
            getDraftRecord={getDraftRecord}
          />
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
