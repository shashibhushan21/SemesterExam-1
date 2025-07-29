
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Users, FileText, Home, Palette, Settings, Edit, KeyRound, Info, Mail, MessageSquare, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EditProfileDialog } from '../profile/components/edit-profile-dialog';
import { ChangePasswordDialog } from '../profile/components/change-password-dialog';

interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  totalReviews: number;
  newUsersThisMonth: number;
}

export default function AdminPage() {
  const { user, loading, fetchUser } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    async function fetchStats() {
      try {
        setStatsLoading(true);
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    if (user && user.role === 'admin') {
        fetchStats();
    }
  }, [user, loading, router]);
  
  const handleProfileUpdate = async () => {
    await fetchUser();
  };

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
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
                    You do not have permission to view this page. Redirecting...
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
                 <Skeleton className="h-8 w-1/2 mt-1" />
            ) : (
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered users</p>
            <Link href="/admin/users" passHref>
                <Button variant="outline" size="sm" className="mt-4">View Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
                 <Skeleton className="h-8 w-1/2 mt-1" />
            ) : (
                <div className="text-2xl font-bold">{stats?.totalNotes}</div>
            )}
            <p className="text-xs text-muted-foreground">Total notes uploaded</p>
             <Link href="/upload">
                <Button variant="outline" size="sm" className="mt-4 mr-2">Upload Note</Button>
             </Link>
             <Link href="/admin/notes" passHref>
                <Button variant="outline" size="sm" className="mt-4">View Notes</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
                 <Skeleton className="h-8 w-1/2 mt-1" />
            ) : (
                <div className="text-2xl font-bold">{stats?.totalReviews}</div>
            )}
            <p className="text-xs text-muted-foreground">Total reviews submitted</p>
             <Link href="/admin/reviews" passHref>
                <Button variant="outline" size="sm" className="mt-4">View Reviews</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">View site usage and content statistics.</p>
            <Link href="/admin/analytics" passHref>
                <Button variant="outline" size="sm" className="mt-4">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Homepage Settings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">Manage homepage sections like features, FAQs etc.</p>
            <Link href="/admin/settings/homepage" passHref>
                <Button variant="outline" size="sm" className="mt-4">Go to Settings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">About Page Settings</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">Manage the content of the about page.</p>
            <Link href="/admin/settings/about" passHref>
                <Button variant="outline" size="sm" className="mt-4">Go to Settings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Page Settings</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">Update contact email, phone, and address.</p>
            <Link href="/admin/settings/contact" passHref>
                <Button variant="outline" size="sm" className="mt-4">Go to Settings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">Manage universities, subjects, branches and more.</p>
            <Link href="/admin/settings" passHref>
                <Button variant="outline" size="sm" className="mt-4">Go to Settings</Button>
            </Link>
          </CardContent>
        </Card>

         <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Theme Settings</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-1">Customize the look and feel of your entire website.</p>
            <Link href="/admin/theme" passHref>
                <Button variant="outline" size="sm" className="mt-4">Edit Theme</Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

    