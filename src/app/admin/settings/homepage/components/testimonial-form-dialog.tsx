
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  quote: z.string().min(10, 'Quote is required'),
  author: z.string().min(3, 'Author is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface TestimonialFormDialogProps {
    children: React.ReactNode;
    item?: FormValues & { _id: string };
    onFinished: () => void;
}

export function TestimonialFormDialog({ children, item, onFinished }: TestimonialFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quote: item?.quote || '',
      author: item?.author || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = item ? `/api/admin/homepage/testimonials/${item._id}` : '/api/admin/homepage/testimonials';
      const method = item ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: `Testimonial successfully ${item ? 'updated' : 'added'}.` });
      onFinished();
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
          <DialogTitle>{item ? 'Edit' : 'Add'} Testimonial</DialogTitle>
          <DialogDescription>
            Fill out the form to {item ? 'update the' : 'add a new'} testimonial.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="quote">Quote</Label>
                <Textarea id="quote" {...form.register('quote')} />
                {form.formState.errors.quote && <p className="text-sm text-destructive">{form.formState.errors.quote.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...form.register('author')} />
                {form.formState.errors.author && <p className="text-sm text-destructive">{form.formState.errors.author.message}</p>}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
