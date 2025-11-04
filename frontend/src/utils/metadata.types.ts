/**
 * Type Definitions for Metadata Generation
 *
 * Contains all TypeScript interfaces and type definitions used across
 * the metadata generation utilities.
 */

/**
 * Configuration for generating page metadata
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
 * Configuration for generating structured data (JSON-LD)
 */
export interface StructuredDataConfig {
  type: 'Organization' | 'WebApplication' | 'MedicalOrganization' | 'SoftwareApplication';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  [key: string]: unknown;
}
