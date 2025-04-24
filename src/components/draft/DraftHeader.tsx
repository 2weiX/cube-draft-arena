
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Draft } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface DraftHeaderProps {
  draft: Draft;
  onStartDraft: () => void;
  onCompleteDraft: () => void;
}

export const DraftHeader = ({ draft, onStartDraft, onCompleteDraft }: DraftHeaderProps) => {
  const handleStartDraftClick = () => {
    onStartDraft();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Link to="/draft" className="hover:underline">
          Drafts
        </Link>
        <span>/</span>
        <span className="truncate">{draft.name}</span>
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{draft.name}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={
              draft.status === 'pending' ? 'secondary' : 
              draft.status === 'active' ? 'default' : 
              'outline'
            }>
              {draft.status === 'pending' ? 'Pending' : 
               draft.status === 'active' ? 'Active' : 
               'Completed'}
            </Badge>
            <p className="text-muted-foreground">
              {draft.players.length} players
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {draft.status === 'pending' && (
            <Button onClick={handleStartDraftClick}>
              Start Draft
            </Button>
          )}
          {draft.status === 'active' && (
            <Button 
              variant="outline" 
              onClick={onCompleteDraft}
            >
              End Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
