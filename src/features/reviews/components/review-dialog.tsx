'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useCreateReview } from '../hooks/use-create-review';
import { getApiErrorMessage } from '@/lib/api-error';

export function ReviewDialog({ rentalRequestId }: { rentalRequestId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { mutate, isPending } = useCreateReview();

  function handleSubmit() {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (comment.trim().length < 5) {
      toast.error('Comment must be at least 5 characters');
      return;
    }

    mutate(
      { rentalRequestId, rating, comment },
      {
        onSuccess: () => {
          toast.success('Review submitted — thank you!');
          setOpen(false);
        },
        onError: (err: unknown) => {
          toast.error(getApiErrorMessage(err, 'Could not submit review'));
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your stay</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type='button' onClick={() => setRating(star)}>
                <Star
                  className={cn(
                    'h-7 w-7 transition-colors',
                    star <= rating
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground',
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder='How was your experience?'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className='w-full'
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Submitting...' : 'Submit review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
