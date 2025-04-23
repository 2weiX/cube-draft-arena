import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Draft } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DraftCardProps {
  draft: Draft;
  onDelete: (id: string) => void;
}

export const DraftCard = ({ draft, onDelete }: DraftCardProps) => {
  const getDraftStatusBadge = (draft: Draft) => {
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
    <div className="relative">
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
              className="absolute top-2 right-2 z-10 hover:bg-destructive/10"
              onClick={(e) => e.preventDefault()}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Draft</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {draft.name}? This will remove the draft history but preserve player records. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(draft.id);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Draft
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
