'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface CreateReviewPayload {
  rentalRequestId: string;
  rating: number;
  comment: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const res = await apiClient.post<ApiResponse<unknown>>(
        '/api/reviews',
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals', 'mine'] });
    },
  });
}
