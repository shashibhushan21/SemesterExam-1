
'use client';
import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';
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
  const pathname = usePathname();

  return (
     <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-800 via-purple-700 to-pink-600 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <span className={cn(
                "relative text-lg font-medium text-white/80 transition-colors hover:text-white",
                "after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-yellow-400 after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100",
                pathname === link.href && "text-white after:scale-x-100"
              )}>
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <AuthButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
            <AuthButton />
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
        </div>
      </div>
    </header>
  );
}
