'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className='border-t border-border mt-24'>
      <div className='mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4'>
        <p className='text-caption text-muted-foreground'>
          © {new Date().getFullYear()} RentNest. All rights reserved.
        </p>
        <div className='flex gap-6 text-caption text-muted-foreground'>
          <Link
            href='/properties'
            className='hover:text-foreground transition-colors'
          >
            Browse properties
          </Link>
          <Link
            href='/auth/register'
            className='hover:text-foreground transition-colors'
          >
            List your property
          </Link>
        </div>
      </div>
    </footer>
  );
}
