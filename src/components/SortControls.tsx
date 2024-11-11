import { Button } from "@/components/ui/button";
import { Calendar, Clock, SortAsc, SortDesc } from "lucide-react";
import { SortDirection, SortField } from "@/types/model";

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortControls({ sortField, sortDirection, onSort }: SortControlsProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant={sortField === 'date' ? 'default' : 'outline'}
        onClick={() => onSort('date')}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Date
        {sortField === 'date' && (
          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant={sortField === 'context' ? 'default' : 'outline'}
        onClick={() => onSort('context')}
        className="flex items-center gap-2"
      >
        <Clock className="h-4 w-4" />
        Context Length
        {sortField === 'context' && (
          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}