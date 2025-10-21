import { useQuery } from '@tanstack/react-query';
import type { Shift } from '@/types';
import { queryKeys } from '@/lib/query-keys';

export function useShift(shiftId: string, userId?: string) {
  return useQuery({
    queryKey: queryKeys.shifts.detail(shiftId, userId),
    queryFn: async (): Promise<Shift> => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/shifts/${shiftId}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shift');
      }
      return response.json();
    },
    enabled: !!shiftId,
  });
}
