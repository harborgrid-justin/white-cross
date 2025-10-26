/**
 * Root Layout for White Cross Healthcare Platform
 *
 * This is the root layout that wraps the entire application.
 * It provides global providers, styles, and configuration.
 *
 * @remarks
 * - Provides Redux store
 * - Provides TanStack Query client
 * - Provides authentication context
 * - Applies global styles (Tailwind CSS)
 * - Sets up error boundaries
 * - Configures monitoring (Sentry, DataDog)
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | White Cross',
    default: 'White Cross - School Health Management Platform',
  },
  description: 'Enterprise-grade healthcare platform for school nurses to manage student health records, medications, emergency communications, and compliance tracking.',
  keywords: ['school health', 'student health records', 'medication management', 'HIPAA compliant', 'healthcare platform'],
  authors: [{ name: 'White Cross Team' }],
  creator: 'White Cross',
  publisher: 'White Cross',
  robots: {
    index: false, // Disable indexing for healthcare application
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
