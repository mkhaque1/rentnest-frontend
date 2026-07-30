import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-md px-6 py-24 text-center min-h-[60vh]'>
        <XCircle className='h-14 w-14 text-destructive mx-auto mb-6' />
        <h1 className='text-heading text-2xl'>Payment cancelled</h1>
        <p className='text-body mt-2'>
          No charge was made. You can try again anytime from your dashboard.
        </p>
        <Button asChild variant='outline' className='mt-8'>
          <Link href='/dashboard/tenant'>Back to dashboard</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
