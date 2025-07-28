
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Rating } from '@/lib/types';


const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a star rating.'),
  review: z.string().min(10, 'Review must be at least 10 characters long.').max(500, 'Review must be less than 500 characters.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface NoteReviewDialogProps {
    children: React.ReactNode;
    noteId: string;
    userRating: Rating | null;
    onReviewSubmit: () => void;
}

export function NoteReviewDialog({ children, noteId, userRating, onReviewSubmit }: NoteReviewDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: userRating?.rating || 0,
      review: userRating?.review || '',
    },
  });
  
  const watchedRating = form.watch('rating');

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: 'Your review has been submitted.' });
      onReviewSubmit();
      setOpen(false);

    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{userRating ? 'Edit Your Review' : 'Leave a Review'}</DialogTitle>
          <DialogDescription>
            Share your thoughts about this note with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
               <Controller
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-8 h-8 cursor-pointer transition-colors",
                          watchedRating >= star
                            ? "text-yellow-500 fill-yellow-400"
                            : "text-gray-400 fill-gray-600"
                        )}
                        onClick={() => field.onChange(star)}
                      />
                    ))}
                  </div>
                )}
              />
              {form.formState.errors.rating && <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea id="review" {...form.register('review')} rows={5} placeholder="What did you think of these notes? Were they helpful?" />
              {form.formState.errors.review && <p className="text-sm text-destructive">{form.formState.errors.review.message}</p>}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Review
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

