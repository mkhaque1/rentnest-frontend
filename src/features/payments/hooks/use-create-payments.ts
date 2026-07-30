'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';

interface CreatePaymentResult {
  checkoutUrl: string;
  payment: { id: string };
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (rentalRequestId: string) => {
      const res = await apiClient.post<ApiResponse<CreatePaymentResult>>(
        '/api/payments/create',
        {
          rentalRequestId,
        },
      );
      return res.data.data;
    },
  });
}
