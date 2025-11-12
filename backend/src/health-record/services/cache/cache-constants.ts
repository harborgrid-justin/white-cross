/**
 * @fileoverview Cache Strategy Constants
 * @module health-record/services/cache
 * @description Constants and configuration values for the cache strategy system
 */

export const CACHE_CONSTANTS = {
  // L1 Cache Configuration
  L1_MAX_SIZE: 1000, // Maximum entries in L1 cache
  L1_MAX_MEMORY: 50 * 1024 * 1024, // 50MB max memory for L1

  // Cache TTL Defaults (in seconds)
  DEFAULT_TTL: {
    PUBLIC: 300, // 5 minutes
    INTERNAL: 600, // 10 minutes
    SENSITIVE: 1800, // 30 minutes
    PHI: 900, // 15 minutes
    SENSITIVE_PHI: 600, // 10 minutes
  },

  // Cache Key Prefixes
  KEY_PREFIXES: {
    L2_PUBLIC: 'hr:',
    L2_PHI: 'phi:',
    L3_PUBLIC: 'l3:hr:',
    L3_PHI: 'l3:phi:',
  },

  // Data Size Thresholds (in bytes)
  SIZE_THRESHOLDS: {
    SMALL_DATA: 10 * 1024, // 10KB - goes to L1
    MEDIUM_DATA: 100 * 1024, // 100KB - goes to L2
    LARGE_DATA: 1024 * 1024, // 1MB - goes to L3
  },

  // Access Pattern Configuration
  ACCESS_PATTERN: {
    MAX_PATTERNS: 1000,
    CLEANUP_THRESHOLD: 500,
    PREDICTION_WINDOW: 60000, // 1 minute in milliseconds
  },

  // Cache Warming Configuration
  WARMING: {
    TOP_PATTERNS_LIMIT: 20,
    INITIAL_DELAY: 30000, // 30 seconds
    CRON_INTERVAL: '0 */5 * * * *', // Every 5 minutes
  },

  // Prefetch Configuration
  PREFETCH: {
    BATCH_SIZE: 10,
    CRON_INTERVAL: '0 */2 * * * *', // Every 2 minutes
    MAX_QUEUE_SIZE: 100,
  },

  // Optimization Configuration
  OPTIMIZATION: {
    CRON_INTERVAL: '0 0 * * * *', // Every hour
    EXPIRY_CLEANUP_BATCH: 100,
  },

  // Metrics Configuration
  METRICS: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
} as const;

export const CACHE_EVENTS = {
  INVALIDATED: 'cache.invalidated',
  WARMED: 'cache.warmed',
  PREFETCHED: 'cache.prefetched',
  OPTIMIZED: 'cache.optimized',
} as const;
