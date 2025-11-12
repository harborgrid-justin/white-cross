/**
 * @fileoverview UI Utilities Barrel Export
 * @module utils/exports/ui
 * @category Utils
 *
 * UI-related utilities including:
 * - Class name manipulation
 * - Toast notifications
 * - Metadata generation for SEO
 * - Debug logging
 *
 * @example
 * ```typescript
 * import { cn, showSuccessToast, showErrorToast } from '@/utils';
 * import { generateMetadata, healthcareMetadata } from '@/utils';
 * import { createLogger } from '@/utils';
 * ```
 */

// ============================================================================
// CLASS NAME UTILITY
// ============================================================================

/**
 * Class Name Utility
 * Merges class names with proper Tailwind CSS handling.
 */
export { cn } from '../cn';

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

/**
 * Toast Notifications
 * Wrapper functions for consistent toast notifications with test support.
 */
export {
  showSuccessToast,
  showErrorToast,
  toast,
} from '../toast';

// ============================================================================
// METADATA UTILITIES
// ============================================================================

/**
 * Metadata Generation
 * SEO-optimized metadata generation for all pages with Open Graph,
 * Twitter Cards, and structured data support.
 */
export {
  baseMetadata,
  viewport,
  generateMetadata,
  generateStructuredData,
  structuredDataTemplates,
  healthcareMetadata,
} from '../metadata';

export type { PageMetadataConfig, StructuredDataConfig } from '../metadata';

// ============================================================================
// DEBUG AND LOGGING
// ============================================================================

/**
 * Debug and Logging Utilities
 * Namespaced debug logging for development and troubleshooting.
 */
export { createLogger } from '../debug';
