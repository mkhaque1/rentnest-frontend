import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/features/properties/components/property-card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';

async function getFeaturedProperties(): Promise<Property[]> {
  const res = await apiClient.get<ApiResponse<Property[]>>('/api/properties');
  return res.data.data.slice(0, 6);
}

export default async function Home() {
  const properties = await getFeaturedProperties();

  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className='mx-auto max-w-6xl px-6 pt-20 pb-16'>
          <div className='max-w-2xl'>
            <h1 className='text-display text-5xl md:text-6xl'>
              Find your next home, without the noise.
            </h1>
            <p className='text-body mt-5 text-lg max-w-lg'>
              Browse verified listings, request a viewing, and move in — every
              step handled in one place.
            </p>
            <div className='flex items-center gap-3 mt-8'>
              <Button size='lg' asChild>
                <Link href='/properties'>
                  <Search className='h-4 w-4' />
                  Browse properties
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href='/auth/register'>List your property</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured properties */}
        <section className='mx-auto max-w-6xl px-6 pb-24'>
          <div className='flex items-end justify-between mb-6'>
            <h2 className='text-heading text-2xl'>Featured listings</h2>
            <Link
              href='/properties'
              className='text-caption text-muted-foreground hover:text-foreground transition-colors'
            >
              View all →
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className='text-body'>No properties available yet.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
