export const RENTAL_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
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
  ACTIVE: {
    label: 'Active',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-muted text-muted-foreground border-border',
  },
};
