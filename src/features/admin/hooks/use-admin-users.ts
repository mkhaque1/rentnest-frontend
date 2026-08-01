'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<User[]>>('/api/admin/users');
      return res.data.data;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'ACTIVE' | 'BANNED';
    }) => {
      const res = await apiClient.patch<ApiResponse<User>>(
        `/api/admin/users/${id}`,
        { status },
      );
      return res.data.data;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['admin', 'users'] });
      const previous = queryClient.getQueryData<User[]>(['admin', 'users']);
      queryClient.setQueryData<User[]>(['admin', 'users'], (old) =>
        old?.map((u) => (u.id === id ? { ...u, status } : u)),
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['admin', 'users'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
