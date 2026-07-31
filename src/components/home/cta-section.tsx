import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className='mx-auto max-w-6xl px-6 pb-24'>
      <div className='relative rounded-2xl bg-card border border-border surface-edge overflow-hidden px-8 py-14 text-center'>
        <div className='absolute inset-0 bg-accent/5 pointer-events-none' />
        <div className='relative'>
          <h2 className='text-display text-3xl md:text-4xl max-w-xl mx-auto'>
            Ready to find your perfect home?
          </h2>
          <p className='text-body text-lg mt-4 max-w-md mx-auto'>
            Join thousands of tenants already using RentNest to find verified,
            affordable properties.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
            <Button size='lg' asChild className='rounded-xl h-12 px-8'>
              <Link href='/properties'>
                <Search className='h-4 w-4' />
                Start browsing
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild className='rounded-xl h-12 px-8'>
              <Link href='/auth/register'>Create an account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
