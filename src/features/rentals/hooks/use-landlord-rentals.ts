'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RentalRequest } from '@/types/rental';

export function useLandlordRentals() {
  return useQuery({
    queryKey: ['rentals', 'landlord'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<RentalRequest[]>>(
        '/api/rentals/landlord/requests',
      );
      return res.data.data;
    },
  });
}
