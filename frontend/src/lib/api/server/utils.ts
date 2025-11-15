/**
 * @fileoverview Utility Functions for Next.js API Client
 * @module lib/api/nextjs-client.utils
 * @category API Client
 *
 * This module provides utility functions for cache tag management and
 * resource identification in the Next.js caching system.
 *
 * @version 1.0.0
 * @since 2025-11-12
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Build cache tags for a resource
 *
 * Generates an array of cache tags for use with Next.js cache invalidation.
 * Supports resource-specific tags and PHI (Protected Health Information) classification.
 *
 * @param resourceType - Type of resource (e.g., 'students', 'medications')
 * @param isPHI - Whether the data contains PHI (default: true)
 * @param additionalTags - Additional tags to include
 * @returns Array of cache tags
 *
 * @example
 * ```typescript
 * const tags = buildCacheTags('students', true, ['active']);
 * // Returns: ['students', 'phi-data', 'active']
 * ```
 *
 * @example
 * ```typescript
 * const tags = buildCacheTags('public-announcements', false);
 * // Returns: ['public-announcements']
 * ```
 */
export function buildCacheTags(
  resourceType: string,
  isPHI: boolean = true,
  additionalTags: string[] = []
): string[] {
  const tags: string[] = [resourceType];

  if (isPHI) {
    tags.push('phi-data');
  }

  return [...tags, ...additionalTags];
}

/**
 * Build resource-specific cache tag
 *
 * Creates a cache tag for a specific resource instance, useful for
 * targeted cache invalidation when updating individual records.
 *
 * @param resourceType - Type of resource (e.g., 'student', 'medication')
 * @param resourceId - ID of specific resource
 * @returns Cache tag string in format: {resourceType}-{resourceId}
 *
 * @example
 * ```typescript
 * const tag = buildResourceTag('student', '123');
 * // Returns: 'student-123'
 * ```
 *
 * @example
 * ```typescript
 * const tag = buildResourceTag('medication', 'med-456');
 * // Returns: 'medication-med-456'
 * ```
 */
export function buildResourceTag(
  resourceType: string,
  resourceId: string
): string {
  return `${resourceType}-${resourceId}`;
}
