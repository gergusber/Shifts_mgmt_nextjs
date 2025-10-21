/**
 * Centralized query key factory for React Query
 * Following TanStack Query best practices for query key management
 * @see https://tanstack.com/query/latest/docs/react/community/lukemorales-query-key-factory
 */

export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Shifts
  shifts: {
    all: ['shifts'] as const,
    lists: () => [...queryKeys.shifts.all, 'list'] as const,
    list: (filters?: { userId?: string; status?: string }) =>
      [...queryKeys.shifts.lists(), filters] as const,
    details: () => [...queryKeys.shifts.all, 'detail'] as const,
    detail: (id: string, userId?: string) =>
      [...queryKeys.shifts.details(), id, { userId }] as const,
  },

  // Applications
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (userId?: string) =>
      [...queryKeys.applications.lists(), { userId }] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
  },
} as const;
