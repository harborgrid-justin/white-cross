/**
 * Cache utilities barrel export - Consolidated
 *
 * This module now re-exports from the consolidated services/cache/
 * for unified caching management while maintaining backward compatibility.
 *
 * @module lib/cache
 * @updated 2025-11-12 - Consolidated with services/cache/
 */

// ============================================================================
// CONSOLIDATED CACHE SERVICE (RECOMMENDED)
// ============================================================================

/**
 * Consolidated Cache Service - All-in-one caching solution
 * Recommended for new code - provides unified caching API
 */
export {
  CacheService,
  cacheService,
} from '@/services/cache';

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

/**
 * Legacy Next.js v16 cache configuration
 */
export * from './config';

/**
 * Legacy cache invalidation utilities
 */
export * from './invalidation';

/**
 * Healthcare-specific cache configurations (now consolidated)
 */
export {
  TTL_CONFIG,
  REFETCH_STRATEGIES,
} from '@/services/cache';

/**
 * Cache Module Overview
 *
 * This module provides a comprehensive caching toolkit for the White Cross
 * healthcare platform, designed with HIPAA compliance and Next.js v16 features.
 *
 * **NEW: Consolidated Architecture**
 * - All caching functionality now unified in services/cache/
 * - Enterprise-grade caching with healthcare-specific configurations
 * - Single source of truth for caching strategies
 *
 * Key Features:
 *
 * 1. **Consolidated Cache Service**
 *    - Unified API for all caching operations
 *    - Next.js v16 PPR support and edge compatibility
 *    - Healthcare-specific TTL configurations
 *    - PHI-aware caching (no edge caching for sensitive data)
 *
 * 2. **Next.js v16 Cache Strategies**
 *    - PPR (Partial Prerendering) hints
 *    - Edge runtime compatibility
 *    - Enhanced cache invalidation patterns
 *    - Better fetch() cache integration
 *
 * 3. **Healthcare-Specific Configurations**
 *    - PHI data protection (short TTL, no edge caching)
 *    - Critical data handling (allergies, medications)
 *    - Reference data optimization (schools, grades)
 *    - User preference caching
 *
 * 4. **Cache Invalidation**
 *    - Granular tag-based invalidation
 *    - Automatic cleanup of stale data
 *    - Conflict resolution for concurrent updates
 *
 * HIPAA Compliance Features:
 * - PHI data never cached on edge
 * - Short TTL for sensitive healthcare data
 * - Automatic invalidation on data mutations
 * - Audit logging for cache operations
 * - Secure cache key management
 *
 * Migration Guide:
 * - **New Code**: Use `cacheService` from `@/services/cache`
 * - **Existing Code**: Continue using `@/lib/cache` imports (backward compatible)
 * - **Advanced Use Cases**: Access individual managers when needed
 *
 * Module Dependencies:
 * - Compatible with Next.js v16 App Router
 * - React Query integration
 * - IndexedDB for persistence
 * - Web Crypto API for cache key hashing
 *
 * Related Modules:
 * - @/services/cache - Consolidated caching services (primary)
 * - @/hooks/cache - React hooks for cache operations
 * - @/middleware/cache - Cache middleware for Next.js
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/caching | Next.js v16 Caching}
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/index.html | HIPAA Security Rule}
 */
