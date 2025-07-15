'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, GraduationCap, Info, Mail } from 'lucide-react';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: Book },
  { href: '/universities', label: 'Universities', icon: GraduationCap },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <nav className="flex-grow p-4 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <span
                  className={cn(
                    'flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
