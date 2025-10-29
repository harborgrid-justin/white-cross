/**
 * Comprehensive Metadata Generation Utilities
 *
 * Provides utilities for generating SEO-optimized metadata for all pages
 * Supports Open Graph, Twitter Cards, and structured data (JSON-LD)
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

import type { Metadata } from 'next';

/**
 * Base application metadata
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
 * Generate metadata for a specific page
 */
export interface PageMetadataConfig {
  /**
   * Page title (will be templated with " | White Cross")
   */
  title: string;

  /**
   * Page description
   */
  description: string;

  /**
   * Additional keywords
   */
  keywords?: string[];

  /**
   * Canonical URL path
   */
  path?: string;

  /**
   * Open Graph image override
   */
  ogImage?: string;

  /**
   * Disable indexing for this specific page
   */
  noIndex?: boolean;

  /**
   * Structured data (JSON-LD)
   */
  structuredData?: Record<string, any>;
}

/**
 * Generate metadata for a page with HIPAA-compliant defaults
 *
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: 'Student Management',
 *   description: 'Manage student health records and information',
 *   path: '/students',
 * });
 * ```
 */
export function generateMetadata(config: PageMetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '',
    ogImage,
    noIndex = true, // Default to no indexing for HIPAA compliance
  } = config;

  const url = `${baseMetadata.metadataBase}${path}`;

  return {
    title,
    description,
    keywords: [...(baseMetadata.keywords || []), ...keywords],
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          noarchive: true,
        }
      : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: ogImage ? [ogImage] : baseMetadata.twitter?.images,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export interface StructuredDataConfig {
  type: 'Organization' | 'WebApplication' | 'MedicalOrganization' | 'SoftwareApplication';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  [key: string]: any;
}

/**
 * Create JSON-LD structured data script
 *
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: generateStructuredData({
 *     type: 'MedicalOrganization',
 *     name: 'White Cross Healthcare'
 *   })}}
 * />
 * ```
 */
export function generateStructuredData(config: StructuredDataConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whitecross.healthcare';

  const baseData = {
    '@context': 'https://schema.org',
    '@type': config.type,
    name: config.name || 'White Cross Healthcare Platform',
    description:
      config.description ||
      'Enterprise healthcare platform for school nurses',
    url: config.url || baseUrl,
    logo: config.logo || `${baseUrl}/logo.png`,
  };

  return JSON.stringify({ ...baseData, ...config }, null, 2);
}

/**
 * Common structured data templates
 */
export const structuredDataTemplates = {
  /**
   * Organization structured data
   */
  organization: (): StructuredDataConfig => ({
    type: 'MedicalOrganization',
    name: 'White Cross Healthcare',
    description: 'Enterprise healthcare platform for school nurses',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://whitecross.healthcare',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX',
      contactType: 'Customer Support',
      availableLanguage: 'English',
    },
    sameAs: [
      // Social media profiles
      'https://twitter.com/whitecrosshc',
      'https://linkedin.com/company/whitecross',
    ],
  }),

  /**
   * Software application structured data
   */
  softwareApplication: (): StructuredDataConfig => ({
    type: 'SoftwareApplication',
    name: 'White Cross Healthcare Platform',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  }),
};

/**
 * Healthcare-specific metadata generators
 */
export const healthcareMetadata = {
  /**
   * Student management page metadata
   */
  students: () =>
    generateMetadata({
      title: 'Student Management',
      description: 'Manage student health records, demographics, and emergency contacts',
      keywords: ['student records', 'health information', 'demographics'],
      path: '/students',
    }),

  /**
   * Medication management page metadata
   */
  medications: () =>
    generateMetadata({
      title: 'Medication Management',
      description: 'Track and administer student medications with compliance monitoring',
      keywords: ['medications', 'prescriptions', 'administration', 'compliance'],
      path: '/medications',
    }),

  /**
   * Health records page metadata
   */
  healthRecords: () =>
    generateMetadata({
      title: 'Health Records',
      description: 'Comprehensive student health records and medical history',
      keywords: ['health records', 'medical history', 'immunizations'],
      path: '/health-records',
    }),

  /**
   * Appointments page metadata
   */
  appointments: () =>
    generateMetadata({
      title: 'Appointments',
      description: 'Schedule and manage student health appointments',
      keywords: ['appointments', 'scheduling', 'calendar'],
      path: '/appointments',
    }),

  /**
   * Incident reports page metadata
   */
  incidents: () =>
    generateMetadata({
      title: 'Incident Reports',
      description: 'Document and track student health incidents and injuries',
      keywords: ['incidents', 'injuries', 'documentation', 'reporting'],
      path: '/incidents',
    }),

  /**
   * Compliance page metadata
   */
  compliance: () =>
    generateMetadata({
      title: 'Compliance Tracking',
      description: 'HIPAA compliance monitoring and audit logs',
      keywords: ['HIPAA', 'compliance', 'audit logs', 'security'],
      path: '/compliance',
    }),

  /**
   * Dashboard page metadata
   */
  dashboard: () =>
    generateMetadata({
      title: 'Dashboard',
      description: 'Healthcare management dashboard with real-time insights',
      keywords: ['dashboard', 'analytics', 'overview'],
      path: '/dashboard',
    }),
};

/**
 * Viewport configuration for mobile optimization
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
