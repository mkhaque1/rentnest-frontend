'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';
import { RentalRequest } from '@/types/rental';

export function useAdminProperties() {
  return useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>(
        '/api/admin/properties',
      );
      return res.data.data;
    },
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: ['admin', 'rentals'],
    queryFn: async () => {
      const res =
        await apiClient.get<ApiResponse<RentalRequest[]>>('/api/admin/rentals');
      return res.data.data;
    },
  });
}
