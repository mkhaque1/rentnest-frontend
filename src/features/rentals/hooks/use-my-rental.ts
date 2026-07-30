'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RentalRequest } from '@/types/rental';

export function useMyRentals() {
  return useQuery({
    queryKey: ['rentals', 'mine'],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<RentalRequest[]>>('/api/rentals');
      return res.data.data;
    },
  });
}
