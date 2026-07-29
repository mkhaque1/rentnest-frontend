'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';

export interface PropertyFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  type?: string;
  categoryId?: string;
  page?: number;
}

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>(
        '/api/properties',
        {
          params: filters,
        },
      );

      console.log('Fetched properties:', res.data);

      return res.data;
    },
  });
}
