'use client';

import { useState } from 'react';
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

export function RequestRentalButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg' className='w-full'>
          Request to rent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request this property</DialogTitle>
        </DialogHeader>

        {/* Form logic and submission wired up in the next step,
            once we build the auth flow this depends on */}
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='moveInDate'>Move-in date</Label>
            <Input id='moveInDate' type='date' />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='message'>Message (optional)</Label>
            <Textarea
              id='message'
              placeholder='Anything the landlord should know?'
            />
          </div>
          <Button className='w-full'>Submit request</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
