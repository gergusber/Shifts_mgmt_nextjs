import { useQuery } from '@tanstack/react-query';
import type { Application } from '@/types';
import { queryKeys } from '@/lib/query-keys';

export function useApplications(userId?: string) {
  return useQuery({
    queryKey: queryKeys.applications.list(userId),
    queryFn: async (): Promise<Application[]> => {
      if (!userId) return [];

      const response = await fetch(`/api/applications?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      return response.json();
    },
    enabled: !!userId,
  });
}
