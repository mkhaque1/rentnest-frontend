'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RentalRequest } from '@/types/rental';
import { useCreatePayment } from '@/features/payments/hooks/use-create-payments';

export default function PayForRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { mutate, isPending } = useCreatePayment();

  const { data: rental, isLoading } = useQuery({
    queryKey: ['rentals', id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<RentalRequest>>(
        `/api/rentals/${id}`,
      );
      return res.data.data;
    },
  });

  function handlePay() {
    mutate(id, {
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Could not start payment');
      },
    });
  }

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-lg px-6 py-16 min-h-[60vh]'>
        {isLoading && <Skeleton className='h-56 rounded-xl' />}

        {rental && (
          <div className='rounded-xl border border-border bg-card surface-edge p-8 space-y-6'>
            <div>
              <h1 className='text-heading text-xl'>Complete your payment</h1>
              <p className='text-body text-sm mt-1'>
                {rental.property.title} — {rental.property.location}
              </p>
            </div>

            <div className='flex items-baseline gap-1'>
              <span className='text-display text-3xl'>
                ${rental.property.price.toLocaleString()}
              </span>
              <span className='text-muted-foreground text-caption'>/mo</span>
            </div>

            <Button
              className='w-full'
              size='lg'
              onClick={handlePay}
              disabled={isPending}
            >
              {isPending ? 'Redirecting...' : 'Pay with Stripe'}
            </Button>

            <p className='text-caption text-muted-foreground text-center'>
              You&apos;ll be redirected to Stripe&apos;s secure checkout
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
