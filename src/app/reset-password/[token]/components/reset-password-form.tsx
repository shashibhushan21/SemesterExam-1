'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[@#$!%*?&]/, 'Password must contain at least one special character (@, #, $, etc.)'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password, token }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      toast({
        title: 'Success!',
        description: 'Your password has been reset. Please log in with your new password.',
      });
      router.push('/auth');

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
         <div className="relative">
            <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pr-10"
                {...register('password')}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
         <div className="relative">
            <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="pr-10"
                {...register('confirmPassword')}
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Reset Password
      </Button>
    </form>
  );
}
