'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ShiftFiltersProps {
  status: string;
  sortBy: string;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function ShiftFilters({
  status,
  sortBy,
  onStatusChange,
  onSortChange,
}: ShiftFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="status-filter">Filter by Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status-filter" className="w-full sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="HIRED">Hired</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="sort-by">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort-by" className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Earliest First)</SelectItem>
            <SelectItem value="date-desc">Date (Latest First)</SelectItem>
            <SelectItem value="rate-asc">Rate (Low to High)</SelectItem>
            <SelectItem value="rate-desc">Rate (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
