/**
 * Base Metadata Configuration
 *
 * Provides base metadata configuration for the White Cross Healthcare Platform
 * including Open Graph, Twitter Cards, icons, and HIPAA-compliant robot settings.
 */

import type { Metadata } from 'next';

/**
 * Base application metadata
 *
 * This serves as the foundation for all page metadata, providing consistent
 * branding, SEO configuration, and HIPAA-compliant robot directives.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://whitecross.healthcare'),
  title: {
    default: 'White Cross Healthcare Platform',
    template: '%s | White Cross',
  },
  description:
    'Enterprise-grade healthcare platform for school nurses to manage student health records, medications, emergency communications, and compliance tracking',
  keywords: [
    'healthcare',
    'school health',
    'school nurse',
    'student health records',
    'medication management',
    'HIPAA compliant',
    'health platform',
    'emergency communications',
    'compliance tracking',
  ],
  authors: [
    {
      name: 'White Cross Healthcare',
      url: 'https://whitecross.healthcare',
    },
  ],
  creator: 'White Cross Healthcare',
  publisher: 'White Cross Healthcare',
  applicationName: 'White Cross',
  robots: {
    index: false, // HIPAA compliance - no indexing
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whitecross.healthcare',
    siteName: 'White Cross Healthcare Platform',
    title: 'White Cross Healthcare Platform',
    description: 'Enterprise healthcare platform for school nurses',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'White Cross Healthcare Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'White Cross Healthcare Platform',
    description: 'Enterprise healthcare platform for school nurses',
    images: ['/twitter-image.png'],
    creator: '@whitecrosshc',
    site: '@whitecrosshc',
  },
  verification: {
    // google: 'verification-code',
    // yandex: 'verification-code',
    // other: { 'me': ['verification-code'] }
  },
  alternates: {
    canonical: 'https://whitecross.healthcare',
  },
  category: 'Healthcare',
};

/**
 * Viewport configuration for mobile optimization
 *
 * Ensures proper responsive behavior and theme color adaptation
 * based on user's preferred color scheme.
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};
