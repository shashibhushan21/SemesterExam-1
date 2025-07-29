
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const editReviewSchema = z.object({
  review: z.string().min(10, 'Review must be at least 10 characters long.'),
  rating: z.coerce.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
});

type EditReviewFormValues = z.infer<typeof editReviewSchema>;

interface Review {
    _id: string;
    review: string;
    rating: number;
}

interface EditReviewDialogProps {
    children: React.ReactNode;
    review: Review;
    onReviewUpdate: () => void;
}

export function EditReviewDialog({ children, review, onReviewUpdate }: EditReviewDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<EditReviewFormValues>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      review: review.review,
      rating: review.rating,
    },
  });
  
  const watchedRating = form.watch('rating');

  const onSubmit = async (data: EditReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: 'Review updated successfully.' });
      onReviewUpdate();
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Make changes to the review below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Rating</Label>
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
              <Label htmlFor="review">Review Text</Label>
              <Textarea id="review" {...form.register('review')} rows={5} />
              {form.formState.errors.review && <p className="text-sm text-destructive">{form.formState.errors.review.message}</p>}
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
