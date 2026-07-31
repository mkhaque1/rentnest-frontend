import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/features/properties/components/property-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ApiResponse } from '@/types/api';
import { Property } from '@/types/property';
import { HeroSection } from '@/components/home/hero-section';
import { HowItWorks } from '@/components/home/how-it-works';
import { CategorySection } from '@/components/home/category-section';
import { TrustSection } from '@/components/home/trust-section';
import { CtaSection } from '@/components/home/cta-section';

export const revalidate = 300;

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json: ApiResponse<Property[]> = await res.json();
    return json.data.slice(0, 6);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const properties = await getFeaturedProperties();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />

        {/* Featured listings */}
        <section className='mx-auto max-w-6xl px-6 py-20'>
          <div className='flex items-end justify-between mb-8'>
            <div>
              <p className='text-xs font-semibold text-accent uppercase tracking-widest mb-2'>
                Latest
              </p>
              <h2 className='text-display text-3xl'>Featured listings</h2>
            </div>
            <Link
              href='/properties'
              className='hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              View all <ArrowRight className='h-4 w-4' />
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

          <div className='flex justify-center mt-10 sm:hidden'>
            <Button variant='outline' asChild className='rounded-xl'>
              <Link href='/properties'>View all listings</Link>
            </Button>
          </div>
        </section>

        <CategorySection />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
