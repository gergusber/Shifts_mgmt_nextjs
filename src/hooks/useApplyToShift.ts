import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Application } from '@/types';
import { queryKeys } from '@/lib/query-keys';

interface ApplyToShiftParams {
  shiftId: string;
  userId: string;
}

export function useApplyToShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shiftId,
      userId,
    }: ApplyToShiftParams): Promise<Application> => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftId, userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to apply to shift');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.list(variables.userId),
      });
      toast.success('Successfully applied to shift!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to apply to shift');
    },
  });
}
