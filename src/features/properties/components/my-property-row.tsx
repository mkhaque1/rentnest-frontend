'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useDeleteProperty } from '../hooks/use-property-mutations';
import { Property } from '@/types/property';
import { getApiErrorMessage } from '@/lib/api-error';

export function MyPropertyRow({ property }: { property: Property }) {
  const { mutate: deleteProperty, isPending } = useDeleteProperty();
  const propertyDetails =
    property.bedrooms !== undefined && property.bathrooms !== undefined
      ? `${property.bedrooms} bed · ${property.bathrooms} bath`
      : property.type ?? property.category.name;

  function handleDelete() {
    deleteProperty(property.id, {
      onSuccess: () => toast.success('Property deleted'),
      onError: (err: unknown) => {
        const msg = getApiErrorMessage(err, 'Failed to delete');
        if (msg.toLowerCase().includes('foreign key') || msg.toLowerCase().includes('rental')) {
          toast.error('Cannot delete — this property has rental requests. Cancel or complete them first.');
        } else {
          toast.error(msg);
        }
      },
    });
  }

  return (
    <div className='flex items-center justify-between rounded-xl border border-border bg-card surface-edge p-5'>
      <div>
        <p className='text-heading text-base'>{property.title}</p>
        <p className='text-caption text-muted-foreground mt-1'>
          {property.location} · ৳{Number(property.price).toLocaleString()}/mo ·{' '}
          {propertyDetails}
        </p>
      </div>

      <div className='flex items-center gap-2'>
        <Badge variant='outline' className='capitalize'>
          {property.status.toLowerCase()}
        </Badge>
        <Button variant='ghost' size='icon' asChild>
          <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
            <Pencil className='h-4 w-4' />
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Trash2 className='h-4 w-4 text-destructive' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this property?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The listing will be permanently removed.
                <br /><br />
                <span className='text-amber-400 font-medium'>Note:</span> Properties with active rental requests cannot be deleted. Cancel or complete all rentals first.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
