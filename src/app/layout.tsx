import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['100', '300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'RentNest — Find your next home',
  description: 'Browse, request, and rent properties with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={`dark ${inter.variable}`}>
      <body className='font-sans antialiased'>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster theme='dark' position='top-center' />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
