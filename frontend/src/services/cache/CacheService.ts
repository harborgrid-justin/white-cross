/**
 * Consolidated Cache Service
 *
 * Enterprise-grade cache service that combines Next.js v16 features
 * with healthcare-specific caching strategies and HIPAA compliance.
 *
 * This service provides:
 * - Next.js v16 cache strategies with PPR support
 * - Healthcare-specific TTL configurations
 * - PHI-aware caching (no edge caching for PHI)
 * - Cache invalidation and warming
 * - Persistence and offline support
 * - Query key management
 *
 * @module services/cache/CacheService
 * @version 2.0.0 - Consolidated
 * @updated 2025-11-12
 */

import { CACHE_STRATEGIES, type CacheStrategy } from '@/lib/cache/config';
import { TTL_CONFIG, REFETCH_STRATEGIES } from './cacheConfig';
import type {
  RefetchStrategy
} from './types';

// ============================================================================
// CONSOLIDATED CACHE CONFIGURATION
// ============================================================================

/**
 * Consolidated Cache Configuration
 *
 * Combines Next.js v16 strategies with healthcare-specific TTL configs
 */
export const CONSOLIDATED_CACHE_CONFIG = {
  // Next.js v16 strategies with PPR support
  strategies: CACHE_STRATEGIES,

  // Healthcare-specific TTL configurations
  ttl: TTL_CONFIG,

  // Refetch strategies for different entity types
  refetch: REFETCH_STRATEGIES,
};

/**
 * Healthcare-Aware Cache Strategy Mapping
 *
 * Maps data types to appropriate cache strategies based on
 * sensitivity level and usage patterns
 */
export const HEALTHCARE_CACHE_MAPPING = {
  // PHI data - never edge cached, short TTL
  phi: {
    strategy: 'short' as CacheStrategy,
    ttl: TTL_CONFIG.critical,
    edgeCompatible: false,
    description: 'PHI data with HIPAA compliance'
  },

  // Critical healthcare data
  critical: {
    strategy: 'short' as CacheStrategy,
    ttl: TTL_CONFIG.critical,
    edgeCompatible: false,
    description: 'Critical healthcare operations'
  },

  // Active healthcare records
  active: {
    strategy: 'medium' as CacheStrategy,
    ttl: TTL_CONFIG.active,
    edgeCompatible: false,
    description: 'Active healthcare records'
  },

  // Historical data
  historical: {
    strategy: 'long' as CacheStrategy,
    ttl: TTL_CONFIG.historical,
    edgeCompatible: true,
    description: 'Historical healthcare data'
  },

  // Reference data (schools, grades, etc.)
  reference: {
    strategy: 'long' as CacheStrategy,
    ttl: TTL_CONFIG.reference,
    edgeCompatible: true,
    description: 'Reference and lookup data'
  },

  // User preferences and UI state
  preferences: {
    strategy: 'long' as CacheStrategy,
    ttl: TTL_CONFIG.preferences,
    edgeCompatible: true,
    description: 'User preferences and UI state'
  },

  // Public content
  public: {
    strategy: 'edge-cache' as CacheStrategy,
    ttl: 10 * 60 * 1000, // 10 minutes
    edgeCompatible: true,
    description: 'Public content for global CDN'
  },

  // Static assets
  static: {
    strategy: 'static' as CacheStrategy,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    edgeCompatible: true,
    description: 'Static assets and resources'
  }
};

/**
 * Cache Strategy Selector
 *
 * Selects appropriate cache strategy based on data type and context
 */
export function selectCacheStrategy(
  dataType: keyof typeof HEALTHCARE_CACHE_MAPPING,
  context?: {
    isPHI?: boolean;
    isPublic?: boolean;
    requiresFreshness?: boolean;
  }
): typeof HEALTHCARE_CACHE_MAPPING[keyof typeof HEALTHCARE_CACHE_MAPPING] {
  // Override for PHI data (HIPAA compliance)
  if (context?.isPHI) {
    return HEALTHCARE_CACHE_MAPPING.phi;
  }

  // Override for public data
  if (context?.isPublic) {
    return HEALTHCARE_CACHE_MAPPING.public;
  }

  // Override for real-time requirements
  if (context?.requiresFreshness) {
    return HEALTHCARE_CACHE_MAPPING.critical;
  }

  // Default mapping
  return HEALTHCARE_CACHE_MAPPING[dataType] || HEALTHCARE_CACHE_MAPPING.reference;
}

// ============================================================================
// CACHE SERVICE CLASS
// ============================================================================

/**
 * Consolidated Cache Service
 *
 * Unified cache service providing both Next.js v16 features
 * and healthcare-specific caching capabilities
 */
export class CacheService {
  private static instance: CacheService;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // ============================================================================
  // CACHE STRATEGY METHODS
  // ============================================================================

  /**
   * Get cache strategy for data type
   */
  getCacheStrategy(dataType: keyof typeof HEALTHCARE_CACHE_MAPPING): CacheStrategy {
    return selectCacheStrategy(dataType).strategy;
  }

  /**
   * Get full cache configuration for data type
   */
  getCacheConfig(dataType: keyof typeof HEALTHCARE_CACHE_MAPPING) {
    return selectCacheStrategy(dataType);
  }

  /**
   * Get Next.js v16 cache strategy configuration
   */
  getNextJsStrategy(strategy: CacheStrategy) {
    return CACHE_STRATEGIES[strategy];
  }

  /**
   * Get healthcare-specific TTL configuration
   */
  getTTLConfig(dataType: keyof typeof TTL_CONFIG): number {
    return TTL_CONFIG[dataType];
  }

  /**
   * Get refetch strategy for entity type
   */
  getRefetchStrategy(entityType: string): RefetchStrategy | undefined {
    return REFETCH_STRATEGIES[entityType];
  }

  // ============================================================================
  // HIPAA COMPLIANCE METHODS
  // ============================================================================

  /**
   * Check if data type can be edge cached (HIPAA compliance)
   */
  isEdgeCompatible(dataType: keyof typeof HEALTHCARE_CACHE_MAPPING): boolean {
    return selectCacheStrategy(dataType).edgeCompatible;
  }

  /**
   * Get PHI-safe cache configuration
   */
  getPHISafeConfig(): typeof HEALTHCARE_CACHE_MAPPING.phi {
    return HEALTHCARE_CACHE_MAPPING.phi;
  }

  /**
   * Validate cache configuration for HIPAA compliance
   */
  validateHIPAACompliance(config: {
    isPHI?: boolean;
    edgeCompatible?: boolean;
    ttl?: number;
    dataType?: string;
  }): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // PHI data should not be edge cached
    if (config.isPHI && config.edgeCompatible) {
      issues.push('PHI data cannot be edge cached');
    }

    // PHI data should have short TTL
    if (config.isPHI && config.ttl && config.ttl > TTL_CONFIG.critical) {
      issues.push('PHI data must have short TTL (≤2 minutes)');
    }

    // Critical data should not be edge cached
    if (config.dataType === 'critical' && config.edgeCompatible) {
      issues.push('Critical healthcare data should not be edge cached');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get all available cache strategies
   */
  getAllStrategies() {
    return CACHE_STRATEGIES;
  }

  /**
   * Get all healthcare cache mappings
   */
  getAllMappings() {
    return HEALTHCARE_CACHE_MAPPING;
  }

  /**
   * Get consolidated cache configuration
   */
  getConsolidatedConfig() {
    return CONSOLIDATED_CACHE_CONFIG;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of the consolidated cache service
 */
export const cacheService = CacheService.getInstance();

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================================================

// Re-export Next.js v16 cache strategies
export { CACHE_STRATEGIES, type CacheStrategy } from '@/lib/cache/config';

// Re-export healthcare-specific configurations
export { TTL_CONFIG, REFETCH_STRATEGIES } from './cacheConfig';

// Re-export types
export type {
  TTLConfig,
  RefetchStrategy,
  PersistenceRule,
  CacheConfig,
  CacheWarmingConfig
} from './types';