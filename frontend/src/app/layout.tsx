/**
 * @fileoverview Root Layout Component for White Cross Healthcare Platform
 *
 * This is the main root layout component that wraps the entire application.
 * It provides the HTML structure, global providers, and base styling for all pages.
 *
 * @module app/layout
 * @category Layout
 * @subcategory Root
 *
 * @security
 * - Provides Redux Provider for state management
 * - Includes React Query Provider for server state
 * - Apollo Client Provider for GraphQL
 * - Auth Provider for authentication context
 * - HIPAA compliant base configuration
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Layouts}
 * @see {@link https://nextjs.org/docs/messages/missing-root-layout-tags | Root Layout Requirements}
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

/**
 * Inter font configuration
 * Using Inter as the primary font for better readability in healthcare applications
 */
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

/**
 * Root metadata configuration
 * Provides base SEO and application metadata for the entire application
 */
export const metadata: Metadata = {
  title: {
    template: '%s | White Cross Healthcare',
    default: 'White Cross Healthcare Platform',
  },
  description: 'Comprehensive healthcare management platform for student health services with HIPAA-compliant medical records, appointment scheduling, medication tracking, and health analytics.',
  keywords: [
    'healthcare management',
    'student health services',
    'medical records',
    'electronic health records',
    'appointments scheduling',
    'medication administration',
    'HIPAA compliant',
    'school health',
    'health analytics',
    'incident reporting',
    'immunization tracking'
  ],
  authors: [{ name: 'White Cross Healthcare' }],
  creator: 'White Cross Healthcare',
  publisher: 'White Cross Healthcare',
  applicationName: 'White Cross Healthcare Platform',
  category: 'Healthcare',
  classification: 'Healthcare Management System',
  robots: {
    index: false, // Prevent indexing of healthcare platform
    follow: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'White Cross Healthcare',
    title: 'White Cross Healthcare Platform',
    description: 'Comprehensive healthcare management platform for student health services with HIPAA-compliant medical records and health analytics.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'White Cross Healthcare Platform',
    description: 'Comprehensive healthcare management platform for student health services.',
  },
};

/**
 * Props interface for the RootLayout component
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout Component
 *
 * This is the main layout component that must include <html> and <body> tags
 * as required by Next.js App Router. It wraps the entire application with
 * necessary providers and global styling.
 *
 * **Key Features:**
 * - HTML5 semantic structure with proper lang attribute
 * - Global font configuration (Inter)
 * - Provider hierarchy for state management
 * - Base CSS imports and variables
 * - Accessibility attributes
 * - HIPAA compliant base setup
 *
 * **Provider Hierarchy:**
 * 1. Redux Provider - Global state management
 * 2. React Query Provider - Server state management
 * 3. Apollo Provider - GraphQL client
 * 4. Auth Provider - Authentication context
 * 5. Navigation Provider - Navigation state
 *
 * @param {RootLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - All page content
 *
 * @returns {JSX.Element} The complete HTML document structure
 *
 * @example
 * ```tsx
 * // This layout automatically wraps ALL pages in the application
 * // The structure will be:
 * <html>
 *   <body>
 *     <Providers>
 *       {children} // All page content goes here
 *     </Providers>
 *   </body>
 * </html>
 * ```
 *
 * @remarks
 * - This component MUST include <html> and <body> tags per Next.js requirements
 * - The Providers component handles all client-side provider setup
 * - Font variables are applied at the html level for global access
 * - This is a Server Component that hydrates client providers
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
