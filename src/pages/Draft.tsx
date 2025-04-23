import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDraftContext } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';
import { CreateDraftDialog } from '@/components/drafts/CreateDraftDialog';
import { DraftFilter } from '@/components/drafts/DraftFilter';
import { EmptyDraftState } from '@/components/drafts/EmptyDraftState';
import { DraftCard } from '@/components/drafts/DraftCard';

const Draft = () => {
  const { drafts, createDraft, deleteDraft } = useDraftContext();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredDrafts = drafts.filter(draft => {
    if (filter === 'active') return draft.status === 'active' || draft.status === 'pending';
    if (filter === 'completed') return draft.status === 'completed';
    return true;
  });

  return (
    <div className="container my-8 animate-fade-in">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Drafts</h1>
          <p className="text-muted-foreground">Manage and view all drafts</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <DraftFilter filter={filter} onFilterChange={setFilter} />
          <CreateDraftDialog trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Draft</span>
            </Button>
          } />
        </div>
      </div>

      {filteredDrafts.length === 0 ? (
        <EmptyDraftState onCreateClick={() => setDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrafts.map(draft => (
            <DraftCard 
              key={draft.id} 
              draft={draft} 
              onDelete={deleteDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Draft;
