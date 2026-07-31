'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';

export interface PropertyFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  /** URL convenience: category name (e.g. "studio"). Resolved to categoryId client-side. */
  type?: string;
  page?: number;
}

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      // If a type name is given (from URL), resolve it to a categoryId first
      let resolvedCategoryId = filters.categoryId;

      if (filters.type && !filters.categoryId) {
        try {
          const catRes = await apiClient.get<ApiResponse<{ id: string; name: string }[]>>(
            '/api/categories',
          );
          const match = catRes.data.data.find(
            (c) => c.name.toLowerCase() === filters.type!.toLowerCase(),
          );
          if (match) resolvedCategoryId = match.id;
        } catch {
          // ignore — will fetch without category filter
        }
      }

      // Build clean params — never send `type` to the backend
      const params: Record<string, string | number | undefined> = {
        location:   filters.location   || undefined,
        minPrice:   filters.minPrice   || undefined,
        maxPrice:   filters.maxPrice   || undefined,
        categoryId: resolvedCategoryId || undefined,
        page:       filters.page       || undefined,
      };

      // Strip undefined values
      Object.keys(params).forEach(
        (k) => params[k] === undefined && delete params[k],
      );

      const res = await apiClient.get<ApiResponse<Property[]>>(
        '/api/properties',
        { params },
      );

      return res.data;
    },
  });
}
