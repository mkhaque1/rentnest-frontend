'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '../hooks/use-auth';
import { loginSchema, LoginInput } from '../schema/auth-schema';
import { ApiResponse } from '@/types/api';
import { AuthResult } from '@/types/user';
import { getApiErrorMessage } from '@/lib/api-error';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<ApiResponse<AuthResult>>(
        '/api/auth/login',
        values,
      );
      const { accessToken, refreshToken, user } = res.data.data;
      login(accessToken, refreshToken, user);
      toast.success('Welcome back');

      const redirectTo = searchParams.get('redirect');
      const redirectMap = {
        TENANT: '/dashboard/tenant',
        LANDLORD: '/dashboard/landlord',
        ADMIN: '/dashboard/admin',
      };

      router.push(redirectTo || redirectMap[user.role]);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' {...register('email')} />
        {errors.email && (
          <p className='text-caption text-destructive'>
            {errors.email.message}
          </p>
        )}
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' type='password' {...register('password')} />
        {errors.password && (
          <p className='text-caption text-destructive'>
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
