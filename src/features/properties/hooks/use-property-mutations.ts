'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';

interface PropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  type: string;
  categoryId: string;
  amenities?: string[];
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PropertyPayload) => {
      const res = await apiClient.post<ApiResponse<Property>>(
        '/api/properties',
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'mine'] });
    },
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PropertyPayload>) => {
      const res = await apiClient.patch<ApiResponse<Property>>(
        `/api/properties/${id}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'mine'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'mine'] });
    },
  });
}
