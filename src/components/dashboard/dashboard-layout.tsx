'use client';

import { DashboardSidebar, DashboardNavItem } from './dashboard-sidebar';
import { DashboardTopBar } from './dashboard-topbar';
import { User } from '@/types/user';

interface Props {
  brand: string;
  brandIcon: React.ElementType;
  brandIconClassName?: string;
  navItems: DashboardNavItem[];
  activeItem: string;
  onNav: (id: string) => void;
  user: User | null;
  onLogout: () => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  brand,
  brandIcon,
  brandIconClassName,
  navItems,
  activeItem,
  onNav,
  user,
  onLogout,
  searchPlaceholder,
  children,
}: Props) {
  return (
    <div className='min-h-screen bg-background flex'>
      <DashboardSidebar
        brand={brand}
        brandIcon={brandIcon}
        brandIconClassName={brandIconClassName}
        navItems={navItems}
        activeItem={activeItem}
        onNav={onNav}
        user={user}
        onLogout={onLogout}
      />
      <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
        <DashboardTopBar
          user={user}
          onLogout={onLogout}
          searchPlaceholder={searchPlaceholder}
        />
        <main className='flex-1 overflow-y-auto px-6 py-8 lg:px-10'>
          {children}
        </main>
      </div>
    </div>
  );
}
