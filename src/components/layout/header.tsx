'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AuthButton } from '@/components/auth-button';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          {isMobile && <SidebarTrigger />}
        </div>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
