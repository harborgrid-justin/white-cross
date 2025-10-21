/**
 * Enterprise Caching Infrastructure - Type Definitions
 *
 * Comprehensive type system for advanced caching, state management,
 * and optimistic updates in healthcare applications.
 */

/**
 * Cache Entry Metadata
 */
export interface CacheEntry<T = unknown> {
  /** Cached data value */
  data: T;
  /** Cache entry creation timestamp */
  timestamp: number;
  /** Time-to-live in milliseconds */
  ttl: number;
  /** Associated cache tags for invalidation */
  tags: string[];
  /** Entry size in bytes (approximate) */
  size: number;
  /** Access count for LRU tracking */
  accessCount: number;
  /** Last access timestamp */
  lastAccessed: number;
  /** Version for optimistic concurrency control */
  version?: number;
  /** Whether this entry contains PHI (Protected Health Information) */
  containsPHI: boolean;
}

/**
 * Cache Configuration Options
 */
export interface CacheConfig {
  /** Maximum number of entries in cache */
  maxSize: number;
  /** Maximum memory size in bytes */
  maxMemory: number;
  /** Default TTL in milliseconds */
  defaultTTL: number;
  /** Enable persistence to IndexedDB */
  enablePersistence: boolean;
  /** Enable performance monitoring */
  enableMetrics: boolean;
  /** Eviction policy */
  evictionPolicy: 'lru' | 'lfu' | 'fifo';
}

/**
 * Cache Statistics for Monitoring
 */
export interface CacheStats {
  /** Total cache hits */
  hits: number;
  /** Total cache misses */
  misses: number;
  /** Hit rate percentage */
  hitRate: number;
  /** Total evictions */
  evictions: number;
  /** Current cache size (entry count) */
  size: number;
  /** Current memory usage in bytes */
  memoryUsage: number;
  /** Average access time in ms */
  avgAccessTime: number;
  /** Total invalidations */
  invalidations: number;
}

/**
 * Cache Invalidation Options
 */
export interface InvalidationOptions {
  /** Tags to invalidate */
  tags?: string[];
  /** Specific keys to invalidate */
  keys?: string[];
  /** Invalidate by key pattern (regex) */
  pattern?: RegExp;
  /** Cascade to related entries */
  cascade?: boolean;
}

/**
 * Query Key Structure
 */
export interface QueryKey {
  /** Entity type (students, medications, etc.) */
  entity: string;
  /** Operation type (list, detail, etc.) */
  operation: string;
  /** Optional entity ID */
  id?: string | number;
  /** Filter/query parameters */
  filters?: Record<string, unknown>;
  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Normalized Query Key (for cache lookup)
 */
export type NormalizedQueryKey = string;

/**
 * Cache Tag Types
 */
export enum CacheTagType {
  ENTITY = 'entity',
  OPERATION = 'operation',
  RELATIONSHIP = 'relationship',
  AGGREGATE = 'aggregate',
  USER = 'user'
}

/**
 * Cache Tag Structure
 */
export interface CacheTag {
  type: CacheTagType;
  value: string;
}

/**
 * TTL Configuration by Data Type
 */
export interface TTLConfig {
  /** Critical healthcare data (allergies, medications) */
  critical: number;
  /** Active/current records */
  active: number;
  /** Historical data */
  historical: number;
  /** Reference/lookup data */
  reference: number;
  /** User preferences */
  preferences: number;
}

/**
 * Refetch Strategy Configuration
 */
export interface RefetchStrategy {
  /** Refetch on window focus */
  refetchOnWindowFocus: boolean;
  /** Refetch on reconnect */
  refetchOnReconnect: boolean;
  /** Refetch interval in ms (0 = disabled) */
  refetchInterval: number;
  /** Stale time in ms */
  staleTime: number;
  /** Cache time in ms */
  cacheTime: number;
}

/**
 * Persistence Rules
 */
export interface PersistenceRule {
  /** Entity pattern to match */
  entityPattern: RegExp;
  /** Whether to persist this entity type */
  persist: boolean;
  /** Custom TTL for persisted data */
  persistedTTL?: number;
  /** Reason for rule (documentation) */
  reason: string;
}

/**
 * Optimistic Update Context
 */
export interface OptimisticUpdateContext<T = unknown> {
  /** Unique update ID */
  id: string;
  /** Query key being updated */
  queryKey: NormalizedQueryKey;
  /** Previous data (for rollback) */
  previousData: T;
  /** Optimistic data */
  optimisticData: T;
  /** Timestamp of optimistic update */
  timestamp: number;
  /** Version before update */
  version: number;
  /** Associated mutation */
  mutationId: string;
}

/**
 * Conflict Resolution Strategy
 */
export enum ConflictStrategy {
  /** Server data wins */
  SERVER_WINS = 'server-wins',
  /** Client data wins */
  CLIENT_WINS = 'client-wins',
  /** Merge both changes */
  MERGE = 'merge',
  /** Prompt user to resolve */
  USER_RESOLVE = 'user-resolve',
  /** Last write wins */
  LAST_WRITE_WINS = 'last-write-wins'
}

/**
 * Conflict Detection Result
 */
export interface ConflictDetection {
  /** Whether a conflict exists */
  hasConflict: boolean;
  /** Conflicting fields */
  conflictingFields: string[];
  /** Base version */
  baseVersion: number;
  /** Local version */
  localVersion: number;
  /** Remote version */
  remoteVersion: number;
}

/**
 * Three-Way Merge Result
 */
export interface MergeResult<T = unknown> {
  /** Successfully merged */
  success: boolean;
  /** Merged data */
  data?: T;
  /** Conflicts that couldn't be auto-resolved */
  conflicts?: Array<{
    field: string;
    base: unknown;
    local: unknown;
    remote: unknown;
  }>;
  /** Merge strategy used */
  strategy: ConflictStrategy;
}

/**
 * Mutation Queue Entry
 */
export interface QueuedMutation<TVariables = unknown> {
  /** Unique mutation ID */
  id: string;
  /** Mutation type/operation */
  operation: string;
  /** Mutation variables */
  variables: TVariables;
  /** Timestamp queued */
  timestamp: number;
  /** Retry count */
  retryCount: number;
  /** Priority (higher = more urgent) */
  priority: number;
  /** Associated optimistic update ID */
  optimisticUpdateId?: string;
}

/**
 * Prefetch Options
 */
export interface PrefetchOptions {
  /** Prefetch on hover */
  onHover?: boolean;
  /** Hover delay in ms */
  hoverDelay?: number;
  /** Prefetch next page */
  prefetchNextPage?: boolean;
  /** Predictive prefetching */
  predictive?: boolean;
  /** Only prefetch when network idle */
  onlyWhenIdle?: boolean;
  /** Priority (0-10) */
  priority?: number;
}

/**
 * Prefetch Strategy
 */
export interface PrefetchStrategy {
  /** Entity type to prefetch */
  entity: string;
  /** Conditions for prefetching */
  conditions: Array<{
    trigger: 'hover' | 'navigation' | 'scroll' | 'idle';
    delay?: number;
    threshold?: number;
  }>;
  /** Query key generator */
  getQueryKey: (context: unknown) => QueryKey;
}

/**
 * Navigation Pattern for Predictive Prefetching
 */
export interface NavigationPattern {
  /** Source route/page */
  from: string;
  /** Destination route/page */
  to: string;
  /** Frequency of this transition */
  frequency: number;
  /** Last occurrence timestamp */
  lastOccurrence: number;
  /** Average time to transition */
  avgTimeToTransition: number;
}

/**
 * Cache Warming Configuration
 */
export interface CacheWarmingConfig {
  /** Entity types to warm */
  entities: string[];
  /** When to warm (on app start, user login, etc.) */
  trigger: 'app-start' | 'user-login' | 'route-change';
  /** Priority order */
  priority: number;
  /** Maximum concurrent requests */
  maxConcurrent: number;
}

/**
 * Invalidation Operation Details
 */
export interface InvalidationOperation {
  /** Operation type that triggered invalidation */
  operationType: 'create' | 'update' | 'delete' | 'bulk';
  /** Entity being modified */
  entity: string;
  /** Entity ID (if applicable) */
  entityId?: string | number;
  /** Changed fields (for update operations) */
  changedFields?: string[];
  /** Previous values (for change detection) */
  previousValues?: Record<string, unknown>;
  /** New values */
  newValues?: Record<string, unknown>;
}

/**
 * Granular Invalidation Rules
 */
export interface InvalidationRule {
  /** Operation pattern to match */
  operationPattern: RegExp;
  /** Entity type */
  entityType: string;
  /** Invalidation logic */
  getInvalidationTargets: (operation: InvalidationOperation) => InvalidationTarget[];
}

/**
 * Invalidation Target
 */
export interface InvalidationTarget {
  /** Query key pattern or exact key */
  queryKey: string | RegExp;
  /** Whether to refetch immediately */
  refetch?: boolean;
  /** Custom refetch options */
  refetchOptions?: {
    exact?: boolean;
    predicate?: (query: unknown) => boolean;
  };
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  /** Operation name */
  operation: string;
  /** Duration in ms */
  duration: number;
  /** Timestamp */
  timestamp: number;
  /** Success/failure */
  success: boolean;
  /** Cache hit/miss */
  cacheHit?: boolean;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * IndexedDB Schema
 */
export interface IndexedDBSchema {
  /** Database name */
  dbName: string;
  /** Database version */
  version: number;
  /** Object stores */
  stores: Array<{
    name: string;
    keyPath: string;
    indexes: Array<{
      name: string;
      keyPath: string;
      unique: boolean;
    }>;
  }>;
}

/**
 * Persisted Cache Entry
 */
export interface PersistedCacheEntry {
  /** Cache key */
  key: string;
  /** Serialized data */
  data: string;
  /** Timestamp */
  timestamp: number;
  /** Expiry timestamp */
  expiresAt: number;
  /** Tags */
  tags: string[];
  /** Version */
  version: number;
}

/**
 * Cache Event Types
 */
export enum CacheEventType {
  HIT = 'hit',
  MISS = 'miss',
  SET = 'set',
  INVALIDATE = 'invalidate',
  EVICT = 'evict',
  PERSIST = 'persist',
  RESTORE = 'restore'
}

/**
 * Cache Event
 */
export interface CacheEvent {
  /** Event type */
  type: CacheEventType;
  /** Cache key */
  key: string;
  /** Timestamp */
  timestamp: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Cache Event Listener
 */
export type CacheEventListener = (event: CacheEvent) => void;
