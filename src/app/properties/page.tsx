'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/features/properties/components/property-card';
import { PropertyFiltersBar } from '@/features/properties/components/property-filters';
import {
  useProperties,
  PropertyFilters,
} from '@/features/properties/hooks/use-properties';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal } from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? undefined;
  const [filters, setFilters] = useState<PropertyFilters>({});
  const activeFilters = useMemo(
    () => ({ ...filters, type: filters.type ?? type }),
    [filters, type],
  );

  const { data, isLoading, isError } = useProperties(activeFilters);
  const total = data?.meta?.total ?? 0;

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-12 min-h-[60vh]'>
        {/* Header */}
        <div className='flex items-end justify-between mb-6'>
          <div>
            <h1 className='text-display text-3xl'>Browse properties</h1>
            {!isLoading && (
              <p className='text-body text-sm mt-1'>
                {total} {total === 1 ? 'property' : 'properties'} found
              </p>
            )}
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <SlidersHorizontal className='h-4 w-4' />
            <span className='hidden sm:inline'>Filters</span>
          </div>
        </div>

        <PropertyFiltersBar filters={activeFilters} onChange={setFilters} />

        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-80 rounded-2xl' />
            ))}
          </div>
        )}

        {isError && (
          <div className='mt-10 text-center py-16 rounded-2xl border border-border border-dashed'>
            <p className='text-body'>Something went wrong. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && data?.data.length === 0 && (
          <div className='mt-10 text-center py-16 rounded-2xl border border-border border-dashed'>
            <p className='text-heading text-base mb-1'>No properties found</p>
            <p className='text-body text-sm'>Try adjusting your filters.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6'>
            {data.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesContent />
    </Suspense>
  );
}
