'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

export interface PropertyReviewItem {
  id: string;
  rentalRequestId: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  tenant: { id: string; name: string };
}

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: ['reviews', 'property', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<PropertyReviewItem[]>>(
        `/api/reviews/property/${propertyId}`,
      );
      return res.data.data;
    },
  });
}
