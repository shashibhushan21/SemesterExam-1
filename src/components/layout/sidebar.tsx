'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Home, UploadCloud, Bookmark, Settings } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload Notes', icon: UploadCloud },
  { href: '/favorites', label: 'My Favorites', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="fixed left-0 top-0 h-full w-[16rem] hidden md:flex flex-col" side="left">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
