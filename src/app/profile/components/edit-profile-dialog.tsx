'use client';

import { useState, useRef } from 'react';
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

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
    user: any;
    children: React.ReactNode;
    onProfileUpdate: (updatedUser: any) => void;
}

export function EditProfileDialog({ user, children, onProfileUpdate }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      phone: user.phone || '',
      college: user.college || '',
      branch: user.branch || '',
      semester: user.semester || '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // First, upload avatar if it has changed
      let avatarUrl = user.avatar;
      const avatarFile = data.avatar?.[0];
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const uploadRes = await fetch('/api/profile/upload-avatar', {
          method: 'POST',
          body: formData,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Avatar upload failed');
        avatarUrl = uploadResult.avatarUrl;
      }

      // Then, update the rest of the details
      const detailsToUpdate = { ...data, avatar: avatarUrl };
      const res = await fetch('/api/profile/update-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detailsToUpdate),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({
        title: 'Profile Updated!',
        description: 'Your information has been saved.',
      });
      onProfileUpdate(result.user);
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
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <Input
                  id="avatar"
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    handleAvatarChange(e);
                  }}
                />
              )}
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Change Photo
            </Button>
          </div>
          
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
      </DialogContent>
    </Dialog>
  );
}
