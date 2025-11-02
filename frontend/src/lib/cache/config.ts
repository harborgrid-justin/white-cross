/**
 * Cache Configuration for Next.js v16
 *
 * Centralized cache strategies following Next.js best practices
 * and HIPAA compliance requirements for healthcare data.
 *
 * @module lib/cache/config
 */

/**
 * Cache strategy types
 */
export type CacheStrategy = 'no-cache' | 'short' | 'medium' | 'long' | 'static';

/**
 * Cache configuration for different data types
 *
 * HIPAA Compliance Notes:
 * - PHI data uses shorter cache times (15-30 seconds)
 * - Non-PHI reference data can be cached longer
 * - All cached data is invalidated on mutations
 */
export const CACHE_STRATEGIES = {
  /**
   * No caching - for real-time data
   * Use for: Active sessions, live notifications
   */
  'no-cache': {
    revalidate: 0,
    description: 'No caching - always fetch fresh'
  },

  /**
   * Short cache - 15-30 seconds
   * Use for: PHI data (students, health records, medications)
   */
  short: {
    revalidate: 15,
    description: 'Short cache for sensitive PHI data'
  },

  /**
   * Medium cache - 1-5 minutes
   * Use for: Analytics, reports, document lists
   */
  medium: {
    revalidate: 60,
    description: 'Medium cache for moderately changing data'
  },

  /**
   * Long cache - 10-30 minutes
   * Use for: Reference data, configuration, static content
   */
  long: {
    revalidate: 600,
    description: 'Long cache for rarely changing data'
  },

  /**
   * Static - cache indefinitely until revalidated
   * Use for: Truly static content
   */
  static: {
    revalidate: false,
    description: 'Static cache - revalidate only on-demand'
  }
} as const;

/**
 * Resource-specific cache configurations
 * Maps resource types to their appropriate cache strategies
 */
export const RESOURCE_CACHE_CONFIG = {
  // PHI Data - Short cache
  students: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['students', 'phi-data'],
    description: 'Student health records (PHI)'
  },

  healthRecords: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['health-records', 'phi-data'],
    description: 'Health records (highly sensitive PHI)'
  },

  medications: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['medications', 'phi-data'],
    description: 'Medication records (PHI)'
  },

  appointments: {
    strategy: 'short' as CacheStrategy,
    revalidate: 30,
    tags: ['appointments', 'phi-data'],
    description: 'Appointment records (PHI)'
  },

  incidents: {
    strategy: 'short' as CacheStrategy,
    revalidate: 30,
    tags: ['incidents', 'phi-data'],
    description: 'Incident reports (PHI)'
  },

  // Reference Data - Medium to Long cache
  documents: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 60,
    tags: ['documents'],
    description: 'Document listings and metadata'
  },

  analytics: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 300,
    tags: ['analytics', 'reports'],
    description: 'Analytics and reporting data'
  },

  compliance: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 300,
    tags: ['compliance', 'audit-logs'],
    description: 'Compliance and audit data'
  },

  // Configuration - Long cache
  configuration: {
    strategy: 'long' as CacheStrategy,
    revalidate: 600,
    tags: ['configuration', 'settings'],
    description: 'System configuration and settings'
  },

  districts: {
    strategy: 'long' as CacheStrategy,
    revalidate: 1800,
    tags: ['districts', 'reference-data'],
    description: 'District information'
  },

  schools: {
    strategy: 'long' as CacheStrategy,
    revalidate: 1800,
    tags: ['schools', 'reference-data'],
    description: 'School information'
  }
} as const;

/**
 * Get cache configuration for a resource type
 */
export function getCacheConfig(resourceType: keyof typeof RESOURCE_CACHE_CONFIG) {
  return RESOURCE_CACHE_CONFIG[resourceType];
}

/**
 * Generate cache tags for a resource
 * Creates hierarchical tags for granular invalidation
 *
 * @example
 * generateCacheTags('students', '123')
 * // Returns: ['students', 'student-123', 'phi-data']
 */
export function generateCacheTags(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  resourceId?: string,
  additionalTags: string[] = []
): string[] {
  const config = RESOURCE_CACHE_CONFIG[resourceType];
  const tags = [...config.tags];

  if (resourceId) {
    // Add resource-specific tag (e.g., 'student-123')
    const resourceName = resourceType.slice(0, -1); // Remove 's' from plural
    tags.push(`${resourceName}-${resourceId}`);
  }

  return [...tags, ...additionalTags];
}

/**
 * Generate related cache tags for cross-resource invalidation
 *
 * @example
 * // When updating a student's health record, invalidate:
 * generateRelatedTags('healthRecords', '123', { studentId: '456' })
 * // Returns: ['health-records', 'health-record-123', 'student-456', ...]
 */
export function generateRelatedTags(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  resourceId: string,
  relations: {
    studentId?: string;
    appointmentId?: string;
    medicationId?: string;
    incidentId?: string;
  } = {}
): string[] {
  const tags = generateCacheTags(resourceType, resourceId);

  // Add related resource tags
  if (relations.studentId) {
    tags.push(`student-${relations.studentId}`);
    tags.push(`student-${relations.studentId}-${resourceType}`);
  }

  if (relations.appointmentId) {
    tags.push(`appointment-${relations.appointmentId}`);
  }

  if (relations.medicationId) {
    tags.push(`medication-${relations.medicationId}`);
  }

  if (relations.incidentId) {
    tags.push(`incident-${relations.incidentId}`);
  }

  return tags;
}

/**
 * Cache-Control header values
 * These are returned in API responses for client-side caching
 */
export const CACHE_CONTROL_HEADERS = {
  'no-cache': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  short: 'private, max-age=15, s-maxage=15, stale-while-revalidate=30',
  medium: 'private, max-age=60, s-maxage=60, stale-while-revalidate=120',
  long: 'private, max-age=600, s-maxage=600, stale-while-revalidate=1200',
  static: 'public, max-age=31536000, immutable'
} as const;

/**
 * Get Cache-Control header for a resource type
 */
export function getCacheControlHeader(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG
): string {
  const config = RESOURCE_CACHE_CONFIG[resourceType];
  return CACHE_CONTROL_HEADERS[config.strategy];
}

/**
 * Route segment config presets
 * Use these as export const values in route handlers
 */
export const ROUTE_CONFIGS = {
  /**
   * Dynamic - always revalidate
   * Use for: User-specific data, real-time features
   */
  dynamic: {
    dynamic: 'force-dynamic' as const,
    revalidate: 0
  },

  /**
   * Static with ISR - revalidate periodically
   * Use for: Public pages, dashboards
   */
  static: {
    dynamic: 'force-static' as const,
    revalidate: 3600 // 1 hour
  },

  /**
   * Auto - let Next.js decide
   * Use for: Most pages
   */
  auto: {
    dynamic: 'auto' as const
  }
} as const;
