'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, University, GraduationCap, Star, Shield, Zap, GitBranch, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const featureCards = [
  {
    icon: Star,
    title: "Premium Access",
    description: "Unlock exclusive notes, summaries, and more.",
    cta: "Upgrade Now",
  },
  {
    icon: Shield,
    title: "Account Security",
    description: "Manage your password and secure your account.",
    cta: "Manage Settings",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description: "Get AI-powered tools to accelerate your learning.",
    cta: "Explore Tools",
  },
];


export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
       <div className="space-y-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
         </div>
       </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback className="text-3xl">{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h1 className="text-4xl font-bold font-headline">{user.displayName || 'Anonymous User'}</h1>
          <p className="text-muted-foreground text-lg">Your personal dashboard</p>
        </div>
         <Button variant="destructive" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="font-headline">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-4">
                <University className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">West Bengal University of Technology</span>
              </div>
              <div className="flex items-center gap-4">
                <GitBranch className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Computer Science</span>
              </div>
               <div className="flex items-center gap-4">
                <GraduationCap className="w-5 h-5 text-muted-foreground" />
                <Badge variant="secondary">6th Semester</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
           {featureCards.map((feature, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-xl hover:scale-105">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-2 bg-accent/50 rounded-full">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="outline" className="w-full">{feature.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
