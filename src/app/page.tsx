'use client';

import { useState, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useShifts } from '@/hooks/useShifts';
import { ShiftCard } from '@/components/shifts/ShiftCard';
import { ShiftFilters } from '@/components/shifts/ShiftFilters';
import { Skeleton } from '@/components/ui/skeleton';
import type { Shift } from '@/types';

export default function Home() {
  const { currentUser } = useUser();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  const { data: shifts, isLoading, error } = useShifts({
    userId: currentUser?.id,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  // Client-side sorting
  const sortedShifts = useMemo(() => {
    if (!shifts) return [];

    const sorted = [...shifts];

    switch (sortBy) {
      case 'date-asc':
        return sorted.sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );
      case 'date-desc':
        return sorted.sort(
          (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
        );
      case 'rate-asc':
        return sorted.sort((a, b) => a.hourlyRateCents - b.hourlyRateCents);
      case 'rate-desc':
        return sorted.sort((a, b) => b.hourlyRateCents - a.hourlyRateCents);
      default:
        return sorted;
    }
  }, [shifts, sortBy]);

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive">Error Loading Shifts</h2>
          <p className="mt-2 text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load shifts'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Shifts</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and apply to healthcare shifts
        </p>
      </div>

      <ShiftFilters
        status={statusFilter}
        sortBy={sortBy}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : sortedShifts && sortedShifts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No shifts available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {statusFilter !== 'all'
                ? 'No shifts match your filters'
                : 'Check back later for new opportunities'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
