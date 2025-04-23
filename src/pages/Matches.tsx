import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { Match, Player } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Matches = () => {
  const { matches } = useMatchContext();
  const { players } = usePlayerContext();
  const { drafts } = useDraftContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Get player by ID
  const getPlayerById = (id: string): Player | undefined => {
    return players.find(player => player.id === id);
  };

  // Get draft name by ID
  const getDraftNameById = (id: string): string => {
    const draft = drafts.find(draft => draft.id === id);
    return draft ? draft.name : 'Unknown Draft';
  };

  const getMatchResult = (match: Match): JSX.Element => {
    if (match.result === 'pending') {
      return <Badge variant="outline">Pending</Badge>;
    } else if (match.result === 'player1Win') {
      return <Badge variant="default">Player 1 Win</Badge>;
    } else if (match.result === 'player2Win') {
      return <Badge variant="default">Player 2 Win</Badge>;
    } else {
      return <Badge variant="secondary">Draw</Badge>;
    }
  };

  // Filter matches
  const filteredMatches = matches.filter(match => {
    if (filter === 'pending') return match.result === 'pending';
    if (filter === 'completed') return match.result !== 'pending';
    return true;
  });

  // Sort matches by date (newest first)
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container my-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Matches</h1>
          <p className="text-muted-foreground">View all draft matches</p>
        </div>
        <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'completed') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter matches" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.filter(m => m.result === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {matches.filter(m => m.result !== 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {sortedMatches.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No matches found</p>
            </CardContent>
          </Card>
        ) : (
          sortedMatches.map(match => {
            const player1 = getPlayerById(match.player1);
            const player2 = getPlayerById(match.player2);
            const draftName = getDraftNameById(match.draftId);
            
            return (
              <Link key={match.id} to={`/draft/${match.draftId}`} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="md:w-1/3">
                        <p className="text-sm text-muted-foreground">Draft</p>
                        <h4 className="font-medium truncate">{draftName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Round {match.round}</Badge>
                          {getMatchResult(match)}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                        <div className="sm:w-1/3 min-w-[100px]">
                          <p className="font-medium truncate">{player1?.name || "Unknown"}</p>
                          <p className="text-2xl font-bold mt-1">{match.player1Score}</p>
                        </div>
                        
                        <div className="sm:w-1/3 text-muted-foreground">vs</div>
                        
                        <div className="sm:w-1/3 min-w-[100px]">
                          <p className="font-medium truncate">{player2?.name || "Unknown"}</p>
                          <p className="text-2xl font-bold mt-1">{match.player2Score}</p>
                        </div>
                      </div>
                      
                      <div className="md:w-1/5 text-center md:text-right text-sm text-muted-foreground">
                        {match.completedAt ? (
                          <span>Completed {new Date(match.completedAt).toLocaleDateString()}</span>
                        ) : (
                          <span>Created {new Date(match.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Matches;
