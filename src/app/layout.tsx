import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'SemesterExam',
  description: 'Find Notes by Semester & Subject.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "bg-background text-foreground")}>
        <div className="relative flex min-h-screen flex-col">
          <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-blue-800 via-purple-700 to-pink-600"></div>
          <Header />
          <main className="relative container mx-auto flex-grow px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
