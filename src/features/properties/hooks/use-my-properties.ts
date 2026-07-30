'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function useMyProperties() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['properties', 'mine', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Property[]>>(
        '/api/properties',
        { params: { landlordId: user!.id, limit: 100 } },
      );
      // Belt-and-suspenders: filter client-side too in case backend ignores param
      return res.data.data.filter((p) => p.landlordId === user!.id);
    },
  });
}
