'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Props {
  brand: string;
  brandIcon: React.ElementType;
  brandIconClassName?: string;
  navItems: DashboardNavItem[];
  activeItem: string;
  onNav: (id: string) => void;
  user: User | null;
  onLogout: () => void;
}

export function DashboardSidebar({
  brand,
  brandIcon: BrandIcon,
  brandIconClassName = 'text-primary',
  navItems,
  activeItem,
  onNav,
  user,
  onLogout,
}: Props) {
  return (
    <aside className='hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0'>
      <Link
        href='/'
        className='flex items-center gap-2.5 px-6 h-16 border-b border-border shrink-0'
      >
        <BrandIcon className={cn('h-5 w-5', brandIconClassName)} />
        <span className='text-heading text-lg tracking-tight'>{brand}</span>
      </Link>

      <nav className='flex-1 px-3 py-4 space-y-0.5'>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer',
              activeItem === id
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
            )}
          >
            <Icon className='h-4 w-4 shrink-0' />
            {label}
          </button>
        ))}
      </nav>

      <div className='px-3 pb-4 border-t border-border pt-4'>
        <button
          onClick={onLogout}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/60 transition-colors'
        >
          <Avatar size='default'>
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0 text-left'>
            <p className='text-sm font-medium truncate'>{user?.name ?? '—'}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {user?.email ?? '—'}
            </p>
          </div>
          <LogOut className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
        </button>
      </div>
    </aside>
  );
}
