import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';

interface WithdrawApplicationParams {
  applicationId: string;
  userId: string;
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId }: WithdrawApplicationParams) => {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'WITHDRAWN' }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw application');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.list(variables.userId),
      });
      toast.success('Application withdrawn successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to withdraw application');
    },
  });
}
