'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCreateRental } from '../hooks/use-create-rental';

export function RequestRentalButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const { mutate, isPending } = useCreateRental();

  function handleTriggerClick(e: React.MouseEvent) {
    if (!user) {
      e.preventDefault();
      router.push(`/auth/login?redirect=/properties/${propertyId}`);
      return;
    }
    if (user.role !== 'TENANT') {
      e.preventDefault();
      toast.error('Only tenants can request to rent a property');
    }
  }

  function handleSubmit() {
    if (!moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }

    mutate(
      {
        propertyId,
        moveInDate: new Date(moveInDate).toISOString(),
        message: message || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Rental request submitted');
          setOpen(false);
          router.push('/dashboard/tenant');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ?? 'Failed to submit request',
          );
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg' className='w-full' onClick={handleTriggerClick}>
          Request to rent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request this property</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='moveInDate'>Move-in date</Label>
            <Input
              id='moveInDate'
              type='date'
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='message'>Message (optional)</Label>
            <Textarea
              id='message'
              placeholder='Anything the landlord should know?'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
