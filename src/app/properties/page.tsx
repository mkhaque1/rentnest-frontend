'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/features/properties/components/property-card';
import { PropertyFiltersBar } from '@/features/properties/components/property-filters';
import {
  useProperties,
  PropertyFilters,
} from '@/features/properties/hooks/use-properties';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { data, isLoading, isError } = useProperties(filters);

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-6xl px-6 py-12 min-h-[60vh]'>
        <h1 className='text-display text-3xl mb-8'>Browse properties</h1>

        <PropertyFiltersBar filters={filters} onChange={setFilters} />

        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-72 rounded-xl' />
            ))}
          </div>
        )}

        {isError && (
          <p className='text-body text-destructive'>
            Something went wrong loading properties. Please try again.
          </p>
        )}

        {data && data.data.length === 0 && (
          <p className='text-body'>No properties match your filters.</p>
        )}

        {data && data.data.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
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
