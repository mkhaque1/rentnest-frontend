'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Payment } from '@/types/payment';

export function useMyPayments() {
  return useQuery({
    queryKey: ['payments', 'mine'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Payment[]>>('/api/payments');
      return res.data.data;
    },
  });
}
