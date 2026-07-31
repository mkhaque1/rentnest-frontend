'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LayoutDashboard, FileText, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MyPropertyRow } from '@/features/properties/components/my-property-row';
import { useMyProperties } from '@/features/properties/hooks/use-my-properties';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardNavItem } from '@/components/dashboard/dashboard-sidebar';

type NavItem = 'overview' | 'properties' | 'requests' | 'settings';

const NAV_ITEMS: DashboardNavItem[] = [
  { id: 'overview',   label: 'Overview',       icon: LayoutDashboard },
  { id: 'properties', label: 'My Properties',  icon: Home            },
  { id: 'requests',   label: 'Requests',        icon: FileText        },
  { id: 'settings',   label: 'Settings',        icon: Settings        },
];

export default function LandlordDashboardPage() {
  const [active, setActive] = useState<NavItem>('overview');
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() { logout(); router.push('/'); }

  return (
    <DashboardLayout
      brand='RentNest'
      brandIcon={Home}
      brandIconClassName='text-primary'
      navItems={NAV_ITEMS}
      activeItem={active}
      onNav={(id) => setActive(id as NavItem)}
      user={user}
      onLogout={handleLogout}
      searchPlaceholder='Search listings…'
    >
      {active === 'overview'   && <OverviewTab user={user} onNav={setActive} />}
      {active === 'properties' && <PropertiesTab />}
      {active === 'requests'   && <RequestsTab />}
      {active === 'settings'   && <SettingsTab user={user} />}
    </DashboardLayout>
  );
}

/* ─── Overview ───────────────────────────────────────────── */
function OverviewTab({ user, onNav }: {
  user: ReturnType<typeof useAuth>['user'];
  onNav: (n: NavItem) => void;
}) {
  const { data: properties, isLoading } = useMyProperties();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display text-2xl'>Welcome back, {firstName} 👋</h1>
          <p className='text-body text-sm mt-1'>Manage your listings and incoming requests.</p>
        </div>
        <Button asChild className='rounded-xl gap-1.5'>
          <Link href='/dashboard/landlord/properties/new'><Plus className='h-4 w-4' />New listing</Link>
        </Button>
      </div>

      {/* Quick links */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <button onClick={() => onNav('properties')}
          className='flex items-center gap-4 rounded-2xl border border-border bg-card surface-edge p-5 hover:border-primary/30 transition-colors text-left'>
          <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0'>
            <Home className='h-5 w-5 text-muted-foreground' />
          </div>
          <div>
            <p className='text-heading text-sm'>My Properties</p>
            <p className='text-caption text-muted-foreground text-xs mt-0.5'>
              {isLoading ? '…' : `${properties?.length ?? 0} listing${(properties?.length ?? 0) !== 1 ? 's' : ''}`}
            </p>
          </div>
        </button>

        <button onClick={() => onNav('requests')}
          className='flex items-center gap-4 rounded-2xl border border-border bg-card surface-edge p-5 hover:border-primary/30 transition-colors text-left'>
          <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0'>
            <FileText className='h-5 w-5 text-muted-foreground' />
          </div>
          <div>
            <p className='text-heading text-sm'>Rental Requests</p>
            <p className='text-caption text-muted-foreground text-xs mt-0.5'>View and manage requests</p>
          </div>
        </button>

        <Link href='/dashboard/landlord/properties/new'
          className='flex items-center gap-4 rounded-2xl border border-border bg-card surface-edge p-5 hover:border-primary/30 transition-colors'>
          <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0'>
            <Plus className='h-5 w-5 text-muted-foreground' />
          </div>
          <div>
            <p className='text-heading text-sm'>New Listing</p>
            <p className='text-caption text-muted-foreground text-xs mt-0.5'>Add a property</p>
          </div>
        </Link>
      </div>

      {/* Recent properties */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-heading text-base'>Your properties</h2>
          <Link href='/dashboard/landlord/requests'
            className='text-xs text-muted-foreground hover:text-foreground transition-colors'>
            View rental requests →
          </Link>
        </div>
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-20 rounded-xl mb-3' />)}
        {!isLoading && (properties?.length ?? 0) === 0 && (
          <EmptyState message="You haven't listed any properties yet." />
        )}
        <div className='space-y-3'>
          {properties?.map((property) => <MyPropertyRow key={property.id} property={property} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Properties tab ─────────────────────────────────────── */
function PropertiesTab() {
  const { data: properties, isLoading } = useMyProperties();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display text-2xl'>My Properties</h1>
          <p className='text-body text-sm mt-1'>All your listed properties.</p>
        </div>
        <Button asChild className='rounded-xl gap-1.5'>
          <Link href='/dashboard/landlord/properties/new'><Plus className='h-4 w-4' />New listing</Link>
        </Button>
      </div>
      {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-20 rounded-xl mb-3' />)}
      {!isLoading && (properties?.length ?? 0) === 0 && (
        <EmptyState message="You haven't listed any properties yet." />
      )}
      <div className='space-y-3'>
        {properties?.map((property) => <MyPropertyRow key={property.id} property={property} />)}
      </div>
    </div>
  );
}

/* ─── Requests tab ───────────────────────────────────────── */
function RequestsTab() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Rental Requests</h1>
        <p className='text-body text-sm mt-1'>Review and manage incoming rental requests.</p>
      </div>
      <div className='rounded-2xl border border-border bg-card surface-edge p-10 flex flex-col items-center gap-4 text-center'>
        <FileText className='h-10 w-10 text-muted-foreground' />
        <div>
          <p className='text-heading text-base'>Manage rental requests</p>
          <p className='text-body text-sm mt-1'>View, approve, or reject incoming rental applications.</p>
        </div>
        <Button asChild className='rounded-xl'>
          <Link href='/dashboard/landlord/requests'>Go to requests</Link>
        </Button>
      </div>
    </div>
  );
}

/* ─── Settings tab ───────────────────────────────────────── */
function SettingsTab({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  return (
    <div className='space-y-6 max-w-lg'>
      <div>
        <h1 className='text-display text-2xl'>Settings</h1>
        <p className='text-body text-sm mt-1'>Manage your account preferences.</p>
      </div>
      <div className='rounded-2xl border border-border bg-card surface-edge p-6 space-y-5'>
        <div className='space-y-3'>
          {[{ label: 'Full name', value: user?.name ?? '' }, { label: 'Email address', value: user?.email ?? '' }, { label: 'Phone number', value: user?.phone ?? '' }].map(({ label, value }) => (
            <div key={label}>
              <label className='text-xs text-muted-foreground mb-1.5 block'>{label}</label>
              <input disabled defaultValue={value} placeholder={value || '—'}
                className='w-full h-10 rounded-xl bg-secondary border border-border px-3.5 text-sm text-muted-foreground outline-none disabled:cursor-not-allowed' />
            </div>
          ))}
        </div>
        <Button className='rounded-xl' disabled>Save changes</Button>
      </div>
    </div>
  );
}
