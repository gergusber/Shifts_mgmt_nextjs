import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query-keys';

interface CreateShiftParams {
  title: string;
  description?: string;
  facilityName: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  hourlyRate: string;
}

interface CreateShiftPayload {
  title: string;
  description?: string;
  facilityName: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  hourlyRateCents: number;
}

export function useCreateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateShiftParams): Promise<void> => {
      const payload: CreateShiftPayload = {
        title: data.title,
        description: data.description,
        facilityName: data.facilityName,
        location: data.location,
        hourlyRateCents: Math.round(parseFloat(data.hourlyRate) * 100),
        startsAt: new Date(data.startsAt).toISOString(),
        endsAt: new Date(data.endsAt).toISOString(),
      };

      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create shift');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all shifts queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts.all });
      toast.success('Shift created successfully!');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create shift');
    },
  });
}
