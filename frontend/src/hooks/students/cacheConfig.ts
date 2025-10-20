/**
 * Student Cache Configuration
 * 
 * Centralized cache configuration for student-related queries with environment-specific settings,
 * healthcare compliance considerations, and performance optimizations.
 * 
 * @module hooks/students/cacheConfig
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

/**
 * Environment detection utilities
 */
const getEnvironment = () => {
  if (typeof window === 'undefined') return 'server';
  if (import.meta.env?.MODE === 'development') return 'development';
  if (import.meta.env?.MODE === 'test') return 'test';
  return 'production';
};

const isProduction = () => getEnvironment() === 'production';
const isDevelopment = () => getEnvironment() === 'development';
const isTest = () => getEnvironment() === 'test';

/**
 * Base cache timing configurations by environment
 */
const BASE_CACHE_TIMINGS = {
  development: {
    shortTerm: 30 * 1000,      // 30 seconds - for rapid development
    mediumTerm: 2 * 60 * 1000, // 2 minutes
    longTerm: 5 * 60 * 1000,   // 5 minutes
    persistent: 10 * 60 * 1000, // 10 minutes
  },
  test: {
    shortTerm: 0,              // No caching in tests for consistency
    mediumTerm: 0,
    longTerm: 0,
    persistent: 0,
  },
  production: {
    shortTerm: 2 * 60 * 1000,  // 2 minutes
    mediumTerm: 10 * 60 * 1000, // 10 minutes
    longTerm: 30 * 60 * 1000,   // 30 minutes
    persistent: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Get cache timings for current environment
 */
const getCacheTimings = () => {
  const env = getEnvironment();
  return BASE_CACHE_TIMINGS[env as keyof typeof BASE_CACHE_TIMINGS] || BASE_CACHE_TIMINGS.production;
};

/**
 * Healthcare-specific cache configuration
 */
export const HEALTHCARE_CACHE_RULES = {
  /** PHI data should have shorter cache times for compliance */
  PHI_MAX_CACHE_TIME: 15 * 60 * 1000, // 15 minutes max for PHI

  /** Emergency data should be very fresh */
  EMERGENCY_CACHE_TIME: 30 * 1000, // 30 seconds

  /** Administrative data can be cached longer */
  ADMIN_CACHE_TIME: 60 * 60 * 1000, // 1 hour

  /** Real-time health data should be minimal cache */
  REALTIME_CACHE_TIME: 10 * 1000, // 10 seconds

  /** Audit-sensitive operations should have minimal cache */
  AUDIT_CACHE_TIME: 5 * 1000, // 5 seconds
} as const;

/**
 * Student-specific cache configuration
 */
export const STUDENT_CACHE_CONFIG = (() => {
  const timings = getCacheTimings();
  
  return {
    /** Student list queries - relatively stable data */
    lists: {
      staleTime: Math.min(timings.mediumTerm, HEALTHCARE_CACHE_RULES.PHI_MAX_CACHE_TIME),
      gcTime: timings.longTerm,
      refetchOnWindowFocus: isProduction(),
      refetchOnMount: isDevelopment(),
      refetchOnReconnect: true,
      retry: isTest() ? false : 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    /** Student detail queries - can be cached longer as they change infrequently */
    details: {
      staleTime: Math.min(timings.longTerm, HEALTHCARE_CACHE_RULES.PHI_MAX_CACHE_TIME),
      gcTime: timings.persistent,
      refetchOnWindowFocus: isProduction(),
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: isTest() ? false : 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    /** Search queries - should be relatively fresh */
    searches: {
      staleTime: timings.shortTerm,
      gcTime: timings.mediumTerm,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: isTest() ? false : 2,
      retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 10000),
    },

    /** Statistics queries - can be cached moderately */
    statistics: {
      staleTime: timings.mediumTerm,
      gcTime: timings.longTerm,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: isTest() ? false : 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    /** Emergency contact queries - critical data, shorter cache */
    emergencyContacts: {
      staleTime: HEALTHCARE_CACHE_RULES.EMERGENCY_CACHE_TIME,
      gcTime: timings.mediumTerm,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: isTest() ? false : 5,
      retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000),
    },

    /** Health records - PHI data with compliance considerations */
    healthRecords: {
      staleTime: HEALTHCARE_CACHE_RULES.PHI_MAX_CACHE_TIME,
      gcTime: timings.mediumTerm,
      refetchOnWindowFocus: isProduction(),
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: isTest() ? false : 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    /** Medication queries - critical health data */
    medications: {
      staleTime: HEALTHCARE_CACHE_RULES.REALTIME_CACHE_TIME,
      gcTime: timings.mediumTerm,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: isTest() ? false : 5,
      retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000),
    },

    /** Assignment queries - administrative data */
    assignments: {
      staleTime: HEALTHCARE_CACHE_RULES.ADMIN_CACHE_TIME,
      gcTime: timings.longTerm,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: isTest() ? false : 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },

    /** Export/Import operations - minimal cache for audit trail */
    exports: {
      staleTime: HEALTHCARE_CACHE_RULES.AUDIT_CACHE_TIME,
      gcTime: timings.shortTerm,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: isTest() ? false : 1,
      retryDelay: () => 1000,
    },

    imports: {
      staleTime: 0, // Never cache import operations
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: isTest() ? false : 1,
      retryDelay: () => 1000,
    },
  } as const;
})();

/**
 * Mutation configuration for student operations
 */
export const STUDENT_MUTATION_CONFIG = {
  /** Standard mutation retry configuration */
  default: {
    retry: isTest() ? false : 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: Error) => {
      if (isProduction()) {
        // Log to healthcare audit system in production
        console.error('Student mutation error:', error);
      }
    },
  },

  /** Critical operations (create, update health data) */
  critical: {
    retry: isTest() ? false : 5,
    retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 10000),
    onError: (error: Error) => {
      // Always log critical errors
      console.error('Critical student operation failed:', error);
      // In production, this would integrate with alerting system
    },
  },

  /** Bulk operations */
  bulk: {
    retry: isTest() ? false : 2,
    retryDelay: (attemptIndex: number) => Math.min(2000 * 2 ** attemptIndex, 60000),
    onError: (error: Error) => {
      console.error('Bulk student operation failed:', error);
    },
  },

  /** Audit-sensitive operations */
  audit: {
    retry: isTest() ? false : 1, // Minimal retry for audit operations
    retryDelay: () => 1000,
    onError: (error: Error) => {
      // Audit operations should be logged immediately
      console.error('Audit operation failed:', error);
    },
  },
} as const;

/**
 * Cache invalidation strategies
 */
export const CACHE_INVALIDATION_STRATEGIES = {
  /** Immediate invalidation for critical updates */
  immediate: {
    refetchType: 'active' as const,
    exact: false,
  },

  /** Background invalidation for non-critical updates */
  background: {
    refetchType: 'inactive' as const,
    exact: false,
  },

  /** Selective invalidation for specific data */
  selective: {
    refetchType: 'all' as const,
    exact: true,
  },

  /** Conservative invalidation for bulk operations */
  conservative: {
    refetchType: 'none' as const,
    exact: false,
  },
} as const;

/**
 * Performance optimization settings
 */
export const PERFORMANCE_CONFIG = {
  /** Pagination settings */
  pagination: {
    defaultPageSize: isProduction() ? 25 : 10,
    maxPageSize: 100,
    prefetchNextPage: isProduction(),
  },

  /** Prefetching strategies */
  prefetch: {
    enabled: isProduction(),
    onHover: true,
    onNavigation: true,
    delay: 150, // ms delay before prefetch
  },

  /** Background sync settings */
  backgroundSync: {
    enabled: isProduction(),
    interval: 5 * 60 * 1000, // 5 minutes
    staleThreshold: 10 * 60 * 1000, // 10 minutes
  },

  /** Memory management */
  memory: {
    maxQueries: 100,
    maxMutations: 50,
    gcThreshold: 50, // Start cleanup after this many queries
  },
} as const;

/**
 * Error handling configuration
 */
export const ERROR_CONFIG = {
  /** Default error handlers */
  handlers: {
    network: (error: Error) => {
      console.error('Network error:', error);
      // In production, integrate with error reporting service
    },
    
    server: (error: Error) => {
      console.error('Server error:', error);
      // In production, integrate with error reporting service
    },
    
    validation: (error: Error) => {
      console.warn('Validation error:', error);
      // These are often user errors, less critical
    },
    
    authorization: (error: Error) => {
      console.error('Authorization error:', error);
      // Critical security errors, should be logged for audit
    },
  },

  /** Retry conditions */
  retryCondition: (error: any) => {
    // Don't retry client errors (4xx) except for 408 (timeout)
    if (error.status >= 400 && error.status < 500 && error.status !== 408) {
      return false;
    }
    
    // Retry server errors (5xx) and network errors
    return true;
  },

  /** Error classification */
  classify: (error: any) => {
    if (!error.status) return 'network';
    if (error.status >= 400 && error.status < 500) {
      if (error.status === 401 || error.status === 403) return 'authorization';
      if (error.status === 422) return 'validation';
      return 'client';
    }
    if (error.status >= 500) return 'server';
    return 'unknown';
  },
} as const;

/**
 * Development and debugging configuration
 */
export const DEBUG_CONFIG = {
  enabled: isDevelopment(),
  
  /** Query debugging */
  queryDebugging: {
    logQueries: isDevelopment(),
    logMutations: isDevelopment(),
    logCacheEvents: isDevelopment(),
    logErrors: true,
  },

  /** Performance monitoring */
  performance: {
    trackQueryTimes: isDevelopment(),
    trackMutationTimes: isDevelopment(),
    trackCacheHitRatio: isDevelopment(),
    warnSlowQueries: isDevelopment(),
    slowQueryThreshold: 1000, // ms
  },

  /** Cache inspection */
  cache: {
    enableDevtools: isDevelopment(),
    logCacheChanges: isDevelopment(),
    trackCacheSize: isDevelopment(),
  },
} as const;

/**
 * Environment-specific overrides
 */
export const getEnvironmentConfig = () => {
  const baseConfig = STUDENT_CACHE_CONFIG;
  
  if (isTest()) {
    // Override all timings to 0 for tests
    return Object.fromEntries(
      Object.entries(baseConfig).map(([key, config]) => [
        key,
        { ...config, staleTime: 0, gcTime: 0 }
      ])
    );
  }
  
  if (isDevelopment()) {
    // Shorter cache times for development
    return Object.fromEntries(
      Object.entries(baseConfig).map(([key, config]) => [
        key,
        {
          ...config,
          staleTime: Math.min(config.staleTime, 30000), // Max 30 seconds
          refetchOnMount: true,
          refetchOnWindowFocus: true,
        }
      ])
    );
  }
  
  return baseConfig;
};

/**
 * Export the final configuration
 */
export const cacheConfig = getEnvironmentConfig();

/**
 * Utility functions for cache management
 */
export const cacheUtils = {
  /** Get cache config for a specific query type */
  getConfigFor: (queryType: keyof typeof STUDENT_CACHE_CONFIG) => {
    return STUDENT_CACHE_CONFIG[queryType];
  },

  /** Get mutation config for operation type */
  getMutationConfigFor: (operationType: keyof typeof STUDENT_MUTATION_CONFIG) => {
    return STUDENT_MUTATION_CONFIG[operationType];
  },

  /** Check if cache should be bypassed for critical data */
  shouldBypassCache: (dataType: 'emergency' | 'medication' | 'realtime' | 'normal') => {
    if (isTest()) return true;
    
    switch (dataType) {
      case 'emergency':
      case 'medication':
      case 'realtime':
        return true;
      default:
        return false;
    }
  },

  /** Calculate cache time based on data sensitivity */
  getCacheTimeFor: (sensitivity: 'low' | 'medium' | 'high' | 'critical') => {
    const timings = getCacheTimings();
    
    switch (sensitivity) {
      case 'low':
        return timings.persistent;
      case 'medium':
        return timings.longTerm;
      case 'high':
        return timings.mediumTerm;
      case 'critical':
        return timings.shortTerm;
      default:
        return timings.mediumTerm;
    }
  },
} as const;

/**
 * Export all configurations
 */
export default {
  STUDENT_CACHE_CONFIG,
  STUDENT_MUTATION_CONFIG,
  CACHE_INVALIDATION_STRATEGIES,
  PERFORMANCE_CONFIG,
  ERROR_CONFIG,
  DEBUG_CONFIG,
  HEALTHCARE_CACHE_RULES,
  cacheConfig,
  cacheUtils,
};