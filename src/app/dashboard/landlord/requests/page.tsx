'use client';

import Link from 'next/link';
import { Check, X, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { RentalStatusBadge } from '@/features/rentals/components/status-badge';
import { useLandlordRentals } from '@/features/rentals/hooks/use-landlord-rentals';
import { useUpdateRentalStatus } from '@/features/rentals/hooks/use-update-rental-status';
import { getApiErrorMessage } from '@/lib/api-error';

export default function LandlordRequestsPage() {
  const { data: rentals, isLoading } = useLandlordRentals();
  const { mutate: updateStatus, isPending } = useUpdateRentalStatus();

  function handleApprove(id: string) {
    updateStatus(
      { id, status: 'APPROVED' },
      {
        onSuccess: () => toast.success('Request approved'),
        onError: (err: unknown) =>
          toast.error(getApiErrorMessage(err, 'Failed to approve')),
      },
    );
  }

  function handleReject(id: string) {
    updateStatus(
      { id, status: 'REJECTED' },
      {
        onSuccess: () => toast.success('Request rejected'),
        onError: (err: unknown) =>
          toast.error(getApiErrorMessage(err, 'Failed to reject')),
      },
    );
  }

  function handleMarkCompleted(id: string) {
    updateStatus(
      { id, status: 'COMPLETED' },
      {
        onSuccess: () => toast.success('Rental marked as completed'),
        onError: (err: unknown) =>
          toast.error(getApiErrorMessage(err, 'Failed to update')),
      },
    );
  }

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-5xl px-6 py-12 min-h-[60vh]'>
        <h1 className='text-display text-3xl mb-1'>Rental requests</h1>
        <p className='text-body mb-8'>Manage requests for your properties</p>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-xl mb-3' />
          ))}

        {!isLoading && rentals?.length === 0 && (
          <EmptyState message='No rental requests yet.' />
        )}

        <div className='space-y-3'>
          {rentals?.map((rental) => (
            <div
              key={rental.id}
              className='flex items-center justify-between rounded-xl border border-border bg-card surface-edge p-5'
            >
              <div>
                <Link
                  href={`/properties/${rental.propertyId}`}
                  className='text-heading text-base hover:underline'
                >
                  {rental.property.title}
                </Link>
                <div className='flex items-center gap-1.5 text-caption text-muted-foreground mt-1'>
                  <MapPin className='h-3.5 w-3.5' />
                  {rental.property.location}
                </div>
                <p className='text-caption text-muted-foreground mt-1'>
                  Move-in: {new Date(rental.moveInDate).toLocaleDateString()}
                </p>
                {rental.message && (
                  <p className='text-body text-sm mt-2 italic'>
                    &quot;{rental.message}&quot;
                  </p>
                )}
              </div>

              <div className='flex items-center gap-3'>
                <RentalStatusBadge status={rental.status} />

                {rental.status === 'PENDING' && (
                  <div className='flex gap-2'>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => handleReject(rental.id)}
                      disabled={isPending}
                    >
                      <X className='h-4 w-4 text-destructive' />
                    </Button>
                    <Button
                      size='icon'
                      onClick={() => handleApprove(rental.id)}
                      disabled={isPending}
                    >
                      <Check className='h-4 w-4' />
                    </Button>
                  </div>
                )}

                {rental.status === 'ACTIVE' && (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleMarkCompleted(rental.id)}
                    disabled={isPending}
                  >
                    Mark completed
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
