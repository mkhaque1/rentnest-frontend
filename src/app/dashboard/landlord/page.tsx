'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, LayoutDashboard, FileText, Settings, Plus, Star, TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { MyPropertyRow } from '@/features/properties/components/my-property-row';
import { useMyProperties } from '@/features/properties/hooks/use-my-properties';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardNavItem } from '@/components/dashboard/dashboard-sidebar';
import { StatCard } from '@/components/dashboard/stat-card';
import { usePropertyReviews, PropertyReviewItem } from '@/features/reviews/hooks/use-property-reviews';
import { cn } from '@/lib/utils';

type NavItem = 'overview' | 'properties' | 'requests' | 'reviews' | 'settings';

const NAV_ITEMS: DashboardNavItem[] = [
  { id: 'overview',   label: 'Overview',       icon: LayoutDashboard },
  { id: 'properties', label: 'My Properties',  icon: Home            },
  { id: 'requests',   label: 'Requests',        icon: FileText        },
  { id: 'reviews',    label: 'Reviews',         icon: Star            },
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
      {active === 'reviews'    && <ReviewsTab />}
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

  const totalListings  = properties?.length ?? 0;
  const activeRented   = properties?.filter((p) => p.status === 'RENTED').length ?? 0;
  const available      = properties?.filter((p) => p.status === 'AVAILABLE').length ?? 0;
  // Monthly earnings = sum of price for all RENTED properties
  const monthlyEarning = properties
    ?.filter((p) => p.status === 'RENTED')
    .reduce((sum, p) => sum + Number(p.price), 0) ?? 0;

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

      {/* Stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-28 rounded-2xl' />)
          : <>
              <StatCard label='Total Listings'    value={totalListings}                        icon={Building2}   color='text-primary'     bg='bg-primary/10'     />
              <StatCard label='Currently Rented'  value={activeRented}                         icon={Home}        color='text-emerald-400' bg='bg-emerald-500/10' />
              <StatCard label='Available'         value={available}                            icon={FileText}    color='text-sky-400'     bg='bg-sky-500/10'     />
              <StatCard label='Monthly Earnings'  value={`৳${monthlyEarning.toLocaleString()}`} icon={TrendingUp} color='text-accent'      bg='bg-accent/10'      />
            </>}
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
              {isLoading ? '…' : `${totalListings} listing${totalListings !== 1 ? 's' : ''}`}
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

/* ─── Reviews tab ────────────────────────────────────────── */
function ReviewsTab() {
  const { data: properties, isLoading: propsLoading } = useMyProperties();

  if (propsLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-display text-2xl'>Reviews</h1>
          <p className='text-body text-sm mt-1'>What tenants say about your properties.</p>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-2xl' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Reviews</h1>
        <p className='text-body text-sm mt-1'>What tenants say about your properties.</p>
      </div>

      {!properties || properties.length === 0 ? (
        <EmptyState message="You haven't listed any properties yet." />
      ) : (
        properties.map((property) => (
          <PropertyReviewSection key={property.id} propertyId={property.id} propertyTitle={property.title} />
        ))
      )}
    </div>
  );
}

function PropertyReviewSection({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const { data: reviews, isLoading } = usePropertyReviews(propertyId);

  if (isLoading) return <Skeleton className='h-24 rounded-2xl' />;
  if (!reviews || reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
      <div className='px-5 py-4 border-b border-border flex items-center justify-between'>
        <div>
          <p className='text-heading text-sm'>{propertyTitle}</p>
          <p className='text-xs text-muted-foreground mt-0.5'>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <div className='flex items-center gap-1.5'>
          <span className='text-heading text-lg'>{avg.toFixed(1)}</span>
          <div className='flex gap-0.5'>
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'h-4 w-4',
                  s <= Math.round(avg) ? 'fill-accent text-accent' : 'text-muted-foreground/30',
                )}
              />
            ))}
          </div>
        </div>
      </div>
      {reviews.map((review, i) => (
        <ReviewRow key={review.id} review={review} last={i === reviews.length - 1} />
      ))}
    </div>
  );
}

function ReviewRow({ review, last }: { review: PropertyReviewItem; last: boolean }) {
  return (
    <div className={cn('px-5 py-4', !last && 'border-b border-border')}>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <p className='text-sm font-medium'>{review.tenant.name}</p>
            <span className='text-xs text-muted-foreground'>
              {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>{review.comment}</p>
        </div>
        <div className='flex items-center gap-0.5 shrink-0'>
          {[1,2,3,4,5].map((s) => (
            <Star
              key={s}
              className={cn(
                'h-3.5 w-3.5',
                s <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30',
              )}
            />
          ))}
        </div>
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
