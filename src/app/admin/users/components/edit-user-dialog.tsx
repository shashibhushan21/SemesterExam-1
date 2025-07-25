
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditUserDialogProps {
    children: React.ReactNode;
    userId: string;
    onUserUpdate: () => void;
}

export function EditUserDialog({ children, userId, onUserUpdate }: EditUserDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      const data = await res.json();
      reset(data.user); // Populate form with fetched data
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch user details.', variant: 'destructive' });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserDetails();
    }
  }, [open, userId]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({
        title: 'User Updated!',
        description: "The user's information has been saved.",
      });
      onUserUpdate();
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
             <div className="space-y-4 py-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" {...register('phone')} />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Input id="semester" {...register('semester')} />
                        {errors.semester && <p className="text-sm text-destructive">{errors.semester.message}</p>}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input id="college" {...register('college')} />
                    {errors.college && <p className="text-sm text-destructive">{errors.college.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="branch">Branch/Department</Label>
                    <Input id="branch" {...register('branch')} />
                    {errors.branch && <p className="text-sm text-destructive">{errors.branch.message}</p>}
                </div>


                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                    </Button>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
