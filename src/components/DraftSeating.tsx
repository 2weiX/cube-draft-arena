
import { usePlayerContext, useDraftContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DraftSeatingProps {
  draftId: string;
}

export const DraftSeating = ({ draftId }: DraftSeatingProps) => {
  const { drafts } = useDraftContext();
  const { players } = usePlayerContext();
  const draft = drafts.find(d => d.id === draftId);
  
  if (!draft) return null;
  
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player?.name || 'Unknown Player';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seating Arrangement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square max-w-xl mx-auto">
          {/* Table outline */}
          <div className="absolute inset-[15%] border-4 border-gray-300 rounded-full" />
          
          {/* Players */}
          {draft.seating.map((playerId, index) => {
            const totalPlayers = draft.seating.length;
            const angle = (index * (360 / totalPlayers) - 90) * (Math.PI / 180);
            const radius = 42; // percentage from center
            
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            
            return (
              <div
                key={playerId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              >
                <div className="text-sm font-medium text-center">
                  {getPlayerName(playerId)}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Seat {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
