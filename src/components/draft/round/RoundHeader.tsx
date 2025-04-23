
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface RoundHeaderProps {
  roundNumber: number;
  completed: boolean;
  canSubmit: boolean;
  onSubmitRound: () => void;
}

export const RoundHeader = ({
  roundNumber,
  completed,
  canSubmit,
  onSubmitRound
}: RoundHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Round {roundNumber} Pairings</CardTitle>
        <CardDescription>
          {completed ? 'Completed' : 'In Progress'}
        </CardDescription>
      </div>
      
      {canSubmit && (
        <Button 
          onClick={onSubmitRound}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Submit Round Results
        </Button>
      )}
    </div>
  );
};
