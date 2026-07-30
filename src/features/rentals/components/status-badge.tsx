import { Badge } from '@/components/ui/badge';
import { RENTAL_STATUS_CONFIG } from '@/constants/rental';
import { RentalStatus } from '@/types/rental';

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  const config = RENTAL_STATUS_CONFIG[status];
  return (
    <Badge variant='outline' className={config.className}>
      {config.label}
    </Badge>
  );
}
