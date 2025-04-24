import { Draft, Player } from '@/lib/types';
import { usePlayerContext } from '@/contexts/AppContext';
import { useRoundOperations } from './draft/useRoundOperations';
import { useDraftStandings } from './draft/useDraftStandings';
import { useDraftLifecycle } from './draft/useDraftLifecycle';
import { useRoundSubmission } from './draft/useRoundSubmission';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const useDraftDetail = (draft: Draft | undefined) => {
  const { players } = usePlayerContext();
  const [draftStats, setDraftStats] = useState<any[]>([]);
  
  useEffect(() => {
    if (draft?.id) {
      fetchDraftStats();
    }
  }, [draft?.id]);

  const fetchDraftStats = async () => {
    if (!draft?.id) return;

    const { data, error } = await supabase
      .from('player_draft_stats')
      .select('*')
      .eq('draft_id', draft.id);

    if (error) {
      console.error("Error fetching draft stats:", error);
      return;
    }

    setDraftStats(data);
  };

  const {
    roundResults,
    handleScoreChange,
    canCompleteRound,
    isMatchEditable
  } = useRoundOperations(draft);

  const getDraftRecord = (playerId: string) => {
    const stats = draftStats.find(s => s.player_id === playerId);
    return {
      wins: stats?.wins || 0,
      losses: stats?.losses || 0,
      draws: stats?.draws || 0
    };
  };

  const calculateStandings = (players: Player[]) => {
    return players
      .map(player => {
        const stats = draftStats.find(s => s.player_id === player.id) || {
          wins: 0,
          losses: 0,
          draws: 0,
          points: 0,
          match_win_percentage: 0,
          game_win_percentage: 0
        };
        
        return {
          ...player,
          draftWins: stats.wins,
          draftLosses: stats.losses,
          draftDraws: stats.draws,
          points: stats.points
        };
      })
      .sort((a, b) => b.points - a.points);
  };

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
