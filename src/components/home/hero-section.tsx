import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const STATS = [
  { label: 'Properties listed',  value: '200+' },
  { label: 'Cities covered',     value: '12'   },
  { label: 'Happy tenants',      value: '500+' },
  { label: 'Avg. response time', value: '< 2h' },
];

export function HeroSection() {
  return (
    <section className='relative mx-auto max-w-6xl px-6 pt-24 pb-20'>
      <div className='absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none' />

      <div className='relative max-w-2xl'>
        <span className='inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/30 bg-accent/10 px-3 py-1 rounded-full mb-6'>
          <span className='h-1.5 w-1.5 rounded-full bg-accent' />
          Now available in Bangladesh
        </span>
        <h1 className='text-display text-5xl md:text-6xl lg:text-7xl'>
          Find your next home, without the noise.
        </h1>
        <p className='text-body mt-5 text-lg max-w-lg'>
          Browse verified listings, request a rental, and move in — every step
          handled in one place.
        </p>
        <div className='flex flex-wrap items-center gap-3 mt-8'>
          <Button size='lg' asChild className='rounded-xl h-12 px-6'>
            <Link href='/properties'>
              <Search className='h-4 w-4' />
              Browse properties
            </Link>
          </Button>
          <Button size='lg' variant='outline' asChild className='rounded-xl h-12 px-6'>
            <Link href='/auth/register'>List your property</Link>
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className='mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden'>
        {STATS.map(({ label, value }) => (
          <div key={label} className='bg-card px-6 py-5'>
            <p className='text-display text-2xl'>{value}</p>
            <p className='text-caption text-muted-foreground text-xs mt-1'>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
