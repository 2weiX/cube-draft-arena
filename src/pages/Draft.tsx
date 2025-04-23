import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Grid2x2, Plus } from 'lucide-react';
import { Draft as DraftType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const Draft = () => {
  const { drafts, players, createDraft } = useAppContext();
  const [newDraft, setNewDraft] = useState<{
    name: string;
    description: string;
    cubeName: string;
    players: string[];
  }>({
    name: '',
    description: '',
    cubeName: '',
    players: [],
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
        return { ...prev, players: [...prev.players, playerId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDraft.name && newDraft.players.length === 8) {
      createDraft(newDraft);
      setNewDraft({ name: '', description: '', cubeName: '', players: [] });
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
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New Draft</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Draft</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Draft Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newDraft.name} 
                    onChange={handleChange} 
                    placeholder="Draft Name" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cubeName">Cube Name</Label>
                  <Input 
                    id="cubeName" 
                    name="cubeName" 
                    value={newDraft.cubeName} 
                    onChange={handleChange} 
                    placeholder="Enter CubeCobra cube name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newDraft.description} 
                    onChange={handleChange} 
                    placeholder="Draft Description" 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select 8 Players</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`player-${player.id}`}
                          checked={newDraft.players.includes(player.id)}
                          onCheckedChange={() => handlePlayerToggle(player.id)}
                          disabled={newDraft.players.length >= 8 && !newDraft.players.includes(player.id)}
                        />
                        <label 
                          htmlFor={`player-${player.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {player.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {newDraft.players.length}/8 players selected
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={newDraft.name === '' || newDraft.players.length !== 8}
                >
                  Create Draft
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>Create Draft</Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrafts.map(draft => (
            <Link key={draft.id} to={`/draft/${draft.id}`}>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Draft;
