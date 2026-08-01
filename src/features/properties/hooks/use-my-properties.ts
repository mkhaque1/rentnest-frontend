'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';

export function useMyProperties() {
  return useQuery({
    queryKey: ['properties', 'mine'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>(
        '/api/properties/my/listings',
      );
      return res.data.data;
    },
  });
}
