'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '../hooks/use-auth';
import { registerSchema, RegisterInput } from '../schema/auth-schema';
import { ApiResponse } from '@/types/api';
import { AuthResult } from '@/types/user';
import { getApiErrorMessage } from '@/lib/api-error';

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterInput) {
    setIsSubmitting(true);
    try {
      const res = await apiClient.post<ApiResponse<AuthResult>>(
        '/api/auth/register',
        values,
      );
      const { accessToken, refreshToken, user } = res.data.data;
      login(accessToken, refreshToken, user);
      toast.success('Account created successfully');
      router.push(
        user.role === 'LANDLORD' ? '/dashboard/landlord' : '/dashboard/tenant',
      );
    } catch (err: unknown) {
      const message = getApiErrorMessage(
        err,
        'Something went wrong. Please try again.',
      );
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-1.5 flex justify-between items-center flex-col gap-2'>
        <Label htmlFor='role'>Choose your role</Label>
        <Select
          onValueChange={(value) =>
            setValue('role', value as 'TENANT' | 'LANDLORD')
          }
        >
          <SelectTrigger id='role'>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='TENANT'>Tenant — looking for a place</SelectItem>
            <SelectItem value='LANDLORD'>
              Landlord — listing a property
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className='text-caption text-destructive'>{errors.role.message}</p>
        )}
      </div>
      <div className='space-y-1.5'>
        <Label htmlFor='name'>Full name</Label>
        <Input id='name' {...register('name')} />
        {errors.name && (
          <p className='text-caption text-destructive'>{errors.name.message}</p>
        )}
      </div>

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
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
