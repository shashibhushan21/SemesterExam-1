'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, University, GitBranch, GraduationCap, Shield, LogOut, Loader2, Edit, KeyRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { EditProfileDialog } from "./components/edit-profile-dialog";
import { ChangePasswordDialog } from "./components/change-password-dialog";

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };
  
  const onProfileUpdate = (updatedUser: any) => {
    updateUser(updatedUser);
  };

  if (loading || !user) {
    return (
       <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-3xl">{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h1 className="text-4xl font-bold font-headline">{user.name || 'Anonymous User'}</h1>
          <p className="text-muted-foreground text-lg">Your personal dashboard</p>
        </div>
         <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="transition-all duration-300 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Your Information</CardTitle>
                <EditProfileDialog user={user} onProfileUpdate={onProfileUpdate}>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                </EditProfileDialog>
            </CardHeader>
            <CardContent className="space-y-4 text-lg">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span>{user.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-4">
                <University className="w-5 h-5 text-muted-foreground" />
                <span>{user.college || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-4">
                <GitBranch className="w-5 h-5 text-muted-foreground" />
                <span>{user.branch || "Not provided"}</span>
              </div>
               <div className="flex items-center gap-4">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <span>{user.semester || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card className="transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Account Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage your password and secure your account.</p>
                 <ChangePasswordDialog>
                    <Button variant="outline" className="w-full"><KeyRound className="mr-2 h-4 w-4" /> Change Password</Button>
                </ChangePasswordDialog>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
