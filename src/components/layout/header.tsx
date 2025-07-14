'use client';
import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppSidebar } from './sidebar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/universities', label: 'Universities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isMobile) {
    return (
       <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background p-0">
               <AppSidebar />
            </SheetContent>
          </Sheet>
          <Logo />
          <AuthButton />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
           <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <span className={cn(
                  "text-lg font-medium text-white/80 transition-colors hover:text-white",
                  pathname === link.href && "text-white"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
