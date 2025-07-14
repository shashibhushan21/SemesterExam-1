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
import React from 'react';

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
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';

  if (isMobile) {
    return (
       <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-800 via-purple-700 to-pink-600 shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
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
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-800 via-purple-700 to-pink-600 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
           <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <span className={cn(
                  "text-lg font-medium text-white/80 transition-colors hover:text-white hover:scale-105 transform",
                  pathname === link.href && "text-white font-bold"
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
