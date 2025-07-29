
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const aboutSchema = z.object({
  title: z.string().min(10, 'Title is required'),
  description: z.string().min(20, 'Description is required'),
  missionTitle: z.string().min(5, 'Mission title is required'),
  missionContent: z.string().min(20, 'Mission content is required'),
});

type FormValues = z.infer<typeof aboutSchema>;

export default function AboutSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    async function fetchAboutContent() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings/about');
        if (!res.ok) throw new Error('Failed to fetch about page content.');
        const data = await res.json();
        form.reset(data.about);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchAboutContent();
  }, [form, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/settings/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      toast({ title: 'Success!', description: 'About page content updated successfully.' });
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (name: keyof FormValues, label: string, type: 'input' | 'textarea') => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {type === 'input' ? (
        <Input id={name} {...form.register(name)} />
      ) : (
        <Textarea id={name} {...form.register(name)} rows={4} />
      )}
      {form.formState.errors[name] && <p className="text-sm text-destructive">{form.formState.errors[name]?.message}</p>}
    </div>
  );
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-24 w-full" />
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
                <Info /> About Page Settings
                </CardTitle>
                <CardDescription>
                Update the main title, description, and mission statement for the public "About Us" page.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">Main Content</h3>
                    <div className="space-y-4">
                        {renderField('title', 'Page Title', 'input')}
                        {renderField('description', 'Page Description', 'textarea')}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-medium mb-4">Mission Section</h3>
                     <div className="space-y-4">
                        {renderField('missionTitle', 'Mission Title', 'input')}
                        {renderField('missionContent', 'Mission Content', 'textarea')}
                    </div>
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

    