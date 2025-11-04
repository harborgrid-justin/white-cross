/**
 * Structured Data Templates
 *
 * Pre-configured templates for common structured data (JSON-LD) types
 * used across the White Cross Healthcare Platform.
 *
 * @see https://schema.org/
 */

import type { StructuredDataConfig } from './metadata.types';

/**
 * Common structured data templates
 *
 * These templates provide ready-to-use structured data configurations
 * for common schema.org types used throughout the application.
 */
export const structuredDataTemplates = {
  /**
   * Organization structured data
   *
   * Creates a MedicalOrganization schema with contact information
   * and social media profiles.
   *
   * @returns MedicalOrganization structured data configuration
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
   *
   * Creates a SoftwareApplication schema with pricing and rating
   * information for the healthcare platform.
   *
   * @returns SoftwareApplication structured data configuration
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
