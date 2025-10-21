import { useQuery } from '@tanstack/react-query';
import type { Shift } from '@/types';
import { queryKeys } from '@/lib/query-keys';

interface UseShiftsOptions {
  userId?: string;
  status?: string;
}

export function useShifts({ userId, status }: UseShiftsOptions = {}) {
  return useQuery({
    queryKey: queryKeys.shifts.list({ userId, status }),
    queryFn: async (): Promise<Shift[]> => {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (status) params.append('status', status);

      const response = await fetch(`/api/shifts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shifts');
      }
      return response.json();
    },
  });
}
