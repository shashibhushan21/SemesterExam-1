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
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[@#$!%*?&]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
});

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
    children: React.ReactNode;
}

export function ChangePasswordDialog({ children }: ChangePasswordDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');

      toast({
        title: 'Password Changed!',
        description: 'Your password has been updated successfully.',
      });
      reset();
      setOpen(false);

    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current and new password below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} {...register('currentPassword')} />
              <button type="button" onClick={() => setShowCurrentPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3"><EyeOff className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
             <div className="relative">
              <Input id="newPassword" type={showNewPassword ? 'text' : 'password'} {...register('newPassword')} />
              <button type="button" onClick={() => setShowNewPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3"><EyeOff className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
             <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} />
              <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="absolute inset-y-0 right-0 flex items-center pr-3"><EyeOff className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
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
