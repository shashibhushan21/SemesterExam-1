
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
  name: z.string().min(2, 'Name is required'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description is required'),
  bannerUrl: z.string().url('Must be a valid URL'),
});

type FormValues = z.infer<typeof formSchema>;

interface UniversityFormDialogProps {
    children: React.ReactNode;
    university?: FormValues & { _id: string }; // Optional university for editing
    onFinished: () => void;
}

export function UniversityFormDialog({ children, university, onFinished }: UniversityFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: university?.name || '',
      location: university?.location || '',
      description: university?.description || '',
      bannerUrl: university?.bannerUrl || 'https://placehold.co/1200x300.png',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const url = university ? `/api/admin/settings/universities/${university._id}` : '/api/admin/settings/universities';
      const method = university ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({ title: 'Success!', description: `University successfully ${university ? 'updated' : 'added'}.` });
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
          <DialogTitle>{university ? 'Edit' : 'Add'} University</DialogTitle>
          <DialogDescription>
            Fill out the form to {university ? 'update the' : 'add a new'} university.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register('name')} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register('location')} />
                {form.formState.errors.location && <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="bannerUrl">Banner Image URL</Label>
                <Input id="bannerUrl" {...form.register('bannerUrl')} />
                {form.formState.errors.bannerUrl && <p className="text-sm text-destructive">{form.formState.errors.bannerUrl.message}</p>}
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
