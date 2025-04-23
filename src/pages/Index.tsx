import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayerContext, useDraftContext } from '@/contexts/AppContext';
import { Link } from "react-router-dom";
import { Grid2x2, Trophy, Users } from "lucide-react";
import { CreateDraftDialog } from "@/components/drafts/CreateDraftDialog";

const Index = () => {
  const { drafts } = useDraftContext();
  const { players } = usePlayerContext();
  const currentDraft = drafts.find(draft => draft.status === 'active');
  
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
            <CreateDraftDialog />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
