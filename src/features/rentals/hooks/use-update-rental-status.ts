'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RentalRequest, RentalStatus } from '@/types/rental';

interface UpdateStatusPayload {
  id: string;
  status: RentalStatus;
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusPayload) => {
      const res = await apiClient.patch<ApiResponse<RentalRequest>>(
        `/api/rentals/landlord/requests/${id}`,
        { status },
      );
      return res.data.data;
    },

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['rentals', 'landlord'] });

      const previous = queryClient.getQueryData<RentalRequest[]>([
        'rentals',
        'landlord',
      ]);

      queryClient.setQueryData<RentalRequest[]>(
        ['rentals', 'landlord'],
        (old) => old?.map((r) => (r.id === id ? { ...r, status } : r)),
      );

      return { previous };
    },

    onError: (err: unknown, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['rentals', 'landlord'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals', 'landlord'] });
    },
  });
}
