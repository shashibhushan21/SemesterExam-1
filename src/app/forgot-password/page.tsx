import { ForgotPasswordForm } from './components/forgot-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Forgot Your Password?</CardTitle>
          <CardDescription>No problem. Enter your email below and we'll send you a link to reset it.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
