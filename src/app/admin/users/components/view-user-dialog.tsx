
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, University, GitBranch, GraduationCap, Shield, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ViewUserDialogProps {
    children: React.ReactNode;
    userId: string;
}

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    status: 'active' | 'blocked';
    avatar?: string;
    phone?: string;
    college?: string;
    branch?: string;
    semester?: string;
    createdAt: string;
    updatedAt: string;
}

export function ViewUserDialog({ children, userId }: ViewUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = async () => {
    if (user && user._id === userId) return; // Already fetched
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user details');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch user details.', variant: 'destructive' });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };
  
  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
        fetchUserDetails();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Viewing full profile for {loading ? '...' : user?.name}.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="space-y-4 py-4">
             <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                </div>
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : user ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                        <Badge variant={user.status === 'active' ? 'outline' : 'destructive'}>{user.status}</Badge>
                    </div>
                </div>
            </div>
             <div className="space-y-2 text-sm">
                 <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone || "No phone number"}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <University className="w-4 h-4 text-muted-foreground" />
                    <span>{user.college || "No college specified"}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                    <span>{user.branch || "No branch specified"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{user.semester || "No semester specified"}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>Joined on {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
