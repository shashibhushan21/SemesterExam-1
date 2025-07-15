

'use client';
import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';
import { AppSidebar } from './sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/universities', label: 'Universities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const closeSidebar = () => setIsSidebarOpen(false);

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

        <div className="flex items-center gap-4">
           {isMounted ? (
            <>
              <div className="hidden md:block">
                <AuthButton />
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <AuthButton />
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background p-0">
                    <SheetHeader className="p-4 border-b">
                       <SheetTitle>
                        <Logo />
                      </SheetTitle>
                    </SheetHeader>
                    <AppSidebar onLinkClick={closeSidebar} />
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
             <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-24 hidden md:block" />
                <Skeleton className="h-10 w-10 md:hidden" />
                <Skeleton className="h-10 w-10 md:hidden" />
              </div>
          )}
        </div>
      </div>
    </header>
  );
}
