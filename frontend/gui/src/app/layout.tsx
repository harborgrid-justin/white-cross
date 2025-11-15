/**
 * Root Layout - Next.js App Router
 * Provides HTML structure and global configuration
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GUI Builder - Next.js Drag & Drop Page Builder',
  description: 'A powerful drag-and-drop GUI builder for creating Next.js pages',
  keywords: ['nextjs', 'gui builder', 'page builder', 'drag and drop', 'react'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
