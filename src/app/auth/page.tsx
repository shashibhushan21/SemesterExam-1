
import { AuthForm } from './components/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientOnly } from '@/components/client-only';

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Welcome to ExamNotes</CardTitle>
          <CardDescription>Sign in to your account or create a new one to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientOnly>
            <AuthForm />
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}
