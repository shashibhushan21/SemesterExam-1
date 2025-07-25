
'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from './components/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Welcome to ExamNotes</CardTitle>
          <CardDescription>Sign in to your account or create a new one to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          {isMounted ? (
            <AuthForm />
          ) : (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
