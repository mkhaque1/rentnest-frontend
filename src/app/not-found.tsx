import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className='mx-auto max-w-md px-6 py-24 text-center min-h-[60vh]'>
        <h1 className='text-display text-5xl'>404</h1>
        <p className='text-body mt-3'>
          This page doesn&apos;t exist, or may have moved.
        </p>
        <Button asChild className='mt-8'>
          <Link href='/'>Back home</Link>
        </Button>
      </main>
    </>
  );
}
