/**
 * Cache Configuration for Next.js v16
 *
 * Centralized cache strategies following Next.js v16 best practices,
 * partial prerendering (PPR) preparation, and HIPAA compliance requirements.
 *
 * **Next.js v16 Features:**
 * - Enhanced unstable_cache() API for server-side caching
 * - Improved cache invalidation with granular tag management
 * - Partial prerendering (PPR) cache hints and strategies
 * - Edge runtime compatibility for global deployment
 * - Better fetch() cache integration
 * - Streaming and progressive enhancement support
 *
 * @module lib/cache/config
 * @version 2.0.0 - Next.js v16 compatible
 */

/**
 * Cache strategy types (enhanced for Next.js v16)
 */
export type CacheStrategy = 'no-cache' | 'edge-cache' | 'short' | 'medium' | 'long' | 'static' | 'ppr-dynamic' | 'ppr-static';

/**
 * Next.js v16 Cache configuration for different data types
 *
 * **Next.js v16 Enhancements:**
 * - PPR (Partial Prerendering) cache hints
 * - Edge runtime compatibility 
 * - Enhanced cache invalidation patterns
 * - Better fetch() integration
 *
 * HIPAA Compliance Notes:
 * - PHI data uses shorter cache times (15-30 seconds)
 * - Non-PHI reference data can be cached longer
 * - All cached data is invalidated on mutations
 * - Edge caching excludes PHI data
 */
export const CACHE_STRATEGIES = {
  /**
   * No caching - for real-time data
   * Use for: Active sessions, live notifications, sensitive PHI operations
   * Next.js v16: Compatible with streaming and dynamic rendering
   */
  'no-cache': {
    revalidate: 0,
    description: 'No caching - always fetch fresh',
    pprHint: 'dynamic',
    edgeCompatible: true
  },

  /**
   * Edge cache - 5-10 seconds for global CDN
   * Use for: Public data, frequently accessed non-PHI content
   * Next.js v16: Optimized for edge runtime and global distribution
   */
  'edge-cache': {
    revalidate: 10,
    description: 'Edge cache for global CDN distribution',
    pprHint: 'static',
    edgeCompatible: true
  },

  /**
   * Short cache - 15-30 seconds
   * Use for: PHI data (students, health records, medications)
   * Next.js v16: Enhanced with better invalidation patterns
   */
  short: {
    revalidate: 15,
    description: 'Short cache for sensitive PHI data',
    pprHint: 'dynamic',
    edgeCompatible: false // PHI data should not be edge cached
  },

  /**
   * Medium cache - 1-5 minutes
   * Use for: Analytics, reports, document lists
   * Next.js v16: Optimized for partial prerendering
   */
  medium: {
    revalidate: 60,
    description: 'Medium cache for moderately changing data',
    pprHint: 'static',
    edgeCompatible: true
  },

  /**
   * Long cache - 10-30 minutes
   * Use for: Reference data, configuration, static content
   * Next.js v16: Perfect for PPR static shells
   */
  long: {
    revalidate: 600,
    description: 'Long cache for rarely changing data',
    pprHint: 'static',
    edgeCompatible: true
  },

  /**
   * Static - cache indefinitely until revalidated
   * Use for: Truly static content, assets
   * Next.js v16: Ideal for PPR static components
   */
  static: {
    revalidate: false,
    description: 'Static cache - revalidate only on-demand',
    pprHint: 'static',
    edgeCompatible: true
  },

  /**
   * PPR Dynamic - for dynamic content in partial prerendering
   * Use for: User-specific data, personalized content
   * Next.js v16: Optimized for PPR dynamic boundaries
   */
  'ppr-dynamic': {
    revalidate: 0,
    description: 'PPR dynamic content - no cache',
    pprHint: 'dynamic',
    edgeCompatible: false
  },

  /**
   * PPR Static - for static content in partial prerendering
   * Use for: Static shells, shared layouts, public content
   * Next.js v16: Optimized for PPR static boundaries
   */
  'ppr-static': {
    revalidate: 3600, // 1 hour
    description: 'PPR static content - long cache',
    pprHint: 'static',
    edgeCompatible: true
  }
} as const;

/**
 * Resource-specific cache configurations (Next.js v16 Enhanced)
 * Maps resource types to their appropriate cache strategies
 * 
 * **Next.js v16 Enhancements:**
 * - PPR hints for optimal rendering boundaries
 * - Edge compatibility flags
 * - Enhanced tag management
 */
export const RESOURCE_CACHE_CONFIG = {
  // PHI Data - Short cache
  students: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['students', 'phi-data'] as string[],
    description: 'Student health records (PHI)',
    pprHint: 'dynamic' as const,
    edgeCompatible: false
  },

  healthRecords: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['health-records', 'phi-data'] as string[],
    description: 'Health records (highly sensitive PHI)',
    pprHint: 'dynamic' as const,
    edgeCompatible: false
  },

  medications: {
    strategy: 'short' as CacheStrategy,
    revalidate: 15,
    tags: ['medications', 'phi-data'] as string[],
    description: 'Medication records (PHI)',
    pprHint: 'dynamic' as const,
    edgeCompatible: false
  },

  appointments: {
    strategy: 'short' as CacheStrategy,
    revalidate: 30,
    tags: ['appointments', 'phi-data'] as string[],
    description: 'Appointment records (PHI)',
    pprHint: 'dynamic' as const,
    edgeCompatible: false
  },

  incidents: {
    strategy: 'short' as CacheStrategy,
    revalidate: 30,
    tags: ['incidents', 'phi-data'] as string[],
    description: 'Incident reports (PHI)',
    pprHint: 'dynamic' as const,
    edgeCompatible: false
  },

  // Reference Data - Medium to Long cache
  documents: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 60,
    tags: ['documents'] as string[],
    description: 'Document listings and metadata',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  analytics: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 300,
    tags: ['analytics', 'reports'] as string[],
    description: 'Analytics and reporting data',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  compliance: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 300,
    tags: ['compliance', 'audit-logs'] as string[],
    description: 'Compliance and audit data',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  // Configuration - Long cache
  configuration: {
    strategy: 'long' as CacheStrategy,
    revalidate: 600,
    tags: ['configuration', 'settings'] as string[],
    description: 'System configuration and settings',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  districts: {
    strategy: 'long' as CacheStrategy,
    revalidate: 1800,
    tags: ['districts', 'reference-data'] as string[],
    description: 'District information',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  schools: {
    strategy: 'long' as CacheStrategy,
    revalidate: 1800,
    tags: ['schools', 'reference-data'] as string[],
    description: 'School information',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  // Billing - Medium cache (financial data)
  billing: {
    strategy: 'medium' as CacheStrategy,
    revalidate: 60,
    tags: ['billing', 'financial-data'] as string[],
    description: 'Billing and financial records',
    pprHint: 'static' as const,
    edgeCompatible: true
  },

  // Settings - Long cache (user preferences)
  settings: {
    strategy: 'long' as CacheStrategy,
    revalidate: 600,
    tags: ['settings', 'user-preferences'] as string[],
    description: 'User settings and preferences',
    pprHint: 'static' as const,
    edgeCompatible: true
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
 * **Next.js v16 Enhanced:**
 * - Better tag composition for edge caching
 * - PPR-compatible tag patterns
 * - Improved invalidation granularity
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
    tags.push(`${resourceName}-${resourceId}`); // Allow dynamic tags for specific resources
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
 * Cache-Control header values (Next.js v16 Enhanced)
 * These are returned in API responses for client-side caching
 * 
 * **Next.js v16 Features:**
 * - Enhanced edge caching headers
 * - PPR-compatible cache directives
 * - Better stale-while-revalidate support
 */
export const CACHE_CONTROL_HEADERS = {
  'no-cache': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'edge-cache': 'public, max-age=10, s-maxage=10, stale-while-revalidate=60',
  short: 'private, max-age=15, s-maxage=15, stale-while-revalidate=30',
  medium: 'private, max-age=60, s-maxage=60, stale-while-revalidate=120',
  long: 'private, max-age=600, s-maxage=600, stale-while-revalidate=1200',
  static: 'public, max-age=31536000, immutable',
  'ppr-dynamic': 'no-store, no-cache, must-revalidate',
  'ppr-static': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
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
 * Route segment config presets (Next.js v16 Enhanced)
 * Use these as export const values in route handlers
 * 
 * **Next.js v16 Features:**
 * - PPR (Partial Prerendering) configurations
 * - Enhanced dynamic rendering controls
 * - Better edge runtime support
 */
export const ROUTE_CONFIGS = {
  /**
   * Dynamic - always revalidate
   * Use for: User-specific data, real-time features
   * Next.js v16: Compatible with PPR dynamic boundaries
   */
  dynamic: {
    dynamic: 'force-dynamic' as const,
    revalidate: 0,
    runtime: 'nodejs' as const
  },

  /**
   * Static with ISR - revalidate periodically
   * Use for: Public pages, dashboards
   * Next.js v16: Perfect for PPR static shells
   */
  static: {
    dynamic: 'force-static' as const,
    revalidate: 3600, // 1 hour
    runtime: 'nodejs' as const
  },

  /**
   * Edge - optimized for edge runtime
   * Use for: Global API routes, edge functions
   * Next.js v16: Enhanced edge runtime compatibility
   */
  edge: {
    dynamic: 'force-dynamic' as const,
    runtime: 'edge' as const,
    revalidate: 0
  },

  /**
   * PPR Static - for partial prerendering static parts
   * Use for: Static layouts, navigation, shared components
   * Next.js v16: Optimized for PPR static boundaries
   */
  pprStatic: {
    dynamic: 'force-static' as const,
    revalidate: 3600,
    runtime: 'nodejs' as const,
    experimental_ppr: true as const
  },

  /**
   * PPR Dynamic - for partial prerendering dynamic parts
   * Use for: User content, personalized sections
   * Next.js v16: Optimized for PPR dynamic boundaries  
   */
  pprDynamic: {
    dynamic: 'force-dynamic' as const,
    revalidate: 0,
    runtime: 'nodejs' as const,
    experimental_ppr: true as const
  },

  /**
   * Auto - let Next.js decide
   * Use for: Most pages
   * Next.js v16: Enhanced automatic optimization
   */
  auto: {
    dynamic: 'auto' as const
  }
} as const;

// ==========================================
// NEXT.JS V16 PPR UTILITIES
// ==========================================

/**
 * PPR cache hint generator
 * Helps optimize partial prerendering boundaries
 * 
 * @param resourceType - Type of resource being cached
 * @param isUserSpecific - Whether the content is user-specific
 * @returns PPR hint for optimal rendering
 */
export function getPPRHint(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  isUserSpecific: boolean = false
): 'static' | 'dynamic' {
  const config = RESOURCE_CACHE_CONFIG[resourceType];
  
  // User-specific or PHI data should be dynamic
  if (isUserSpecific || config.tags.includes('phi-data')) {
    return 'dynamic';
  }
  
  return config.strategy === 'static' || config.strategy === 'long' ? 'static' : 'dynamic';
}

/**
 * Edge compatibility checker
 * Determines if a resource can be cached at the edge
 * 
 * @param resourceType - Type of resource being cached
 * @returns Whether the resource is edge-compatible
 */
export function isEdgeCompatible(resourceType: keyof typeof RESOURCE_CACHE_CONFIG): boolean {
  const config = RESOURCE_CACHE_CONFIG[resourceType];
  
  // PHI data should never be cached at the edge
  if (config.tags.includes('phi-data')) {
    return false;
  }
  
  // Public, non-sensitive data can be edge cached
  return ['long', 'static', 'medium'].includes(config.strategy);
}

/**
 * Generate Next.js v16 fetch options
 * Creates optimized fetch configuration for enhanced caching
 * 
 * @param resourceType - Type of resource being cached
 * @param resourceId - Optional resource ID for granular caching
 * @returns Next.js v16 fetch options
 */
export function generateV16FetchOptions(
  resourceType: keyof typeof RESOURCE_CACHE_CONFIG,
  resourceId?: string
) {
  const config = RESOURCE_CACHE_CONFIG[resourceType];
  const tags = generateCacheTags(resourceType, resourceId);
  
  return {
    next: {
      revalidate: config.revalidate,
      tags: tags as string[], // Type assertion for dynamic tags
    },
    // Add edge caching headers if compatible
    ...(isEdgeCompatible(resourceType) && {
      cache: 'force-cache' as const,
    }),
  };
}
