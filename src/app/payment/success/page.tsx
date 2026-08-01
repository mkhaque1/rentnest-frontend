'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccessPage() {
  const queryClient = useQueryClient();

  // Invalidate rentals and payments so dashboard shows updated status
  // when the user clicks "Go to dashboard" — gives the webhook time to fire
  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }, 3000); // wait 3s for webhook to process
    return () => clearTimeout(timer);
  }, [queryClient]);

  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-md px-6 py-24 text-center min-h-[60vh]'>
        <CheckCircle2 className='h-14 w-14 text-emerald-400 mx-auto mb-6' />
        <h1 className='text-heading text-2xl'>Payment submitted</h1>
        <p className='text-body mt-2'>
          Your payment is being confirmed. You&apos;ll find the latest status in
          your dashboard.
        </p>
        <p className='text-caption text-muted-foreground mt-2 text-sm'>
          It may take a moment to reflect — refresh your dashboard if the status
          hasn&apos;t updated.
        </p>
        <Button asChild className='mt-8'>
          <Link href='/dashboard/tenant'>Go to dashboard</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
