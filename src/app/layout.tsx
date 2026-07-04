import type { Metadata } from 'next';
import { RootLayoutWrapper } from '@/components/RootLayoutWrapper';
import './globals.css';

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
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-gray-50" suppressHydrationWarning>
        <RootLayoutWrapper>{children}</RootLayoutWrapper>
      </body>
    </html>
  );
}
