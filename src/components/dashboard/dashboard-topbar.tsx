'use client';

import { Bell, LogOut, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types/user';

interface Props {
  user: User | null;
  onLogout: () => void;
  searchPlaceholder?: string;
}

export function DashboardTopBar({
  user,
  onLogout,
  searchPlaceholder = 'Search…',
}: Props) {
  return (
    <header className='h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 lg:px-10 shrink-0'>
      <div className='relative w-64'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
        <input
          placeholder={searchPlaceholder}
          className='w-full h-9 rounded-xl bg-secondary border border-border pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none focus:border-ring transition-colors'
        />
      </div>

      <div className='flex items-center gap-3'>
        <button className='relative h-9 w-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
          <Bell className='h-4 w-4' />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring'>
              <Avatar size='default'>
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <div className='px-3 py-2.5 border-b border-border mb-1'>
              <p className='text-sm font-medium truncate'>{user?.name ?? '—'}</p>
              <p className='text-xs text-muted-foreground truncate'>
                {user?.email ?? '—'}
              </p>
            </div>
            <DropdownMenuItem onClick={onLogout} variant='destructive'>
              <LogOut className='h-4 w-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
