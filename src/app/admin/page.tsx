
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Users, FileText, BarChart, Edit, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from '../profile/components/edit-profile-dialog';
import { ChangePasswordDialog } from '../profile/components/change-password-dialog';

export default function AdminPage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleProfileUpdate = (updatedUser: any) => {
    updateUser(updatedUser);
  };

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    );
  }
  
  if (user.role !== 'admin') {
      return (
          <div className="flex items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-lg">
                <Shield className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You do not have permission to view this page.
                </AlertDescription>
            </Alert>
          </div>
      )
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome, {user.name}. Manage your application here.</p>
        </div>
        <div className="flex gap-2">
           <EditProfileDialog user={user} onProfileUpdate={handleProfileUpdate}>
              <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
           </EditProfileDialog>
           <ChangePasswordDialog>
               <Button variant="outline"><KeyRound className="mr-2 h-4 w-4" /> Change Password</Button>
           </ChangePasswordDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Total registered users</p>
            <Button variant="outline" size="sm" className="mt-4">View Users</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Total notes uploaded</p>
             <Link href="/upload">
                <Button variant="outline" size="sm" className="mt-4 mr-2">Upload Note</Button>
             </Link>
             <Button variant="outline" size="sm" className="mt-4">View Notes</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Analytics</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">New users this month</p>
            <Button variant="outline" size="sm" className="mt-4">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
