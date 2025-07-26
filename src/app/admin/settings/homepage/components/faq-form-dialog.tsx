
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
  question: z.string().min(10, 'Question is required'),
  answer: z.string().min(10, 'Answer is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface FaqFormDialogProps {
    children: React.ReactNode;
    item?: FormValues & { _id: string };
    onFinished: () => void;
}

export function FaqFormDialog({ children, item, onFinished }: FaqFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: item?.question || '',
      answer: item?.answer || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = item ? `/api/admin/homepage/faqs/${item._id}` : '/api/admin/homepage/faqs';
      const method = item ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: `FAQ successfully ${item ? 'updated' : 'added'}.` });
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
          <DialogTitle>{item ? 'Edit' : 'Add'} FAQ</DialogTitle>
          <DialogDescription>
            Fill out the form to {item ? 'update the' : 'add a new'} FAQ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input id="question" {...form.register('question')} />
                {form.formState.errors.question && <p className="text-sm text-destructive">{form.formState.errors.question.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea id="answer" {...form.register('answer')} />
                {form.formState.errors.answer && <p className="text-sm text-destructive">{form.formState.errors.answer.message}</p>}
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
