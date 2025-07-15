import { ResetPasswordForm } from './components/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage({ params }: { params: { token: string }}) {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below. Make sure it's a strong one!</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={params.token} />
        </CardContent>
      </Card>
    </div>
  );
}
