/**
 * Comprehensive Metadata Generation Utilities
 *
 * Provides utilities for generating SEO-optimized metadata for all pages
 * Supports Open Graph, Twitter Cards, and structured data (JSON-LD)
 *
 * This is the main barrel export file that re-exports all metadata utilities
 * to maintain backward compatibility and provide a single import point.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

// Type definitions
export type { PageMetadataConfig, StructuredDataConfig } from './metadata.types';

// Base configuration
export { baseMetadata, viewport } from './metadata.base';

// Core generation functions
export { generateMetadata, generateStructuredData } from './metadata.generators';

// Structured data templates
export { structuredDataTemplates } from './metadata.structured';

// Healthcare-specific metadata
export { healthcareMetadata } from './metadata.healthcare';
