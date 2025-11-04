/**
 * Metadata Generation Functions
 *
 * Core utilities for generating page metadata and structured data
 * with HIPAA-compliant defaults and SEO optimization.
 */

import type { Metadata } from 'next';
import type { PageMetadataConfig, StructuredDataConfig } from './metadata.types';
import { baseMetadata } from './metadata.base';

/**
 * Generate metadata for a page with HIPAA-compliant defaults
 *
 * Creates comprehensive metadata for a page including Open Graph,
 * Twitter Cards, and robot directives. By default, all pages are
 * set to noindex/nofollow for HIPAA compliance.
 *
 * @param config - Page metadata configuration
 * @returns Next.js Metadata object
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
    keywords: [
      ...(Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords : []),
      ...keywords
    ],
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
 * Create JSON-LD structured data script
 *
 * Generates a JSON-LD structured data string for SEO purposes.
 * This helps search engines better understand the content and
 * context of your pages.
 *
 * @param config - Structured data configuration
 * @returns JSON-LD string ready for injection into script tag
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
