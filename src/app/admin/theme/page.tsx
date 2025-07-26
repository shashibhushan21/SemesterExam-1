
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const themeSchema = z.object({
  primary: z.string(),
  background: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  popover: z.string(),
  popoverForeground: z.string(),
  secondary: z.string(),
  secondaryForeground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
  destructive: z.string(),
  destructiveForeground: z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
});

type FormValues = z.infer<typeof themeSchema>;

export default function ThemeSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(themeSchema),
  });

  useEffect(() => {
    async function fetchTheme() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/theme');
        if (!res.ok) throw new Error('Failed to fetch theme settings.');
        const data = await res.json();
        form.reset(data.theme);
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, [form, toast]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      toast({ title: 'Success!', description: 'Theme updated successfully. Refresh to see changes.' });
    } catch (error: any) {
      toast({ title: 'Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (name: keyof FormValues, label: string) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={name} {...form.register(name)} className="font-mono text-xs" />
        <div className="w-8 h-8 rounded-md border" style={{ background: `hsl(${form.watch(name)})` }}></div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                 {[...Array(6)].map((_, i) => (
                     <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
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
            <Palette /> Theme Settings
            </CardTitle>
            <CardDescription>
            Customize the look and feel of your website. Enter HSL values (e.g., `262 84% 59%`) for each color. Changes will apply globally after saving.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <h3 className="text-lg font-medium mb-4">Core Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderField('primary', 'Primary')}
                    {renderField('background', 'Background')}
                    {renderField('destructive', 'Destructive')}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Cards & Popovers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderField('card', 'Card Background')}
                    {renderField('cardForeground', 'Card Foreground')}
                    {renderField('popover', 'Popover Background')}
                    {renderField('popoverForeground', 'Popover Foreground')}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Secondary & Muted</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderField('secondary', 'Secondary Background')}
                    {renderField('secondaryForeground', 'Secondary Foreground')}
                    {renderField('muted', 'Muted Background')}
                    {renderField('mutedForeground', 'Muted Foreground')}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Accents & Borders</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderField('accent', 'Accent Background')}
                    {renderField('accentForeground', 'Accent Foreground')}
                    {renderField('border', 'Border')}
                    {renderField('input', 'Input')}
                    {renderField('ring', 'Ring (Focus)')}
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Theme
            </Button>
        </CardFooter>
        </Card>
    </form>
  );
}
