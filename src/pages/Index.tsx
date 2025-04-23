
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { Link } from "react-router-dom";
import { Trophy, Users, Grid2x2 } from "lucide-react";

const Index = () => {
  const { drafts, players } = useAppContext();
  const activeOrPendingDrafts = drafts.filter(draft => draft.status !== 'completed');
  const completedDrafts = drafts.filter(draft => draft.status === 'completed');

  return (
    <div className="container my-8 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-mtg-purple to-mtg-darkblue">
          Cube Draft Arena
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Organize and track your Magic: The Gathering cube drafts with easy pairing, 
          match tracking, and player rankings.
        </p>
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
              <CardTitle>Drafts</CardTitle>
              <CardDescription>Manage Drafts</CardDescription>
            </div>
            <Grid2x2 className="h-8 w-8 text-mtg-blue" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{drafts.length}</p>
            <p className="text-muted-foreground">total drafts</p>
          </CardContent>
          <CardFooter>
            <Link to="/draft" className="w-full">
              <Button className="w-full">View Drafts</Button>
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
      </div>

      {activeOrPendingDrafts.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Drafts</h2>
            <Link to="/draft">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeOrPendingDrafts.map(draft => (
              <Link to={`/draft/${draft.id}`} key={draft.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{draft.name}</CardTitle>
                    <CardDescription>
                      {draft.status === 'active' ? 'In Progress' : 'Pending'}
                    </CardDescription>
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

      {completedDrafts.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Completed Drafts</h2>
            <Link to="/draft">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedDrafts.slice(0, 2).map(draft => (
              <Link to={`/draft/${draft.id}`} key={draft.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{draft.name}</CardTitle>
                    <CardDescription>Completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {draft.completedAt && new Date(draft.completedAt).toLocaleDateString()}
                    </p>
                    {draft.description && <p className="mt-2">{draft.description}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
