
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Grid2x2 } from 'lucide-react';

interface EmptyDraftStateProps {
  onCreateClick: () => void;
}

export const EmptyDraftState = ({ onCreateClick }: EmptyDraftStateProps) => {
  return (
    <Card className="text-center py-10">
      <CardContent>
        <div className="flex justify-center mb-4">
          <Grid2x2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Drafts Found</h3>
        <p className="text-muted-foreground mb-4">Create your first draft to get started</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={onCreateClick}>Create Draft</Button>
          </DialogTrigger>
        </Dialog>
      </CardContent>
    </Card>
  );
};
