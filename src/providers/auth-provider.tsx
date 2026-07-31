'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/features/auth/hooks/use-auth';
import { authCookies } from '@/lib/auth-cookies';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(authCookies.getAccessToken()),
  );

  useEffect(() => {
    const token = authCookies.getAccessToken();
    if (!token) return;

    apiClient
      .get<ApiResponse<User>>('/api/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => authCookies.clearTokens())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string, user: User) => {
      authCookies.setTokens(accessToken, refreshToken);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    authCookies.clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
