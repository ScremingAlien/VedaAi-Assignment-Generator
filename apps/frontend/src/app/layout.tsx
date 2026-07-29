import OfflineBanner from '@/components/common/OfflineBanner';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/lib/provider/query-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: 'VedaAI',
  description: 'AI Powered Assessment Generator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', bricolageGrotesque.variable, inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
        <OfflineBanner />
      </body>
    </html>
  );
}
