'use client';

import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const dashboardPath = user
    ? {
        TENANT: '/dashboard/tenant',
        LANDLORD: '/dashboard/landlord',
        ADMIN: '/dashboard/admin',
      }[user.role]
    : '/';

  function handleLogout() {
    logout();
    router.push('/');
  }

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
        </nav>

        <div className='flex items-center gap-3'>
          {isLoading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='cursor-pointer h-9 w-9'>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href={dashboardPath}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-destructive'
                >
                  <LogOut className='h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant='ghost' asChild>
                <Link href='/auth/login'>Sign in</Link>
              </Button>
              <Button asChild>
                <Link href='/auth/register'>Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
