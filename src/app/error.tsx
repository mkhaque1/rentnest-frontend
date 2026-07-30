'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='mx-auto max-w-md px-6 py-24 text-center min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-heading text-2xl'>Something went wrong</h1>
      <p className='text-body mt-2'>
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <Button onClick={reset} className='mt-8'>
        Try again
      </Button>
    </main>
  );
}
