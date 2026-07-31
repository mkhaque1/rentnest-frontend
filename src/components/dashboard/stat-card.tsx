import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export function StatCard({ label, value, icon: Icon, color, bg }: Props) {
  return (
    <div className='rounded-2xl border border-border bg-card surface-edge p-5 space-y-3'>
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
        <Icon className={cn('h-4 w-4', color)} />
      </div>
      <div>
        <p className='text-display text-2xl'>{value}</p>
        <p className='text-caption text-muted-foreground text-xs mt-0.5'>{label}</p>
      </div>
    </div>
  );
}
