/**
 * @fileoverview Cache Configuration Constants
 * @module lib/cache/constants
 *
 * Standardized cache TTL (Time To Live) configuration for the application.
 * Implements a tiered caching strategy based on data sensitivity and freshness requirements.
 *
 * **HIPAA Compliance:**
 * - PHI data has shorter TTLs (30-60s) to minimize stale data exposure
 * - Static data can cache longer (300s) for performance
 * - All cache keys use IDs only, never PHI values
 *
 * **Performance Strategy:**
 * - Aggressive caching for static reference data
 * - Conservative caching for frequently changing data
 * - Minimal caching for real-time data
 *
 * @see DATABASE_INTEGRATION_AUDIT_REPORT.md for detailed caching strategy
 * @version 1.0.0
 * @since 2025-10-27
 */

// ==========================================
// CACHE TTL CONSTANTS (seconds)
// ==========================================

/**
 * Cache Time-To-Live Configuration
 *
 * All values in seconds. Aligned with Next.js `revalidate` API.
 *
 * **Tier Breakdown:**
 * - **STATIC**: Reference data that rarely changes (schools, districts, medication formulary)
 * - **STATS**: Aggregated statistics (non-PHI dashboard data)
 * - **PHI_FREQUENT**: Frequently accessed PHI (active medications, today's appointments)
 * - **PHI_STANDARD**: Standard PHI access (student lists, health records lists)
 * - **SESSION**: User session data (profile, preferences)
 * - **REALTIME**: Real-time data (notifications, unread messages)
 */
export const CACHE_TTL = {
  /**
   * Static reference data - rarely changes
   * Examples: Schools, districts, medication formulary, form templates
   * TTL: 5 minutes (300 seconds)
   */
  STATIC: 300,

  /**
   * Aggregated statistics - non-PHI
   * Examples: Dashboard stats, analytics, reports
   * TTL: 2 minutes (120 seconds)
   */
  STATS: 120,

  /**
   * PHI data - frequently accessed
   * Examples: Active medications, today's appointments, recent health alerts
   * TTL: 30 seconds
   * Rationale: High-sensitivity data that changes frequently
   */
  PHI_FREQUENT: 30,

  /**
   * PHI data - standard access
   * Examples: Student lists, health records lists, incident lists
   * TTL: 1 minute (60 seconds)
   * Rationale: Moderate sensitivity, reasonable freshness for list views
   */
  PHI_STANDARD: 60,

  /**
   * User session data
   * Examples: Current user profile, user preferences, role permissions
   * TTL: 5 minutes (300 seconds)
   * Rationale: Rarely changes during session, safe to cache
   */
  SESSION: 300,

  /**
   * Real-time data - minimal caching
   * Examples: Notifications, unread message counts, active alerts
   * TTL: 10 seconds
   * Rationale: Needs near real-time updates
   */
  REALTIME: 10,

  /**
   * No caching - always fetch fresh
   * Use for critical operations or data that must always be fresh
   * TTL: 0 (forces revalidation)
   */
  NO_CACHE: 0,
} as const;

// ==========================================
// CACHE TAGS FOR GRANULAR INVALIDATION
// ==========================================

/**
 * Cache Tags for Next.js revalidateTag() API
 *
 * Used to invalidate specific data without clearing entire cache.
 *
 * **Usage:**
 * ```typescript
 * // In Server Component
 * fetch(url, {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD,
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // In Server Action (to invalidate)
 * import { revalidateTag } from 'next/cache';
 * revalidateTag(CACHE_TAGS.STUDENTS);
 * ```
 */
export const CACHE_TAGS = {
  // ==========================================
  // PHI TAGS (HIPAA-protected data)
  // ==========================================

  /**
   * General PHI data tag
   * Use to invalidate all PHI-related caches
   */
  PHI: 'phi-data',

  /**
   * Student data (PHI)
   */
  STUDENTS: 'students',

  /**
   * Medication data (PHI)
   */
  MEDICATIONS: 'medications',

  /**
   * Health record data (PHI)
   */
  HEALTH_RECORDS: 'health-records',

  /**
   * Appointment data (PHI)
   */
  APPOINTMENTS: 'appointments',

  /**
   * Incident report data (PHI)
   */
  INCIDENTS: 'incidents',

  /**
   * Immunization data (PHI)
   */
  IMMUNIZATIONS: 'immunizations',

  /**
   * Allergy data (PHI)
   */
  ALLERGIES: 'allergies',

  /**
   * Emergency contact data (PHI)
   */
  EMERGENCY_CONTACTS: 'emergency-contacts',

  // ==========================================
  // NON-PHI TAGS
  // ==========================================

  /**
   * User account data (non-PHI)
   */
  USERS: 'users',

  /**
   * School data (non-PHI)
   */
  SCHOOLS: 'schools',

  /**
   * District data (non-PHI)
   */
  DISTRICTS: 'districts',

  /**
   * Dashboard statistics (non-PHI aggregated)
   */
  STATS: 'statistics',

  /**
   * Analytics data (non-PHI aggregated)
   */
  ANALYTICS: 'analytics',

  /**
   * Notification data
   */
  NOTIFICATIONS: 'notifications',

  /**
   * Document templates (non-PHI)
   */
  TEMPLATES: 'templates',

  /**
   * Medication formulary (non-PHI)
   */
  FORMULARY: 'medication-formulary',
} as const;

// ==========================================
// TYPE EXPORTS
// ==========================================

/**
 * Cache TTL values type (for TypeScript type safety)
 */
export type CacheTTLValue = typeof CACHE_TTL[keyof typeof CACHE_TTL];

/**
 * Cache tag values type (for TypeScript type safety)
 */
export type CacheTagValue = typeof CACHE_TAGS[keyof typeof CACHE_TAGS];

// ==========================================
// HELPER UTILITIES
// ==========================================

/**
 * Determine appropriate cache TTL based on data type
 *
 * @param resourceType - Type of resource (e.g., 'students', 'medications')
 * @param isPHI - Whether the data contains PHI
 * @param isFrequentlyAccessed - Whether the data is frequently accessed
 * @returns Appropriate cache TTL in seconds
 *
 * @example
 * ```typescript
 * const ttl = getCacheTTL('medications', true, true);
 * console.log(ttl); // 30 (PHI_FREQUENT)
 * ```
 */
export function getCacheTTL(
  resourceType: string,
  isPHI: boolean,
  isFrequentlyAccessed: boolean = false
): number {
  if (!isPHI) {
    // Non-PHI data
    if (resourceType === 'users' || resourceType === 'schools' || resourceType === 'districts') {
      return CACHE_TTL.STATIC;
    }
    if (resourceType === 'statistics' || resourceType === 'analytics') {
      return CACHE_TTL.STATS;
    }
    if (resourceType === 'notifications') {
      return CACHE_TTL.REALTIME;
    }
    return CACHE_TTL.SESSION; // Default for non-PHI
  }

  // PHI data
  if (isFrequentlyAccessed) {
    return CACHE_TTL.PHI_FREQUENT;
  }
  return CACHE_TTL.PHI_STANDARD;
}

/**
 * Get cache tags for a resource type
 *
 * @param resourceType - Type of resource
 * @param isPHI - Whether the data contains PHI
 * @returns Array of cache tags to apply
 *
 * @example
 * ```typescript
 * const tags = getCacheTags('students', true);
 * console.log(tags); // ['students', 'phi-data']
 * ```
 */
export function getCacheTags(
  resourceType: string,
  isPHI: boolean = true
): string[] {
  const tags: string[] = [];

  // Add resource-specific tag
  if (resourceType === 'students') {
    tags.push(CACHE_TAGS.STUDENTS);
  } else if (resourceType === 'medications') {
    tags.push(CACHE_TAGS.MEDICATIONS);
  } else if (resourceType === 'health-records') {
    tags.push(CACHE_TAGS.HEALTH_RECORDS);
  } else if (resourceType === 'appointments') {
    tags.push(CACHE_TAGS.APPOINTMENTS);
  } else if (resourceType === 'incidents') {
    tags.push(CACHE_TAGS.INCIDENTS);
  } else if (resourceType === 'users') {
    tags.push(CACHE_TAGS.USERS);
  } else if (resourceType === 'statistics') {
    tags.push(CACHE_TAGS.STATS);
  }

  // Add PHI tag if applicable
  if (isPHI) {
    tags.push(CACHE_TAGS.PHI);
  }

  return tags;
}

/**
 * Build cache tag for specific resource instance
 *
 * @param resourceType - Type of resource
 * @param resourceId - ID of specific resource
 * @returns Cache tag string
 *
 * @example
 * ```typescript
 * const tag = buildResourceTag('student', '123');
 * console.log(tag); // 'student-123'
 * ```
 */
export function buildResourceTag(
  resourceType: string,
  resourceId: string
): string {
  return `${resourceType}-${resourceId}`;
}

// ==========================================
// DOCUMENTATION
// ==========================================

/**
 * Cache Strategy Documentation
 *
 * **Decision Framework:**
 *
 * 1. **Is it PHI?**
 *    - YES → Use PHI_FREQUENT (30s) or PHI_STANDARD (60s)
 *    - NO → Continue to #2
 *
 * 2. **How often does it change?**
 *    - Rarely (reference data) → STATIC (300s)
 *    - Moderately (aggregated stats) → STATS (120s)
 *    - Frequently (real-time) → REALTIME (10s)
 *
 * 3. **Is it user-specific?**
 *    - YES → SESSION (300s)
 *    - NO → Use type-based TTL
 *
 * **HIPAA Compliance Notes:**
 * - All PHI cache entries MUST have tags for invalidation
 * - Cache keys MUST NOT contain PHI values (use IDs only)
 * - PHI caches MUST be cleared on user logout
 * - Audit logging required for PHI cache access
 *
 * **Performance Guidelines:**
 * - Prefer longer TTLs for static data (reduces backend load)
 * - Use shorter TTLs for PHI (compliance requirement)
 * - Always tag caches for granular invalidation
 * - Monitor cache hit rates and adjust TTLs accordingly
 *
 * **Examples:**
 *
 * ```typescript
 * // Example 1: Fetch student list (PHI, standard access)
 * const students = await fetch('/api/students', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_STANDARD, // 60s
 *     tags: [CACHE_TAGS.STUDENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 2: Fetch medication formulary (non-PHI, static)
 * const formulary = await fetch('/api/medications/formulary', {
 *   next: {
 *     revalidate: CACHE_TTL.STATIC, // 300s
 *     tags: [CACHE_TAGS.FORMULARY]
 *   }
 * });
 *
 * // Example 3: Fetch today's appointments (PHI, frequent)
 * const appointments = await fetch('/api/appointments/today', {
 *   next: {
 *     revalidate: CACHE_TTL.PHI_FREQUENT, // 30s
 *     tags: [CACHE_TAGS.APPOINTMENTS, CACHE_TAGS.PHI]
 *   }
 * });
 *
 * // Example 4: Fetch current user (non-PHI, session)
 * const user = await fetch('/api/auth/me', {
 *   next: {
 *     revalidate: CACHE_TTL.SESSION, // 300s
 *     tags: [CACHE_TAGS.USERS]
 *   }
 * });
 * ```
 */

// Export all constants and utilities
export default {
  CACHE_TTL,
  CACHE_TAGS,
  getCacheTTL,
  getCacheTags,
  buildResourceTag,
};
