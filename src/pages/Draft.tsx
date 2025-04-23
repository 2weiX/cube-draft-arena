
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Grid2x2, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Draft as DraftType } from '@/lib/types';
import { CreateDraftDialog } from '@/components/drafts/CreateDraftDialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog';

const Draft = () => {
  const { drafts, players, createDraft, deleteDraft } = useAppContext();
  const [newDraft, setNewDraft] = useState<{
    name: string;
    description: string;
    cubeName: string;
    players: string[];
    totalRounds: 3 | 4;
    currentRound: number;
  }>({
    name: '',
    description: '',
    cubeName: '',
    players: [],
    totalRounds: 3,
    currentRound: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDraft(prev => ({ ...prev, [name]: value }));
  };

  const handlePlayerToggle = (playerId: string) => {
    setNewDraft(prev => {
      const exists = prev.players.includes(playerId);
      if (exists) {
        return { ...prev, players: prev.players.filter(id => id !== playerId) };
      } else {
        const currentCount = prev.players.length;
        if (currentCount >= 8 && !exists) return prev; // Maximum 8 players
        return { ...prev, players: [...prev.players, playerId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playerCount = newDraft.players.length;
    if (newDraft.name && (playerCount === 4 || playerCount === 6 || playerCount === 8)) {
      createDraft(newDraft);
      setNewDraft({ 
        name: '', 
        description: '', 
        cubeName: '', 
        players: [], 
        totalRounds: 3, 
        currentRound: 0 
      });
      setDialogOpen(false);
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    if (filter === 'active') return draft.status === 'active' || draft.status === 'pending';
    if (filter === 'completed') return draft.status === 'completed';
    return true;
  });

  const getDraftStatusBadge = (draft: DraftType) => {
    switch (draft.status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  const getCubeCobraLink = (cubeName: string) => {
    if (!cubeName) return null;
    const normalizedCubeName = cubeName.trim().toLowerCase().replace(/\s+/g, '-');
    return `https://cubecobra.com/cube/overview/${normalizedCubeName}`;
  };

  return (
    <div className="container my-8 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Drafts</h1>
          <p className="text-muted-foreground">Manage and view all drafts</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Select value={filter} onValueChange={(value: 'all' | 'active' | 'completed') => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter drafts" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Drafts</SelectItem>
                <SelectItem value="active">Active & Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <CreateDraftDialog trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Draft</span>
            </Button>
          } />
        </div>
      </div>

      {filteredDrafts.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <div className="flex justify-center mb-4">
              <Grid2x2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Drafts Found</h3>
            <p className="text-muted-foreground mb-4">Create your first draft to get started</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setDialogOpen(true)}>Create Draft</Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrafts.map(draft => (
            <div key={draft.id} className="relative">
              <Link to={`/draft/${draft.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="max-w-[80%]">{draft.name}</CardTitle>
                      {getDraftStatusBadge(draft)}
                    </div>
                    <CardDescription>
                      {draft.players.length} players
                      {draft.startedAt && ` • Started on ${new Date(draft.startedAt).toLocaleDateString()}`}
                      {draft.cubeName && (
                        <>
                          <br />
                          <a 
                            href={getCubeCobraLink(draft.cubeName)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View cube on CubeCobra
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 7h10v10" />
                              <path d="M7 17 17 7" />
                            </svg>
                          </a>
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {draft.description && <p className="mb-4">{draft.description}</p>}
                    <div className="flex gap-1 flex-wrap">
                      {draft.rounds.length > 0 ? (
                        <Badge variant="outline" className="mr-2">
                          Round {draft.rounds.length}/3
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mr-2">Not started</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              {draft.status === 'completed' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {draft.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          deleteDraft(draft.id);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Draft;
