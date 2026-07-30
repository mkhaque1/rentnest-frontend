'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  CreditCard,
  Bell,
  LogOut,
  MapPin,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMyRentals } from '@/features/rentals/hooks/use-my-rental';
import { useMyPayments } from '@/features/payments/hooks/use-my-payments';
import { RentalRequest } from '@/types/rental';
import { Payment } from '@/types/payment';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/shared/empty-state';

/* ─── Status config ──────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-primary/15 text-primary border-primary/30',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-muted text-muted-foreground border-border',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
};

type NavItem = 'overview' | 'rentals' | 'payments' | 'Profile';

const NAV: { id: NavItem; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rentals', label: 'My Rentals', icon: Home },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'Profile', label: 'Profile', icon: Settings },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function TenantDashboardPage() {
  const [active, setActive] = useState<NavItem>('overview');
  const { user, logout } = useAuth();
  const { data: rentals = [], isLoading: rentalsLoading } = useMyRentals();
  const { data: payments = [], isLoading: paymentsLoading } = useMyPayments();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <div className='min-h-screen bg-background flex'>
      <Sidebar
        active={active}
        onNav={setActive}
        user={user}
        onLogout={handleLogout}
      />
      <div className='flex-1 flex flex-col min-h-screen overflow-hidden'>
        <TopBar user={user} />
        <main className='flex-1 overflow-y-auto px-6 py-8 lg:px-10'>
          {active === 'overview' && (
            <OverviewTab
              user={user}
              rentals={rentals}
              payments={payments}
              rentalsLoading={rentalsLoading}
              paymentsLoading={paymentsLoading}
              onNav={setActive}
            />
          )}
          {active === 'rentals' && (
            <RentalsTab rentals={rentals} isLoading={rentalsLoading} />
          )}
          {active === 'payments' && (
            <PaymentsTab payments={payments} isLoading={paymentsLoading} />
          )}
          {active === 'Profile' && <ProfileTab user={user} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────── */
function Sidebar({
  active,
  onNav,
  user,
  onLogout,
}: {
  active: NavItem;
  onNav: (n: NavItem) => void;
  user: ReturnType<typeof useAuth>['user'];
  onLogout: () => void;
}) {
  return (
    <aside className='hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0'>
      <Link
        href='/'
        className='flex items-center gap-2.5 px-6 h-16 border-b border-border shrink-0'
      >
        <Home className='h-5 w-5 text-primary' />
        <span className='text-heading text-lg tracking-tight'>RentNest</span>
      </Link>

      <nav className='flex-1 px-3 py-4 space-y-0.5'>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={cn(
              'w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              active === id
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

/* ─── Top bar ────────────────────────────────────────────── */
function TopBar({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  return (
    <header className='h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 lg:px-10 shrink-0'>
      <div className='relative w-64'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
        <input
          placeholder='Search rentals…'
          className='w-full h-9 rounded-xl bg-secondary border border-border pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none focus:border-ring transition-colors'
        />
      </div>
      <div className='flex items-center gap-3'>
        <button className='relative h-9 w-9 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
          <Bell className='h-4 w-4' />
        </button>
        <Avatar size='default'>
          <AvatarFallback>
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

/* ─── Overview tab ───────────────────────────────────────── */
function OverviewTab({
  user,
  rentals,
  payments,
  rentalsLoading,
  paymentsLoading,
  onNav,
}: {
  user: ReturnType<typeof useAuth>['user'];
  rentals: RentalRequest[];
  payments: Payment[];
  rentalsLoading: boolean;
  paymentsLoading: boolean;
  onNav: (n: NavItem) => void;
}) {
  const activeCount = rentals.filter((r) => r.status === 'ACTIVE').length;
  const pendingCount = rentals.filter((r) => r.status === 'PENDING').length;
  const completedCount = rentals.filter((r) => r.status === 'COMPLETED').length;
  const totalPaid = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      label: 'Active Rentals',
      value: String(activeCount),
      icon: Home,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Pending Requests',
      value: String(pendingCount),
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Total Paid',
      value: `৳${totalPaid.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: String(completedCount),
      icon: CheckCircle2,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
  ];

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-display text-2xl'>Good morning, {firstName} 👋</h1>
        <p className='text-body text-sm mt-1'>
          Here&apos;s what&apos;s happening with your rentals today.
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {rentalsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-28 rounded-2xl' />
            ))
          : stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className='rounded-2xl border border-border bg-card surface-edge p-5 space-y-3'
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center',
                    bg,
                  )}
                >
                  <Icon className={cn('h-4 w-4', color)} />
                </div>
                <div>
                  <p className='text-display text-2xl'>{value}</p>
                  <p className='text-caption text-muted-foreground text-xs mt-0.5'>
                    {label}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Recent rentals */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-heading text-base'>Recent rentals</h2>
          <button
            onClick={() => onNav('rentals')}
            className='text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
          >
            View all <ChevronRight className='h-3 w-3' />
          </button>
        </div>
        {rentalsLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className='h-20 rounded-2xl' />
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <EmptyState message="You haven't submitted any rental requests yet." />
        ) : (
          <div className='space-y-3'>
            {rentals.slice(0, 2).map((r) => (
              <RentalRow key={r.id} rental={r} />
            ))}
          </div>
        )}
      </div>

      {/* Recent payments */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-heading text-base'>Recent payments</h2>
          <button
            onClick={() => onNav('payments')}
            className='text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
          >
            View all <ChevronRight className='h-3 w-3' />
          </button>
        </div>
        {paymentsLoading ? (
          <Skeleton className='h-40 rounded-2xl' />
        ) : payments.length === 0 ? (
          <EmptyState message='No payments yet.' />
        ) : (
          <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
            {payments.slice(0, 3).map((p, i) => (
              <PaymentRow
                key={p.id}
                payment={p}
                last={i === Math.min(2, payments.length - 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Rentals tab ────────────────────────────────────────── */
function RentalsTab({
  rentals,
  isLoading,
}: {
  rentals: RentalRequest[];
  isLoading: boolean;
}) {
  const [filter, setFilter] = useState<string>('All');
  const filters = [
    'All',
    'ACTIVE',
    'PENDING',
    'APPROVED',
    'COMPLETED',
    'REJECTED',
  ];
  const labels: Record<string, string> = {
    All: 'All',
    ACTIVE: 'Active',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
  };

  const visible =
    filter === 'All' ? rentals : rentals.filter((r) => r.status === filter);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display text-2xl'>My Rentals</h1>
          <p className='text-body text-sm mt-1'>
            All your rental requests and active leases.
          </p>
        </div>
        <Button asChild size='sm' className='rounded-xl gap-1.5'>
          <Link href='/properties'>
            <Plus className='h-3.5 w-3.5' />
            New request
          </Link>
        </Button>
      </div>

      <div className='flex items-center gap-2 flex-wrap'>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filter === f
                ? 'border-primary/40 bg-primary/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80',
            )}
          >
            {labels[f]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-20 rounded-2xl' />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState message='No rentals match this filter.' />
      ) : (
        <div className='space-y-3'>
          {visible.map((r) => (
            <RentalRow key={r.id} rental={r} expanded />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Payments tab ───────────────────────────────────────── */
function PaymentsTab({
  payments,
  isLoading,
}: {
  payments: Payment[];
  isLoading: boolean;
}) {
  const totalPaid = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Payments</h1>
        <p className='text-body text-sm mt-1'>Your full payment history.</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          {
            label: 'Total paid',
            value: `৳${totalPaid.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Pending',
            value: `৳${totalPending.toLocaleString()}`,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Transactions',
            value: String(payments.length),
            icon: CreditCard,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className='rounded-2xl border border-border bg-card surface-edge p-5 flex items-center gap-4'
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                bg,
              )}
            >
              <Icon className={cn('h-5 w-5', color)} />
            </div>
            <div>
              <p className='text-heading text-xl'>{value}</p>
              <p className='text-caption text-muted-foreground text-xs'>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className='h-60 rounded-2xl' />
      ) : payments.length === 0 ? (
        <EmptyState message='No payments yet.' />
      ) : (
        <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
          <div className='px-5 py-4 border-b border-border flex items-center justify-between'>
            <p className='text-heading text-sm'>Transaction history</p>
            <p className='text-xs text-muted-foreground'>
              {payments.length} records
            </p>
          </div>
          {payments.map((p, i) => (
            <PaymentRow
              key={p.id}
              payment={p}
              last={i === payments.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Profile tab ───────────────────────────────────────── */
function ProfileTab({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  return (
    <div className='space-y-6 max-w-lg'>
      <div>
        <h1 className='text-display text-2xl'>Profile</h1>
        <p className='text-body text-sm mt-1'>
          Manage your account preferences.
        </p>
      </div>

      <div className='rounded-2xl border border-border bg-card surface-edge p-6 space-y-5'>
        <div className='flex items-center gap-4'>
          <Avatar size='lg' className='h-14 w-14'>
            <AvatarFallback className='text-lg'>
              {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-heading text-base'>{user?.name ?? '—'}</p>
            <p className='text-caption text-muted-foreground text-sm'>
              {user?.email ?? '—'}
            </p>
            <Badge
              variant='outline'
              className='mt-1.5 text-xs border-primary/30 text-primary bg-primary/10'
            >
              Tenant
            </Badge>
          </div>
        </div>

        <div className='space-y-3'>
          {[
            { label: 'Full name', value: user?.name ?? '' },
            { label: 'Email address', value: user?.email ?? '' },
            { label: 'Phone number', value: user?.phone ?? '' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className='text-xs text-muted-foreground mb-1.5 block'>
                {label}
              </label>
              <input
                disabled
                defaultValue={value}
                placeholder={value || '—'}
                className='w-full h-10 rounded-xl bg-secondary border border-border px-3.5 text-sm text-muted-foreground outline-none disabled:cursor-not-allowed'
              />
            </div>
          ))}
        </div>

        <Button className='rounded-xl' disabled>
          Save changes
        </Button>
      </div>

      <div className='rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-3'>
        <p className='text-heading text-sm text-destructive'>Danger zone</p>
        <p className='text-body text-sm'>
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <Button variant='destructive' className='rounded-xl' disabled>
          <XCircle className='h-4 w-4' />
          Delete account
        </Button>
      </div>
    </div>
  );
}

/* ─── Shared components ──────────────────────────────────── */
function RentalRow({
  rental,
  expanded = false,
}: {
  rental: RentalRequest;
  expanded?: boolean;
}) {
  const cfg = STATUS_CONFIG[rental.status] ?? STATUS_CONFIG.PENDING;
  const image = rental.property.images?.[0];

  return (
    <Link
      href={`/properties/${rental.propertyId}`}
      className='flex items-center gap-4 rounded-2xl border border-border bg-card surface-edge p-4 hover:border-primary/30 transition-colors'
    >
      <div
        className='h-14 w-20 rounded-xl bg-secondary shrink-0 bg-cover bg-center'
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      />
      <div className='flex-1 min-w-0'>
        <p className='text-heading text-sm truncate'>{rental.property.title}</p>
        <div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
          <MapPin className='h-3 w-3 shrink-0' />
          <span className='truncate'>{rental.property.location}</span>
        </div>
        {expanded && (
          <p className='text-xs text-muted-foreground mt-1'>
            Move-in:{' '}
            {new Date(rental.moveInDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </div>
      <div className='flex flex-col items-end gap-2 shrink-0'>
        <Badge variant='outline' className={cn('text-xs', cfg.className)}>
          {cfg.label}
        </Badge>
        <p className='text-heading text-sm'>
          ৳{Number(rental.property.price).toLocaleString()}
          <span className='text-muted-foreground font-normal text-xs'>/mo</span>
        </p>
      </div>
    </Link>
  );
}

function PaymentRow({ payment, last }: { payment: Payment; last: boolean }) {
  const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING;
  const date = payment.paidAt ?? payment.createdAt;

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-4',
        !last && 'border-b border-border',
      )}
    >
      <div className='h-9 w-9 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0'>
        <CreditCard className='h-4 w-4 text-muted-foreground' />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate'>
          {payment.rentalRequest?.property.title ?? 'Rental payment'}
        </p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          · {payment.provider}
        </p>
      </div>
      <div className='flex flex-col items-end gap-1.5 shrink-0'>
        <p className='text-heading text-sm'>
          ৳{payment.amount.toLocaleString()}
        </p>
        <Badge variant='outline' className={cn('text-xs', cfg.className)}>
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
}
