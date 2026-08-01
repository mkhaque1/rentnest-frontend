'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, HomeIcon, FileText, LayoutDashboard,
  Ban, CheckCircle2, MapPin, ShieldAlert,
  TrendingUp, Clock, Tag, Pencil, Trash2, Plus, X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useAdminUsers, useUpdateUserStatus } from '@/features/admin/hooks/use-admin-users';
import { useAdminProperties, useAdminRentals } from '@/features/admin/hooks/use-admin-overview';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/admin/hooks/use-admin-categories';
import { RentalStatusBadge } from '@/features/rentals/components/status-badge';
import { PropertyCategory } from '@/types/property';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardNavItem } from '@/components/dashboard/dashboard-sidebar';
import { StatCard } from '@/components/dashboard/stat-card';
import { getApiErrorMessage } from '@/lib/api-error';

type NavItem = 'overview' | 'users' | 'properties' | 'rentals' | 'categories';

const NAV_ITEMS: DashboardNavItem[] = [
  { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { id: 'users',      label: 'Users',      icon: Users           },
  { id: 'properties', label: 'Properties', icon: HomeIcon        },
  { id: 'rentals',    label: 'Rentals',    icon: FileText        },
  { id: 'categories', label: 'Categories', icon: Tag             },
];

const STATUS_BADGE: Record<string, string> = {
  AVAILABLE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  RENTED:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  BANNED:    'bg-destructive/15 text-destructive border-destructive/30',
  ACTIVE:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export default function AdminDashboardPage() {
  const [active, setActive] = useState<NavItem>('overview');
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: users   = [], isLoading: usersLoading   } = useAdminUsers();
  const { data: props   = [], isLoading: propsLoading   } = useAdminProperties();
  const { data: rentals = [], isLoading: rentalsLoading } = useAdminRentals();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  function handleLogout() { logout(); router.push('/'); }

  function handleToggleBan(id: string, currentStatus: string) {
    const next = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    updateStatus(
      { id, status: next },
      {
        onSuccess: () => toast.success(next === 'BANNED' ? 'User banned' : 'User unbanned'),
        onError: (err: unknown) => toast.error(getApiErrorMessage(err, 'Failed to update user')),
      },
    );
  }

  return (
    <DashboardLayout
      brand='Admin'
      brandIcon={ShieldAlert}
      brandIconClassName='text-destructive'
      navItems={NAV_ITEMS}
      activeItem={active}
      onNav={(id) => setActive(id as NavItem)}
      user={user}
      onLogout={handleLogout}
      searchPlaceholder='Search…'
    >
      {active === 'overview'   && <OverviewTab users={users} props={props} rentals={rentals} usersLoading={usersLoading} propsLoading={propsLoading} rentalsLoading={rentalsLoading} onNav={setActive} />}
      {active === 'users'      && <UsersTab users={users} isLoading={usersLoading} isPending={isPending} onToggleBan={handleToggleBan} />}
      {active === 'properties' && <PropertiesTab props={props} isLoading={propsLoading} />}
      {active === 'rentals'    && <RentalsTab rentals={rentals} isLoading={rentalsLoading} />}
      {active === 'categories' && <CategoriesTab />}
    </DashboardLayout>
  );
}

/* ─── Overview ───────────────────────────────────────────── */
function OverviewTab({ users, props, rentals, usersLoading, propsLoading, rentalsLoading, onNav }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]; props: any[]; rentals: any[];
  usersLoading: boolean; propsLoading: boolean; rentalsLoading: boolean;
  onNav: (n: NavItem) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingRentals = (rentals as any[]).filter((r) => r.status === 'PENDING').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bannedUsers    = (users  as any[]).filter((u) => u.status === 'BANNED').length;

  const stats = [
    { label: 'Total users',      value: users?.length ?? 0,  icon: Users,      color: 'text-primary',     bg: 'bg-primary/10'     },
    { label: 'Total properties', value: props?.length ?? 0,  icon: HomeIcon,   color: 'text-sky-400',     bg: 'bg-sky-500/10'     },
    { label: 'Pending requests', value: pendingRentals,       icon: Clock,      color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
    { label: 'Banned users',     value: bannedUsers,          icon: Ban,        color: 'text-destructive', bg: 'bg-destructive/10' },
  ];

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-display text-2xl'>Platform overview</h1>
        <p className='text-body text-sm mt-1'>Monitor users, listings, and activity.</p>
      </div>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {(usersLoading || propsLoading || rentalsLoading)
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-28 rounded-2xl' />)
          : stats.map(({ label, value, icon, color, bg }) => (
              <StatCard key={label} label={label} value={value} icon={icon} color={color} bg={bg} />
            ))}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        {[
          { label: 'Manage users',      desc: `${users?.length ?? 0} registered`,  nav: 'users'      as NavItem, icon: Users      },
          { label: 'Review properties', desc: `${props?.length ?? 0} listings`,    nav: 'properties' as NavItem, icon: HomeIcon   },
          { label: 'Rental requests',   desc: `${pendingRentals} pending`,         nav: 'rentals'    as NavItem, icon: TrendingUp },
          { label: 'Categories',        desc: 'Manage property types',             nav: 'categories' as NavItem, icon: Tag        },
        ].map(({ label, desc, nav, icon: Icon }) => (
          <button key={label} onClick={() => onNav(nav)}
            className='flex items-center gap-4 rounded-2xl border border-border bg-card surface-edge p-5 hover:border-primary/30 transition-colors text-left'>
            <div className='h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0'>
              <Icon className='h-5 w-5 text-muted-foreground' />
            </div>
            <div>
              <p className='text-heading text-sm'>{label}</p>
              <p className='text-caption text-muted-foreground text-xs mt-0.5'>{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Users ──────────────────────────────────────────────── */
function UsersTab({ users, isLoading, isPending, onToggleBan }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]; isLoading: boolean; isPending: boolean;
  onToggleBan: (id: string, status: string) => void;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Users</h1>
        <p className='text-body text-sm mt-1'>{users.length} registered accounts</p>
      </div>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-16 rounded-2xl mb-3' />)
        : users.length === 0 ? <EmptyCard message='No users found.' />
        : (
          <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
            {users.map((u, i) => (
              <div key={u.id} className={cn('flex items-center justify-between px-5 py-4', i < users.length - 1 && 'border-b border-border')}>
                <div className='flex items-center gap-3'>
                  <Avatar size='default'><AvatarFallback>{u.name?.charAt(0)?.toUpperCase()}</AvatarFallback></Avatar>
                  <div>
                    <p className='text-sm font-medium'>{u.name}</p>
                    <p className='text-xs text-muted-foreground'>{u.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='capitalize text-xs'>{u.role.toLowerCase()}</Badge>
                  <Badge variant='outline' className={cn('text-xs', STATUS_BADGE[u.status] ?? '')}>{u.status}</Badge>
                  {u.role !== 'ADMIN' && (
                    <Button size='sm' variant='outline' className='rounded-xl h-7 text-xs gap-1'
                      onClick={() => onToggleBan(u.id, u.status)} disabled={isPending}>
                      {u.status === 'BANNED'
                        ? <><CheckCircle2 className='h-3 w-3' />Unban</>
                        : <><Ban className='h-3 w-3 text-destructive' />Ban</>}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─── Properties ─────────────────────────────────────────── */
function PropertiesTab({ props, isLoading }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any[]; isLoading: boolean;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Properties</h1>
        <p className='text-body text-sm mt-1'>{props.length} listings on the platform</p>
      </div>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-16 rounded-2xl mb-3' />)
        : props.length === 0 ? <EmptyCard message='No properties yet.' />
        : (
          <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
            {props.map((p, i) => (
              <div key={p.id} className={cn('flex items-center justify-between px-5 py-4', i < props.length - 1 && 'border-b border-border')}>
                <div>
                  <Link href={`/properties/${p.id}`} className='text-sm font-medium hover:underline line-clamp-1'>{p.title}</Link>
                  <div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
                    <MapPin className='h-3 w-3' />{p.location}
                    {p.landlord?.name && <span className='ml-2'>· {p.landlord.name}</span>}
                  </div>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <p className='text-sm font-medium'>৳{Number(p.price).toLocaleString()}</p>
                  <Badge variant='outline' className={cn('text-xs capitalize', STATUS_BADGE[p.status] ?? '')}>{p.status.toLowerCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─── Rentals ────────────────────────────────────────────── */
function RentalsTab({ rentals, isLoading }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rentals: any[]; isLoading: boolean;
}) {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-display text-2xl'>Rental requests</h1>
        <p className='text-body text-sm mt-1'>{rentals.length} total requests</p>
      </div>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className='h-16 rounded-2xl mb-3' />)
        : rentals.length === 0 ? <EmptyCard message='No rental requests yet.' />
        : (
          <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
            {rentals.map((r, i) => (
              <div key={r.id} className={cn('flex items-center justify-between px-5 py-4', i < rentals.length - 1 && 'border-b border-border')}>
                <div>
                  <p className='text-sm font-medium line-clamp-1'>{r.property?.title ?? 'Unknown property'}</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    Tenant: {r.tenant?.name ?? '—'} · Move-in: {new Date(r.moveInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <RentalStatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─── Categories ─────────────────────────────────────────── */
function CategoriesTab() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const { mutate: createCat, isPending: creating } = useCreateCategory();
  const { mutate: updateCat, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCat, isPending: deleting } = useDeleteCategory();

  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState<PropertyCategory | null>(null);
  const [name, setName]             = useState('');

  function openCreate() { setEditTarget(null); setName(''); setShowForm(true); }
  function openEdit(cat: PropertyCategory) { setEditTarget(cat); setName(cat.name); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditTarget(null); setName(''); }

  function handleSave() {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (editTarget) {
      updateCat({ id: editTarget.id, name: name.trim() }, {
        onSuccess: () => { toast.success('Category updated'); closeForm(); },
        onError: (err: unknown) => toast.error(getApiErrorMessage(err, 'Failed to update')),
      });
    } else {
      createCat({ name: name.trim() }, {
        onSuccess: () => { toast.success('Category created'); closeForm(); },
        onError: (err: unknown) => toast.error(getApiErrorMessage(err, 'Failed to create')),
      });
    }
  }

  function handleDelete(id: string, catName: string) {
    if (!confirm(`Delete "${catName}"? Properties in this category may be affected.`)) return;
    deleteCat(id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: (err: unknown) => toast.error(getApiErrorMessage(err, 'Failed to delete')),
    });
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display text-2xl'>Categories</h1>
          <p className='text-body text-sm mt-1'>{categories.length} property types</p>
        </div>
        <Button className='rounded-xl gap-1.5' onClick={openCreate}>
          <Plus className='h-4 w-4' />New category
        </Button>
      </div>

      {showForm && (
        <div className='rounded-2xl border border-border bg-card surface-edge p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-heading text-base'>{editTarget ? 'Edit category' : 'New category'}</p>
            <button onClick={closeForm} className='text-muted-foreground hover:text-foreground transition-colors'>
              <X className='h-4 w-4' />
            </button>
          </div>
          <div className='max-w-xs space-y-1.5'>
            <div className='space-y-1.5'>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Apartment' className='rounded-xl' />
            </div>
          </div>
          <div className='flex gap-2'>
            <Button className='rounded-xl' onClick={handleSave} disabled={creating || updating}>
              {creating || updating ? 'Saving…' : editTarget ? 'Save changes' : 'Create'}
            </Button>
            <Button variant='outline' className='rounded-xl' onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className='h-14 rounded-2xl mb-2' />)
        : categories.length === 0 ? <EmptyCard message='No categories yet.' />
        : (
          <div className='rounded-2xl border border-border bg-card surface-edge overflow-hidden'>
            {categories.map((cat, i) => (
              <div key={cat.id} className={cn('flex items-center justify-between px-5 py-4', i < categories.length - 1 && 'border-b border-border')}>
                <div className='flex items-center gap-3'>
                  <div className='h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0'>
                    <Tag className='h-4 w-4 text-muted-foreground' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>{cat.name}</p>
                    <p className='text-xs text-muted-foreground'>{cat.description}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button size='icon' variant='ghost' className='h-8 w-8 rounded-lg' onClick={() => openEdit(cat)}>
                    <Pencil className='h-3.5 w-3.5' />
                  </Button>
                  <Button size='icon' variant='ghost' className='h-8 w-8 rounded-lg' onClick={() => handleDelete(cat.id, cat.name)} disabled={deleting}>
                    <Trash2 className='h-3.5 w-3.5 text-destructive' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

/* ─── Shared ─────────────────────────────────────────────── */
function EmptyCard({ message }: { message: string }) {
  return (
    <div className='rounded-2xl border border-border border-dashed bg-card p-10 text-center'>
      <p className='text-body text-sm'>{message}</p>
    </div>
  );
}
