import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-md px-6 py-24 text-center min-h-[60vh]'>
        <CheckCircle2 className='h-14 w-14 text-emerald-400 mx-auto mb-6' />
        <h1 className='text-heading text-2xl'>Payment successful</h1>
        <p className='text-body mt-2'>
          Your rental is now active. You&apos;ll find it in your dashboard.
        </p>
        <Button asChild className='mt-8'>
          <Link href='/dashboard/tenant'>Go to dashboard</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
