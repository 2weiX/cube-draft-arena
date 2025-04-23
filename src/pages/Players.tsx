
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { User, UserPlus, Trophy } from 'lucide-react';

const Players = () => {
  const { players, addPlayer } = useAppContext();
  const [newPlayer, setNewPlayer] = useState({ name: '', username: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPlayer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.name) {
      addPlayer(newPlayer);
      setNewPlayer({ name: '', username: '' });
      setDialogOpen(false);
    }
  };

  return (
    <div className="container my-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Players</h1>
          <p className="text-muted-foreground">Manage and view all players</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add Player</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newPlayer.name} 
                  onChange={handleChange} 
                  placeholder="Player Name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username (Optional)</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={newPlayer.username} 
                  onChange={handleChange} 
                  placeholder="Username" 
                />
              </div>
              <Button type="submit" className="w-full">Add Player</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Player</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length > 0 ? players.sort((a, b) => a.ranking - b.ranking)[0].name : "N/A"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Matches Played</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {players.reduce((sum, player) => sum + player.wins + player.losses + player.draws, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Player Rankings</CardTitle>
          <CardDescription>View all players and their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Draws</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players
                .sort((a, b) => a.ranking - b.ranking)
                .map((player) => {
                  const totalMatches = player.wins + player.losses + player.draws;
                  const winRate = totalMatches > 0 ? ((player.wins / totalMatches) * 100).toFixed(1) : "0.0";
                  
                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">#{player.ranking}</TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell className="text-right">{player.wins}</TableCell>
                      <TableCell className="text-right">{player.losses}</TableCell>
                      <TableCell className="text-right">{player.draws}</TableCell>
                      <TableCell className="text-right">{winRate}%</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Players;
