
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  email: z.string().email('Must be a valid email'),
  phone: z.string().min(10, 'Must be a valid phone number'),
  address: z.string().min(10, 'Address is required'),
});

type FormValues = z.infer<typeof contactSchema>;

export default function ContactSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    async function fetchContactContent() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings/contact');
        if (!res.ok) throw new Error('Failed to fetch contact page content.');
        const data = await res.json();
        form.reset(data.contactDetails);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchContactContent();
  }, [form, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/settings/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      toast({ title: 'Success!', description: 'Contact details updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Mail /> Contact Page Settings
                </CardTitle>
                <CardDescription>
                Update the contact details displayed on the public "Contact Us" page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" {...form.register('email')} />
                    {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input id="phone" {...form.register('phone')} />
                    {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" {...form.register('address')} rows={3} />
                    {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
                </Button>
            </CardFooter>
        </Card>
    </form>
  );
}
