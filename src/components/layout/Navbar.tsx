'use-client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md'>
      <div className='mx-auto max-w-6xl px-6 h-16 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-2'>
          <Home className='h-5 w-5 text-primary' />
          <span className='text-heading text-lg tracking-tight'>RentNest</span>
        </Link>

        <nav className='hidden md:flex items-center gap-8 text-caption text-muted-foreground'>
          <Link
            href='/properties'
            className='hover:text-foreground transition-colors'
          >
            Browse
          </Link>
          <Link
            href='/about'
            className='hover:text-foreground transition-colors'
          >
            How it works
          </Link>
        </nav>

        <div className='flex items-center gap-3'>
          <Button variant='ghost' asChild>
            <Link href='/auth/login'>Sign in</Link>
          </Button>
          <Button asChild>
            <Link href='/auth/register'>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
