
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Draft, Player } from '@/lib/types';

interface DraftOverviewProps {
  draft: Draft;
  draftPlayers: Player[];
  standings: Player[];
  getDraftRecord: (playerId: string) => { wins: number; losses: number; draws: number };
}

export const DraftOverview = ({ draft, draftPlayers, standings, getDraftRecord }: DraftOverviewProps) => {
  return (
    <>
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
                        {getDraftRecord(player.id).wins}W - {getDraftRecord(player.id).losses}L - {getDraftRecord(player.id).draws}D
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">{(getDraftRecord(player.id).wins * 3) + getDraftRecord(player.id).draws} pts</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
