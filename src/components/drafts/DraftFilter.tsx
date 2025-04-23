
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DraftFilterProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (value: 'all' | 'active' | 'completed') => void;
}

export const DraftFilter = ({ filter, onFilterChange }: DraftFilterProps) => {
  return (
    <Select value={filter} onValueChange={onFilterChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter drafts" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All Drafts</SelectItem>
          <SelectItem value="active">Active & Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
