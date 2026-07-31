'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MyPropertyRow } from '@/features/properties/components/my-property-row';
import { useMyProperties } from '@/features/properties/hooks/use-my-properties';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useMyProperties();

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-5xl px-6 py-12 min-h-[60vh]'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-display text-3xl'>
              Welcome back{user ? `, ${user.name}` : ''}
            </h1>
            <p className='text-body mt-1'>
              Manage your listings and incoming requests
            </p>
          </div>
          <Button asChild>
            <Link href='/dashboard/landlord/properties/new'>
              <Plus className='h-4 w-4' />
              New listing
            </Link>
          </Button>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-heading text-lg'>Your properties</h2>
          <Link
            href='/dashboard/landlord/requests'
            className='text-caption text-muted-foreground hover:text-foreground transition-colors'
          >
            View rental requests →
          </Link>
        </div>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-20 rounded-xl mb-3' />
          ))}

        {!isLoading && properties?.length === 0 && (
          <EmptyState message="You haven't listed any properties yet." />
        )}

        <div className='space-y-3'>
          {properties?.map((property) => (
            <MyPropertyRow key={property.id} property={property} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
