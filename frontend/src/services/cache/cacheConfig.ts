/**
 * Healthcare-Specific Cache Configuration
 *
 * TTL values, refetch strategies, and persistence rules optimized
 * for healthcare data with HIPAA compliance considerations.
 */

import type {
  TTLConfig,
  RefetchStrategy,
  PersistenceRule,
  CacheConfig,
  CacheWarmingConfig
} from './types';

/**
 * Time-to-Live Configuration by Data Type
 *
 * Healthcare data has varying freshness requirements:
 * - Critical data (allergies, medications): Must be fresh, 2 min TTL
 * - Active records: Moderate freshness needs, 5 min TTL
 * - Historical data: Less critical, 10 min TTL
 * - Reference data: Rarely changes, 30 min TTL
 */
export const TTL_CONFIG: TTLConfig = {
  // Critical healthcare data - allergies, active medications, emergency contacts
  critical: 2 * 60 * 1000, // 2 minutes

  // Active records - current health records, appointments, incidents
  active: 5 * 60 * 1000, // 5 minutes

  // Historical data - past records, archived items
  historical: 10 * 60 * 1000, // 10 minutes

  // Reference data - schools, grades, lookup tables
  reference: 30 * 60 * 1000, // 30 minutes

  // User preferences - UI settings, filters
  preferences: 60 * 60 * 1000 // 1 hour
};

/**
 * Refetch Strategies by Entity Type
 *
 * Defines when and how data should be refetched based on
 * criticality and usage patterns.
 */
export const REFETCH_STRATEGIES: Record<string, RefetchStrategy> = {
  // Critical healthcare data
  allergies: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0, // Manual refetch only
    staleTime: TTL_CONFIG.critical,
    cacheTime: TTL_CONFIG.critical * 2
  },

  medications: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.critical,
    cacheTime: TTL_CONFIG.critical * 2
  },

  emergencyContacts: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.critical,
    cacheTime: TTL_CONFIG.critical * 2
  },

  // Active records
  students: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.active,
    cacheTime: TTL_CONFIG.active * 2
  },

  healthRecords: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.active,
    cacheTime: TTL_CONFIG.active * 2
  },

  appointments: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.active,
    cacheTime: TTL_CONFIG.active * 2
  },

  incidents: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.active,
    cacheTime: TTL_CONFIG.active * 2
  },

  // Historical data
  archivedStudents: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.historical,
    cacheTime: TTL_CONFIG.historical * 2
  },

  reports: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.historical,
    cacheTime: TTL_CONFIG.historical * 2
  },

  // Reference data
  schools: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.reference,
    cacheTime: TTL_CONFIG.reference * 3
  },

  grades: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.reference,
    cacheTime: TTL_CONFIG.reference * 3
  },

  lookupTables: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.reference,
    cacheTime: TTL_CONFIG.reference * 3
  },

  // User preferences
  userPreferences: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    staleTime: TTL_CONFIG.preferences,
    cacheTime: TTL_CONFIG.preferences * 2
  }
};

/**
 * Persistence Rules - HIPAA Compliance
 *
 * CRITICAL: Never persist Protected Health Information (PHI)
 * Only persist non-sensitive reference data and user preferences
 */
export const PERSISTENCE_RULES: PersistenceRule[] = [
  // NEVER persist PHI
  {
    entityPattern: /^(students|health-records|medications|allergies|incidents|appointments|emergency-contacts)/,
    persist: false,
    reason: 'PHI - HIPAA compliance prohibits persisting protected health information'
  },

  // Safe to persist: Reference data
  {
    entityPattern: /^(schools|grades|districts)/,
    persist: true,
    persistedTTL: 24 * 60 * 60 * 1000, // 24 hours
    reason: 'Non-PHI reference data, safe to persist'
  },

  // Safe to persist: Lookup tables
  {
    entityPattern: /^lookup-/,
    persist: true,
    persistedTTL: 24 * 60 * 60 * 1000,
    reason: 'Static lookup data, safe to persist'
  },

  // Safe to persist: User preferences (non-PHI)
  {
    entityPattern: /^user-preferences/,
    persist: true,
    persistedTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    reason: 'User UI preferences, no PHI'
  },

  // Safe to persist: Application metadata
  {
    entityPattern: /^app-metadata/,
    persist: true,
    persistedTTL: 24 * 60 * 60 * 1000,
    reason: 'Application configuration, no PHI'
  }
];

/**
 * Main Cache Configuration
 */
export const CACHE_CONFIG: CacheConfig = {
  // Maximum 100 entries (LRU eviction)
  maxSize: 100,

  // Maximum ~50MB memory usage (approximate)
  maxMemory: 50 * 1024 * 1024,

  // Default TTL: 5 minutes
  defaultTTL: TTL_CONFIG.active,

  // Enable persistence for non-PHI data
  enablePersistence: true,

  // Enable performance monitoring
  enableMetrics: true,

  // LRU eviction policy
  evictionPolicy: 'lru'
};

/**
 * Cache Warming Configuration
 *
 * Preload critical data on app start for better UX
 */
export const CACHE_WARMING_CONFIG: CacheWarmingConfig[] = [
  // Warm reference data on app start
  {
    entities: ['schools', 'grades', 'lookup-medication-types', 'lookup-allergy-types'],
    trigger: 'app-start',
    priority: 1,
    maxConcurrent: 4
  },

  // Warm user-specific data on login
  {
    entities: ['user-preferences', 'user-schools', 'user-permissions'],
    trigger: 'user-login',
    priority: 2,
    maxConcurrent: 3
  },

  // Warm dashboard data on dashboard route
  {
    entities: ['dashboard-stats', 'recent-incidents', 'upcoming-appointments'],
    trigger: 'route-change',
    priority: 3,
    maxConcurrent: 3
  }
];

/**
 * Entity TTL Mapping
 *
 * Maps entity types to their appropriate TTL category
 */
export const ENTITY_TTL_MAP: Record<string, keyof TTLConfig> = {
  // Critical
  allergies: 'critical',
  medications: 'critical',
  'emergency-contacts': 'critical',
  'active-medications': 'critical',

  // Active
  students: 'active',
  'health-records': 'active',
  appointments: 'active',
  incidents: 'active',
  vaccinations: 'active',
  'vital-signs': 'active',

  // Historical
  'archived-students': 'historical',
  'past-incidents': 'historical',
  reports: 'historical',
  analytics: 'historical',

  // Reference
  schools: 'reference',
  grades: 'reference',
  districts: 'reference',
  'lookup-tables': 'reference',

  // Preferences
  'user-preferences': 'preferences',
  'ui-settings': 'preferences'
};

/**
 * Get TTL for Entity Type
 *
 * @param entityType - Entity type
 * @returns TTL in milliseconds
 */
export function getTTLForEntity(entityType: string): number {
  const category = ENTITY_TTL_MAP[entityType];
  return category ? TTL_CONFIG[category] : CACHE_CONFIG.defaultTTL;
}

/**
 * Get Refetch Strategy for Entity Type
 *
 * @param entityType - Entity type
 * @returns Refetch strategy configuration
 */
export function getRefetchStrategy(entityType: string): RefetchStrategy {
  return REFETCH_STRATEGIES[entityType] || {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
    staleTime: CACHE_CONFIG.defaultTTL,
    cacheTime: CACHE_CONFIG.defaultTTL * 2
  };
}

/**
 * Check if Entity Can Be Persisted
 *
 * @param entityType - Entity type
 * @returns Whether entity can be persisted to IndexedDB
 */
export function canPersistEntity(entityType: string): boolean {
  for (const rule of PERSISTENCE_RULES) {
    if (rule.entityPattern.test(entityType)) {
      return rule.persist;
    }
  }
  // Default: Do not persist (safe default for healthcare)
  return false;
}

/**
 * Get Persisted TTL for Entity
 *
 * @param entityType - Entity type
 * @returns TTL for persisted data, or undefined if cannot persist
 */
export function getPersistedTTL(entityType: string): number | undefined {
  for (const rule of PERSISTENCE_RULES) {
    if (rule.entityPattern.test(entityType) && rule.persist) {
      return rule.persistedTTL;
    }
  }
  return undefined;
}

/**
 * IndexedDB Configuration
 */
export const INDEXED_DB_CONFIG = {
  dbName: 'white-cross-cache',
  version: 1,
  stores: [
    {
      name: 'cache-entries',
      keyPath: 'key',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp', unique: false },
        { name: 'expiresAt', keyPath: 'expiresAt', unique: false },
        { name: 'tags', keyPath: 'tags', unique: false }
      ]
    },
    {
      name: 'navigation-patterns',
      keyPath: 'id',
      indexes: [
        { name: 'from-to', keyPath: ['from', 'to'], unique: true },
        { name: 'frequency', keyPath: 'frequency', unique: false }
      ]
    }
  ]
} as const;

/**
 * Performance Monitoring Configuration
 */
export const PERFORMANCE_CONFIG = {
  // Enable performance tracking
  enabled: true,

  // Sample rate (0-1, 1 = track all operations)
  sampleRate: 1,

  // Metrics to track
  trackMetrics: [
    'cache-hit',
    'cache-miss',
    'invalidation',
    'eviction',
    'persistence',
    'prefetch'
  ],

  // Performance thresholds (ms)
  thresholds: {
    cacheAccess: 10,
    persistence: 100,
    prefetch: 500,
    invalidation: 50
  }
} as const;
