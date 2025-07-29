
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/hooks/use-auth';
import { connectToDatabase } from '@/lib/db';
import Theme from '@/models/theme';
import { ClientOnly } from '@/components/client-only';

export const metadata: Metadata = {
  title: 'SemesterExam',
  description: 'Find Notes by Semester & Subject.',
};

async function getThemeSettings() {
    try {
        await connectToDatabase();
        let theme = await Theme.findOne().lean();
        if (!theme) {
            // If no theme is in DB, create a default one to prevent errors
            theme = await new Theme().save();
        }
        return theme;
    } catch (error) {
        console.error("Failed to fetch theme settings, using default.", error);
        // Return default values in case of DB error
        return {
          primary: "262 84% 59%", background: "222 84% 4%", card: "222 84% 4.9%",
          cardForeground: "210 40% 98%", popover: "222 84% 4.9%", popoverForeground: "210 40% 98%",
          secondary: "217 33% 17%", secondaryForeground: "210 40% 98%", muted: "217 33% 17%",
          mutedForeground: "215 20% 65%", accent: "217 33% 17%", accentForeground: "210 40% 98%",
          destructive: "0 63% 31%", destructiveForeground: "210 40% 98%", border: "217 33% 17%",
          input: "217 33% 17%", ring: "262 84% 59%"
        };
    }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();

  const themeVariables = `
    :root {
      --background: ${theme.background};
      --foreground: ${theme.cardForeground};
      --card: ${theme.card};
      --card-foreground: ${theme.cardForeground};
      --popover: ${theme.popover};
      --popover-foreground: ${theme.popoverForeground};
      --primary: ${theme.primary};
      --primary-foreground: ${theme.secondaryForeground};
      --secondary: ${theme.secondary};
      --secondary-foreground: ${theme.secondaryForeground};
      --muted: ${theme.muted};
      --muted-foreground: ${theme.mutedForeground};
      --accent: ${theme.accent};
      --accent-foreground: ${theme.accentForeground};
      --destructive: ${theme.destructive};
      --destructive-foreground: ${theme.destructiveForeground};
      --border: ${theme.border};
      --input: ${theme.input};
      --ring: ${theme.ring};
    }
    .dark {
      --background: ${theme.background};
      --foreground: ${theme.cardForeground};
      --card: ${theme.card};
      --card-foreground: ${theme.cardForeground};
      --popover: ${theme.popover};
      --popover-foreground: ${theme.popoverForeground};
      --primary: ${theme.primary};
      --primary-foreground: ${theme.secondaryForeground};
      --secondary: ${theme.secondary};
      --secondary-foreground: ${theme.secondaryForeground};
      --muted: ${theme.muted};
      --muted-foreground: ${theme.mutedForeground};
      --accent: ${theme.accent};
      --accent-foreground: ${theme.accentForeground};
      --destructive: ${theme.destructive};
      --destructive-foreground: ${theme.destructiveForeground};
      --border: ${theme.border};
      --input: ${theme.input};
      --ring: ${theme.ring};
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: themeVariables }} />
      </head>
      <body className={cn("font-body antialiased", "bg-background text-foreground")}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-blue-800 via-purple-700 to-pink-600"></div>
            <Header />
            <main className="relative container mx-auto flex-grow px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
