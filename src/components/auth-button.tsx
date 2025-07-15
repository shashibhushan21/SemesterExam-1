'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthButton() {
  // This is a placeholder. In a real app, you'd have logic to show
  // a user menu if logged in, or the login button if not.
  const isLoggedIn = false; 

  if (isLoggedIn) {
    // Replace with a real user menu/avatar dropdown
    return <Button variant="ghost">Profile</Button>;
  }

  return (
    <Link href="/auth" passHref>
      <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">Login</Button>
    </Link>
  );
}
