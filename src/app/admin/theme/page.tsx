
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

function hslStringToHex(hslStr: string): string {
    if (!hslStr) return '#000000';
    const [h, s, l] = hslStr.split(' ').map(parseFloat);
    const sDecimal = s / 100;
    const lDecimal = l / 100;
    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lDecimal - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }

    const toHex = (c: number) => ('0' + Math.round(c * 255).toString(16)).slice(-2);
    return `#${toHex(r + m)}${toHex(g + m)}${toHex(b + m)}`;
}

function hexToHslString(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}


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
        <label htmlFor={`${name}-color-picker`} className="relative w-8 h-8 rounded-md border cursor-pointer" style={{ background: `hsl(${form.watch(name)})` }}>
           <input
                id={`${name}-color-picker`}
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={hslStringToHex(form.watch(name))}
                onChange={(e) => {
                    form.setValue(name, hexToHslString(e.target.value), { shouldDirty: true });
                }}
            />
        </label>
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

