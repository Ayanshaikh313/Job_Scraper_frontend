import type { Metadata } from 'next';
import { RootLayoutWrapper } from '@/components/RootLayoutWrapper';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Job Scraper Platform',
  description: 'Search and manage jobs with role-based access',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
