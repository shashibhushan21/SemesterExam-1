
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[@#$!%*?&]/, 'Password must contain at least one special character (@, #, $, etc.)'),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export function AuthForm() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const router = useRouter();
  const { login } = useAuth();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignupForm,
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });


  const onLogin = async (data: LoginValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast({ title: "Login successful!", description: "Welcome back." });
      router.push('/profile');
      router.refresh(); // Crucial for re-fetching server components and updating state
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSignup = async (data: SignupValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      toast({ title: 'Signup successful!', description: 'Logging you in...' });
      resetSignupForm();
      
      await login(data.email, data.password);
      
      toast({ title: "Login successful!", description: "Welcome!" });
      router.push('/profile');
      router.refresh(); // Crucial for re-fetching server components and updating state

    } catch (error: any) {
      toast({ title: 'Signup Failed', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="m@example.com" {...registerLogin('email')} />
            {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
               <Link href="/forgot-password" passHref>
                 <span className="text-sm text-primary hover:underline">Forgot password?</span>
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showLoginPassword ? 'text' : 'password'}
                className="pr-10"
                {...registerLogin('password')}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showLoginPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4 mt-4">
           <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input id="signup-name" type="text" placeholder="John Doe" {...registerSignup('name')} />
            {signupErrors.name && <p className="text-sm text-destructive">{signupErrors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="m@example.com" {...registerSignup('email')} />
             {signupErrors.email && <p className="text-sm text-destructive">{signupErrors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showSignupPassword ? 'text' : 'password'}
                className="pr-10"
                {...registerSignup('password')}
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showSignupPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
             {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
