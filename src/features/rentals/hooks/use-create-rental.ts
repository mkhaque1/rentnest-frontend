'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RentalRequest } from '@/types/rental';

interface CreateRentalPayload {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRentalPayload) => {
      const res = await apiClient.post<ApiResponse<RentalRequest>>(
        '/api/rentals',
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals', 'mine'] });
    },
  });
}
