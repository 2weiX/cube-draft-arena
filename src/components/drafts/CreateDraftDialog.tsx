
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlayerContext, useDraftContext } from "@/contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface CreateDraftDialogProps {
  trigger?: React.ReactNode;
}

export const CreateDraftDialog = ({ trigger }: CreateDraftDialogProps) => {
  const navigate = useNavigate();
  const { players } = usePlayerContext();
  const { createDraft } = useDraftContext();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [cubeName, setCubeName] = useState("");
  const [rounds, setRounds] = useState<3 | 4>(3);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(current => {
      const exists = current.includes(playerId);
      if (exists) {
        return current.filter(id => id !== playerId);
      } else {
        if (current.length >= 8) return current;
        return [...current, playerId];
      }
    });
  };

  const isValidPlayerCount = selectedPlayers.length === 4 || selectedPlayers.length === 6 || selectedPlayers.length === 8;
  
  const handleCreateDraft = () => {
    if (isValidPlayerCount) {
      const draft = createDraft({
        name: cubeName || "Unnamed Draft",
        description: `${rounds} round draft`,
        cubeName: cubeName || undefined,
        players: selectedPlayers,
        totalRounds: rounds,
        currentRound: 0
      });
      
      setSelectedPlayers([]);
      setCubeName("");
      setDialogOpen(false);
      
      toast({
        title: "Draft Created",
        description: `Draft has been created successfully.`
      });
      
      if (draft && draft.id) {
        navigate(`/draft/${draft.id}`);
      }
    }
  };

  const defaultTrigger = (
    <Button size="lg" className="gap-2">
      <Plus className="h-4 w-4" />
      Start New Draft
    </Button>
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
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
              <Label htmlFor="cube">Cube Name (Optional)</Label>
              <Input
                id="cube"
                value={cubeName}
                onChange={(e) => setCubeName(e.target.value)}
                placeholder="Enter CubeCobra cube name (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Rounds</Label>
              <div className="flex gap-4">
                <Button
                  variant={rounds === 3 ? "default" : "outline"}
                  onClick={() => setRounds(3)}
                  type="button"
                >
                  3 Rounds
                </Button>
                <Button
                  variant={rounds === 4 ? "default" : "outline"}
                  onClick={() => setRounds(4)}
                  type="button"
                >
                  4 Rounds
                </Button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            disabled={!isValidPlayerCount}
            onClick={handleCreateDraft}
          >
            Create Draft
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
