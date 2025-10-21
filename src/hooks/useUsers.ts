import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types';
import { queryKeys } from '@/lib/query-keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.lists(),
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}
