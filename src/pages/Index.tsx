import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { Plus, Grid2x2, Trophy, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Index = () => {
  const { drafts, players } = useAppContext();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [cubeName, setCubeName] = useState("");
  const [rounds, setRounds] = useState<3 | 4>(3);
  const currentDraft = drafts.find(draft => draft.status === 'active');
  const completedDrafts = drafts.filter(draft => draft.status === 'completed');
  
  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(current => {
      const exists = current.includes(playerId);
      if (exists) {
        return current.filter(id => id !== playerId);
      } else {
        if (current.length >= 8) return current; // Maximum 8 players
        return [...current, playerId];
      }
    });
  };

  const isValidPlayerCount = selectedPlayers.length === 4 || selectedPlayers.length === 6 || selectedPlayers.length === 8;
  
  return (
    <div className="container my-8 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-mtg-purple to-mtg-darkblue">
          A Cube Draft
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Players</CardTitle>
              <CardDescription>Manage Players</CardDescription>
            </div>
            <Users className="h-8 w-8 text-mtg-purple" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{players.length}</p>
            <p className="text-muted-foreground">registered players</p>
          </CardContent>
          <CardFooter>
            <Link to="/players" className="w-full">
              <Button className="w-full">View Players</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rankings</CardTitle>
              <CardDescription>Player Rankings</CardDescription>
            </div>
            <Trophy className="h-8 w-8 text-mtg-red" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{players.length > 0 ? players[0].name : "No players"}</p>
            <p className="text-muted-foreground">current top player</p>
          </CardContent>
          <CardFooter>
            <Link to="/rankings" className="w-full">
              <Button className="w-full">View Rankings</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>All Drafts</CardDescription>
            </div>
            <Grid2x2 className="h-8 w-8 text-mtg-blue" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{drafts.length}</p>
            <p className="text-muted-foreground">total drafts</p>
          </CardContent>
          <CardFooter>
            <Link to="/draft" className="w-full">
              <Button className="w-full">View All Drafts</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 space-y-12">
        {currentDraft ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Current Draft</h2>
            <Link to={`/draft/${currentDraft.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{currentDraft.name}</CardTitle>
                  <CardDescription>In Progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{currentDraft.players.length} players</p>
                  {currentDraft.description && <p className="mt-2">{currentDraft.description}</p>}
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">No Active Draft</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Start New Draft
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create New Draft</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Players ({selectedPlayers.length}/8)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                        {players.map(player => (
                          <Button
                            key={player.id}
                            variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                            className="w-full"
                            onClick={() => togglePlayer(player.id)}
                            disabled={selectedPlayers.length >= 8 && !selectedPlayers.includes(player.id)}
                          >
                            {player.name}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {isValidPlayerCount ? 'Valid player count' : 'Select 4, 6, or 8 players'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cube">Cube Name</Label>
                      <Input
                        id="cube"
                        value={cubeName}
                        onChange={(e) => setCubeName(e.target.value)}
                        placeholder="Enter CubeCobra cube name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Rounds</Label>
                      <div className="flex gap-4">
                        <Button
                          variant={rounds === 3 ? "default" : "outline"}
                          onClick={() => setRounds(3)}
                        >
                          3 Rounds
                        </Button>
                        <Button
                          variant={rounds === 4 ? "default" : "outline"}
                          onClick={() => setRounds(4)}
                        >
                          4 Rounds
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Link to="/draft" className="w-full block">
                    <Button 
                      className="w-full" 
                      disabled={!isValidPlayerCount || !cubeName}
                    >
                      Create Draft
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {completedDrafts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Past Drafts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedDrafts.map(draft => (
                <Link key={draft.id} to={`/draft/${draft.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{draft.name}</CardTitle>
                      <CardDescription>Completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{draft.players.length} players</p>
                      {draft.description && <p className="mt-2">{draft.description}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
