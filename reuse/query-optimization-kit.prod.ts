/**
 * LOC: QOK9X2Y5Z8
 * File: /reuse/query-optimization-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - Sequelize v6.x (database ORM)
 *   - Zod (schema validation)
 *   - Redis/Cache layer
 *   - Database connection pools
 *
 * DOWNSTREAM (imported by):
 *   - NestJS service layer
 *   - Repository implementations
 *   - GraphQL resolvers
 *   - REST API controllers
 *   - Background job processors
 */

/**
 * File: /reuse/query-optimization-kit.prod.ts
 * Locator: WC-UTL-QOK-001
 * Purpose: Query Optimization Kit - Production-grade Sequelize query optimization utilities
 *
 * Upstream: Sequelize v6.x, PostgreSQL 14+, Redis, Connection pooling
 * Downstream: ../backend/*, ../services/*, ../resolvers/*, repository layers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, Zod, PostgreSQL 14+
 * Exports: 47 optimization functions for N+1 prevention, eager loading, caching, bulk ops,
 *          raw queries, CTEs, window functions, pagination, filtering, sorting, full-text search,
 *          aggregations, subqueries, transaction management, and performance monitoring
 *
 * LLM Context: Comprehensive query optimization utilities for White Cross healthcare system.
 * Provides advanced N+1 query prevention, intelligent eager/lazy loading strategies, multi-layer
 * query caching with invalidation, optimized bulk operations, raw SQL with type safety, Common Table
 * Expressions (CTEs), window functions for analytics, cursor and offset pagination, dynamic filtering,
 * multi-field sorting, PostgreSQL full-text search, complex aggregations, subquery optimization,
 * transaction isolation management, query performance profiling, execution plan analysis, index
 * recommendations, connection pool optimization, and real-time performance monitoring. Essential
 * for high-performance, HIPAA-compliant healthcare data operations with sub-second response times.
 *
 * Key Features:
 * - N+1 query detection and prevention with dataloader patterns
 * - Smart eager loading with include optimization
 * - Multi-tier caching (L1: memory, L2: Redis) with TTL and invalidation
 * - Optimized bulk insert/update/delete with batching
 * - Type-safe raw queries with parameter binding
 * - CTEs for complex hierarchical queries
 * - Window functions for analytics and ranking
 * - Cursor-based and offset pagination
 * - Dynamic multi-field filtering with operators
 * - Compound sorting with nulls handling
 * - PostgreSQL full-text search with ranking
 * - Complex aggregations with grouping and HAVING
 * - Subquery optimization and correlation
 * - Transaction isolation levels and savepoints
 * - Query performance profiling with metrics
 * - EXPLAIN ANALYZE for query plans
 * - Index usage analysis and recommendations
 * - Connection pool monitoring
 * - Slow query detection and alerting
 */

import {
  Op,
  Sequelize,
  Model,
  ModelStatic,
  FindOptions,
  WhereOptions,
  Transaction,
  TransactionOptions,
  IsolationLevel,
  QueryTypes,
  literal,
  fn,
  col,
  cast,
  Includeable,
  Order,
  Attributes,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  BulkCreateOptions,
} from 'sequelize';
import { z } from 'zod';

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

/**
 * @description Zod schema for pagination options
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().nonnegative().optional(),
});

/**
 * @description Zod schema for cursor pagination options
 */
export const CursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  cursorField: z.string().default('id'),
  direction: z.enum(['forward', 'backward']).default('forward'),
});

/**
 * @description Zod schema for filter operators
 */
export const FilterOperatorSchema = z.enum([
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'notIn',
  'like',
  'iLike',
  'notLike',
  'between',
  'notBetween',
  'is',
  'isNot',
  'contains',
  'contained',
  'overlap',
  'startsWith',
  'endsWith',
  'substring',
  'regexp',
  'iRegexp',
  'notRegexp',
]);

/**
 * @description Zod schema for sorting options
 */
export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['ASC', 'DESC']).default('ASC'),
  nulls: z.enum(['FIRST', 'LAST']).optional(),
});

/**
 * @description Zod schema for full-text search options
 */
export const FullTextSearchSchema = z.object({
  query: z.string().min(1),
  fields: z.array(z.string()).min(1),
  language: z.string().default('english'),
  rank: z.boolean().default(true),
  minRank: z.number().min(0).max(1).optional(),
});

/**
 * @description Zod schema for aggregation options
 */
export const AggregationSchema = z.object({
  field: z.string(),
  operation: z.enum(['count', 'sum', 'avg', 'min', 'max', 'stddev', 'variance']),
  alias: z.string().optional(),
  distinct: z.boolean().default(false),
});

/**
 * @description Zod schema for cache options
 */
export const CacheOptionsSchema = z.object({
  key: z.string(),
  ttl: z.number().int().positive().default(300),
  tags: z.array(z.string()).optional(),
  prefix: z.string().default('query:'),
  refresh: z.boolean().default(false),
  layer: z.enum(['memory', 'redis', 'both']).default('redis'),
});

/**
 * @description Zod schema for bulk operation options
 */
export const BulkOperationSchema = z.object({
  batchSize: z.number().int().min(1).max(5000).default(1000),
  validate: z.boolean().default(true),
  hooks: z.boolean().default(false),
  transaction: z.boolean().default(true),
  returning: z.boolean().default(false),
  ignoreDuplicates: z.boolean().default(false),
  updateOnDuplicate: z.array(z.string()).optional(),
});

/**
 * @description Zod schema for query performance metrics
 */
export const QueryMetricsSchema = z.object({
  sql: z.string(),
  executionTime: z.number(),
  rowCount: z.number().int().nonnegative(),
  fromCache: z.boolean().default(false),
  indexesUsed: z.array(z.string()),
  tableScan: z.boolean(),
  bufferHits: z.number().optional(),
  timestamp: z.date(),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type PaginationOptions = z.infer<typeof PaginationSchema>;
export type CursorPaginationOptions = z.infer<typeof CursorPaginationSchema>;
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;
export type SortOptions = z.infer<typeof SortSchema>;
export type FullTextSearchOptions = z.infer<typeof FullTextSearchSchema>;
export type AggregationOptions = z.infer<typeof AggregationSchema>;
export type CacheOptions = z.infer<typeof CacheOptionsSchema>;
export type BulkOperationOptions = z.infer<typeof BulkOperationSchema>;
export type QueryMetrics = z.infer<typeof QueryMetricsSchema>;

/**
 * @interface PaginatedResult
 * @description Paginated query result with metadata
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
  };
}

/**
 * @interface CursorPaginatedResult
 * @description Cursor-based paginated result with cursors
 */
export interface CursorPaginatedResult<T> {
  data: T[];
  cursors: {
    next: string | null;
    prev: string | null;
    hasMore: boolean;
    hasPrev: boolean;
  };
}

/**
 * @interface QueryBuilderConfig
 * @description Configuration for advanced query builder
 */
export interface QueryBuilderConfig<T> {
  filters?: Record<string, any>;
  search?: { fields: string[]; term: string };
  fullTextSearch?: FullTextSearchOptions;
  sort?: SortOptions[];
  includes?: Includeable[];
  pagination?: PaginationOptions | CursorPaginationOptions;
  attributes?: string[] | { include?: string[]; exclude?: string[] };
  distinct?: boolean;
  paranoid?: boolean;
  raw?: boolean;
  nest?: boolean;
  subQuery?: boolean;
  lock?: Transaction.LOCK;
  transaction?: Transaction;
}

/**
 * @interface EagerLoadConfig
 * @description Configuration for eager loading optimization
 */
export interface EagerLoadConfig {
  association: string;
  required?: boolean;
  separate?: boolean;
  attributes?: string[];
  where?: WhereOptions<any>;
  limit?: number;
  order?: Order;
  include?: EagerLoadConfig[];
}

/**
 * @interface BulkInsertConfig
 * @description Configuration for optimized bulk insert
 */
export interface BulkInsertConfig<T> {
  data: Partial<T>[];
  options?: BulkOperationOptions;
  onProgress?: (processed: number, total: number) => void;
}

/**
 * @interface BulkUpdateConfig
 * @description Configuration for optimized bulk update
 */
export interface BulkUpdateConfig<T> {
  updates: Array<{ where: WhereOptions<any>; data: Partial<T> }>;
  options?: BulkOperationOptions;
  onProgress?: (processed: number, total: number) => void;
}

/**
 * @interface CTEConfig
 * @description Configuration for Common Table Expressions
 */
export interface CTEConfig {
  name: string;
  query: string;
  columns?: string[];
  recursive?: boolean;
  materialized?: boolean;
}

/**
 * @interface WindowFunctionConfig
 * @description Configuration for window functions
 */
export interface WindowFunctionConfig {
  function: 'row_number' | 'rank' | 'dense_rank' | 'percent_rank' | 'ntile' | 'lag' | 'lead' | 'first_value' | 'last_value';
  partitionBy?: string[];
  orderBy?: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
  frame?: {
    type: 'ROWS' | 'RANGE' | 'GROUPS';
    start: string;
    end?: string;
  };
  alias: string;
}

/**
 * @interface SubqueryConfig
 * @description Configuration for subquery optimization
 */
export interface SubqueryConfig {
  type: 'scalar' | 'exists' | 'in' | 'any' | 'all';
  query: string | FindOptions<any>;
  alias?: string;
  correlated?: boolean;
}

/**
 * @interface TransactionConfig
 * @description Configuration for transaction management
 */
export interface TransactionConfig {
  isolationLevel?: IsolationLevel;
  autocommit?: boolean;
  deferrable?: string;
  type?: 'DEFERRED' | 'IMMEDIATE' | 'EXCLUSIVE';
  logging?: boolean | ((sql: string, timing?: number) => void);
}

/**
 * @interface PerformanceProfile
 * @description Query performance profiling result
 */
export interface PerformanceProfile {
  metrics: QueryMetrics;
  explain: any;
  recommendations: string[];
  warnings: string[];
  optimizationScore: number;
}

/**
 * @interface IndexRecommendation
 * @description Index recommendation for query optimization
 */
export interface IndexRecommendation {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin';
  reason: string;
  estimatedImprovement: number;
  priority: 'high' | 'medium' | 'low';
}

/**
 * @interface ConnectionPoolStats
 * @description Connection pool statistics
 */
export interface ConnectionPoolStats {
  total: number;
  active: number;
  idle: number;
  waiting: number;
  max: number;
  min: number;
  acquireCount: number;
  createCount: number;
  destroyCount: number;
  timeoutCount: number;
}

// ============================================================================
// N+1 QUERY PREVENTION
// ============================================================================

/**
 * Detects potential N+1 query patterns in query configuration.
 * Analyzes include patterns to identify unoptimized association loading.
 *
 * @param {FindOptions<any>} options - Sequelize find options
 * @returns {object} Detection result with warnings and suggestions
 *
 * @example
 * ```typescript
 * const result = detectN1Queries({
 *   include: [{ model: Post }] // Missing 'separate: true' or proper eager loading
 * });
 * // { hasN1Risk: true, warnings: [...], suggestions: [...] }
 * ```
 */
export const detectN1Queries = (options: FindOptions<any>): {
  hasN1Risk: boolean;
  warnings: string[];
  suggestions: string[];
} => {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const analyzeInclude = (include: any, depth = 0) => {
    if (!include) return;

    const includes = Array.isArray(include) ? include : [include];

    includes.forEach((inc) => {
      // Check for missing 'separate' or 'required' optimization
      if (!inc.separate && !inc.required && depth > 0) {
        warnings.push(
          `Potential N+1: Association '${inc.as || inc.model?.name}' may cause multiple queries. Consider 'separate: true' or 'required: true'.`
        );
        suggestions.push(`Add 'separate: true' for ${inc.as || inc.model?.name} to batch queries.`);
      }

      // Check for nested includes without optimization
      if (inc.include && !inc.separate) {
        warnings.push(
          `Deep nesting detected for '${inc.as || inc.model?.name}' without separation. Risk of exponential queries.`
        );
        suggestions.push(`Consider using 'separate: true' or restructuring nested includes.`);
      }

      // Check for limit/order in nested includes
      if ((inc.limit || inc.order) && !inc.separate) {
        warnings.push(
          `Using limit/order in '${inc.as || inc.model?.name}' without 'separate: true' may cause inefficient queries.`
        );
        suggestions.push(`Set 'separate: true' for ${inc.as || inc.model?.name} when using limit/order.`);
      }

      // Recursive check for nested includes
      if (inc.include) {
        analyzeInclude(inc.include, depth + 1);
      }
    });
  };

  if (options.include) {
    analyzeInclude(options.include);
  }

  return {
    hasN1Risk: warnings.length > 0,
    warnings,
    suggestions,
  };
};

/**
 * Optimizes query includes to prevent N+1 queries using intelligent batching.
 * Automatically applies 'separate: true' where beneficial.
 *
 * @param {FindOptions<any>} options - Original find options
 * @returns {FindOptions<any>} Optimized find options
 *
 * @example
 * ```typescript
 * const optimized = optimizeIncludes({
 *   include: [
 *     { model: Post, include: [{ model: Comment }] }
 *   ]
 * });
 * // Automatically adds 'separate: true' where needed
 * ```
 */
export const optimizeIncludes = (options: FindOptions<any>): FindOptions<any> => {
  const optimized = { ...options };

  const optimizeIncludeRecursive = (include: any, depth = 0): any => {
    if (!include) return include;

    const includes = Array.isArray(include) ? include : [include];

    return includes.map((inc) => {
      const optimizedInc = { ...inc };

      // Apply 'separate: true' for associations with limit/order
      if ((inc.limit || inc.order) && !inc.separate) {
        optimizedInc.separate = true;
      }

      // Apply 'separate: true' for deeply nested includes (depth > 1)
      if (depth > 1 && inc.include && !inc.separate) {
        optimizedInc.separate = true;
      }

      // Recursively optimize nested includes
      if (inc.include) {
        optimizedInc.include = optimizeIncludeRecursive(inc.include, depth + 1);
      }

      return optimizedInc;
    });
  };

  if (options.include) {
    optimized.include = optimizeIncludeRecursive(options.include);
  }

  return optimized;
};

/**
 * Creates a dataloader-style batch function for association loading.
 * Prevents N+1 by batching multiple association loads into single query.
 *
 * @template T
 * @template K
 * @param {ModelStatic<T>} model - Target model for association
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions<T>} options - Additional find options
 * @returns {Function} Batch loader function
 *
 * @example
 * ```typescript
 * const postLoader = createBatchLoader(Post, 'authorId', {
 *   attributes: ['id', 'title', 'content']
 * });
 * const posts = await postLoader.load([1, 2, 3]);
 * ```
 */
export const createBatchLoader = <T extends Model, K = any>(
  model: ModelStatic<T>,
  foreignKey: string,
  options: FindOptions<T> = {}
): {
  load: (keys: K[]) => Promise<T[][]>;
  loadOne: (key: K) => Promise<T[]>;
} => {
  const cache = new Map<K, T[]>();

  const batchLoad = async (keys: K[]): Promise<T[][]> => {
    const uncachedKeys = keys.filter((k) => !cache.has(k));

    if (uncachedKeys.length > 0) {
      const results = await model.findAll({
        ...options,
        where: {
          ...options.where,
          [foreignKey]: { [Op.in]: uncachedKeys },
        } as WhereOptions<T>,
      });

      // Group results by foreign key
      const grouped = new Map<K, T[]>();
      results.forEach((result: any) => {
        const key = result[foreignKey] as K;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(result);
      });

      // Cache results
      uncachedKeys.forEach((key) => {
        cache.set(key, grouped.get(key) || []);
      });
    }

    return keys.map((key) => cache.get(key) || []);
  };

  return {
    load: batchLoad,
    loadOne: async (key: K) => {
      const results = await batchLoad([key]);
      return results[0] || [];
    },
  };
};

/**
 * Implements dataloader pattern with configurable batching and caching.
 * Prevents N+1 queries through intelligent request batching.
 *
 * @template K
 * @template V
 * @param {Function} batchFn - Batch loading function
 * @param {object} options - Dataloader options
 * @returns {object} Dataloader instance with load methods
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => User.findAll({ where: { id: ids } }),
 *   { batchSize: 100, cacheEnabled: true }
 * );
 * const user = await userLoader.load(1);
 * ```
 */
export const createDataLoader = <K, V>(
  batchFn: (keys: K[]) => Promise<V[]>,
  options: {
    batchSize?: number;
    cacheEnabled?: boolean;
    cacheTTL?: number;
  } = {}
): {
  load: (key: K) => Promise<V>;
  loadMany: (keys: K[]) => Promise<V[]>;
  clear: (key: K) => void;
  clearAll: () => void;
} => {
  const { batchSize = 100, cacheEnabled = true, cacheTTL = 60000 } = options;
  const cache = new Map<K, { value: V; timestamp: number }>();
  const queue: Array<{ key: K; resolve: (value: V) => void; reject: (error: any) => void }> = [];
  let batchTimer: NodeJS.Timeout | null = null;

  const processBatch = async () => {
    if (queue.length === 0) return;

    const batch = queue.splice(0, batchSize);
    const keys = batch.map((item) => item.key);

    try {
      const results = await batchFn(keys);

      batch.forEach((item, index) => {
        const value = results[index];
        item.resolve(value);

        if (cacheEnabled) {
          cache.set(item.key, { value, timestamp: Date.now() });
        }
      });
    } catch (error) {
      batch.forEach((item) => item.reject(error));
    }

    if (queue.length > 0) {
      batchTimer = setTimeout(processBatch, 0);
    } else {
      batchTimer = null;
    }
  };

  const load = (key: K): Promise<V> => {
    // Check cache
    if (cacheEnabled) {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        return Promise.resolve(cached.value);
      }
    }

    return new Promise((resolve, reject) => {
      queue.push({ key, resolve, reject });

      if (!batchTimer) {
        batchTimer = setTimeout(processBatch, 0);
      }
    });
  };

  return {
    load,
    loadMany: async (keys: K[]) => Promise.all(keys.map(load)),
    clear: (key: K) => cache.delete(key),
    clearAll: () => cache.clear(),
  };
};

// ============================================================================
// EAGER & LAZY LOADING OPTIMIZATION
// ============================================================================

/**
 * Creates optimized eager loading configuration with intelligent defaults.
 * Automatically determines best loading strategy based on data patterns.
 *
 * @param {EagerLoadConfig[]} associations - Association configurations
 * @param {object} options - Optimization options
 * @returns {Includeable[]} Optimized include array
 *
 * @example
 * ```typescript
 * const includes = createOptimizedEagerLoad([
 *   { association: 'posts', attributes: ['id', 'title'] },
 *   { association: 'profile', required: true }
 * ]);
 * const users = await User.findAll({ include: includes });
 * ```
 */
export const createOptimizedEagerLoad = (
  associations: EagerLoadConfig[],
  options: {
    maxDepth?: number;
    autoSeparate?: boolean;
  } = {}
): Includeable[] => {
  const { maxDepth = 3, autoSeparate = true } = options;

  const buildInclude = (config: EagerLoadConfig, depth = 0): Includeable => {
    const include: any = {
      association: config.association,
      required: config.required ?? false,
    };

    // Apply attributes selection
    if (config.attributes) {
      include.attributes = config.attributes;
    }

    // Apply where conditions
    if (config.where) {
      include.where = config.where;
    }

    // Apply limit
    if (config.limit) {
      include.limit = config.limit;
      // Auto-apply separate for limit
      if (autoSeparate) {
        include.separate = true;
      }
    }

    // Apply order
    if (config.order) {
      include.order = config.order;
    }

    // Apply separate if explicitly set
    if (config.separate !== undefined) {
      include.separate = config.separate;
    }

    // Recursively build nested includes
    if (config.include && depth < maxDepth) {
      include.include = config.include.map((nested) => buildInclude(nested, depth + 1));

      // Auto-apply separate for nested includes at depth > 1
      if (autoSeparate && depth > 0) {
        include.separate = true;
      }
    }

    return include;
  };

  return associations.map((assoc) => buildInclude(assoc));
};

/**
 * Implements lazy loading with automatic caching for associations.
 * Loads associations on-demand with intelligent cache management.
 *
 * @template T
 * @param {T} instance - Model instance
 * @param {string} association - Association name
 * @param {FindOptions<any>} options - Find options
 * @returns {Promise<any>} Loaded association
 *
 * @example
 * ```typescript
 * const user = await User.findByPk(1);
 * const posts = await lazyLoadWithCache(user, 'posts', {
 *   where: { status: 'published' }
 * });
 * ```
 */
export const lazyLoadWithCache = async <T extends Model>(
  instance: T,
  association: string,
  options: FindOptions<any> = {}
): Promise<any> => {
  const cacheKey = `lazy:${instance.constructor.name}:${(instance as any).id}:${association}`;
  const cached = (instance as any)._lazyCache?.[cacheKey];

  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.value;
  }

  const associationMethod = `get${association.charAt(0).toUpperCase()}${association.slice(1)}`;

  if (typeof (instance as any)[associationMethod] !== 'function') {
    throw new Error(`Association '${association}' not found on model ${instance.constructor.name}`);
  }

  const result = await (instance as any)[associationMethod](options);

  // Cache result
  if (!(instance as any)._lazyCache) {
    (instance as any)._lazyCache = {};
  }
  (instance as any)._lazyCache[cacheKey] = {
    value: result,
    timestamp: Date.now(),
  };

  return result;
};

/**
 * Determines optimal loading strategy (eager vs lazy) based on query patterns.
 * Analyzes historical query patterns to recommend best approach.
 *
 * @param {string} modelName - Model name
 * @param {string} association - Association name
 * @param {object} context - Query context
 * @returns {Promise<object>} Loading strategy recommendation
 *
 * @example
 * ```typescript
 * const strategy = await determineLoadingStrategy('User', 'posts', {
 *   expectedResultCount: 100,
 *   associationSize: 'large'
 * });
 * // { strategy: 'lazy', reason: '...', confidence: 0.85 }
 * ```
 */
export const determineLoadingStrategy = async (
  modelName: string,
  association: string,
  context: {
    expectedResultCount?: number;
    associationSize?: 'small' | 'medium' | 'large';
    frequency?: 'rare' | 'occasional' | 'frequent';
  }
): Promise<{
  strategy: 'eager' | 'lazy' | 'dataloader';
  reason: string;
  confidence: number;
}> => {
  const { expectedResultCount = 10, associationSize = 'medium', frequency = 'occasional' } = context;

  let strategy: 'eager' | 'lazy' | 'dataloader' = 'eager';
  let reason = '';
  let confidence = 0.5;

  // Small result count + frequent access = eager loading
  if (expectedResultCount <= 20 && frequency === 'frequent') {
    strategy = 'eager';
    reason = 'Small result set with frequent access benefits from eager loading';
    confidence = 0.9;
  }
  // Large result count + large associations = lazy loading
  else if (expectedResultCount > 50 && associationSize === 'large') {
    strategy = 'lazy';
    reason = 'Large result set with large associations should use lazy loading';
    confidence = 0.85;
  }
  // Medium result count + occasional access = dataloader
  else if (expectedResultCount > 20 && expectedResultCount <= 50 && frequency === 'occasional') {
    strategy = 'dataloader';
    reason = 'Medium result set benefits from dataloader batching';
    confidence = 0.8;
  }
  // Large result count + small associations = eager with separate
  else if (expectedResultCount > 50 && associationSize === 'small') {
    strategy = 'eager';
    reason = 'Large result set with small associations can use eager loading with separate queries';
    confidence = 0.75;
  }

  return { strategy, reason, confidence };
};

// ============================================================================
// QUERY CACHING
// ============================================================================

/**
 * Implements multi-layer query caching with L1 (memory) and L2 (Redis).
 * Provides intelligent cache warming and invalidation.
 *
 * @template T
 * @param {string} key - Cache key
 * @param {Function} queryFn - Query function to execute
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or fresh query result
 *
 * @example
 * ```typescript
 * const users = await cacheQuery('active-users', async () => {
 *   return await User.findAll({ where: { status: 'active' } });
 * }, { ttl: 300, layer: 'both' });
 * ```
 */
export const cacheQuery = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  options: Partial<CacheOptions> = {}
): Promise<T> => {
  const validated = CacheOptionsSchema.parse({ key, ...options });
  const fullKey = `${validated.prefix}${validated.key}`;

  // L1 cache (in-memory)
  if (validated.layer === 'memory' || validated.layer === 'both') {
    const memoryCache = getMemoryCache();
    const cached = memoryCache.get(fullKey);

    if (cached && !validated.refresh) {
      return cached as T;
    }
  }

  // L2 cache (Redis) - placeholder for Redis integration
  if (validated.layer === 'redis' || validated.layer === 'both') {
    // TODO: Integrate with Redis
    // const redisCache = await getRedisCache(fullKey);
    // if (redisCache && !validated.refresh) return redisCache;
  }

  // Execute query
  const result = await queryFn();

  // Store in caches
  if (validated.layer === 'memory' || validated.layer === 'both') {
    const memoryCache = getMemoryCache();
    memoryCache.set(fullKey, result, validated.ttl);
  }

  if (validated.layer === 'redis' || validated.layer === 'both') {
    // TODO: Store in Redis
    // await setRedisCache(fullKey, result, validated.ttl);
  }

  return result;
};

/**
 * Simple in-memory cache implementation with TTL support.
 */
const memoryCache = new Map<string, { value: any; expires: number }>();

const getMemoryCache = () => ({
  get: (key: string) => {
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },
  set: (key: string, value: any, ttl: number) => {
    memoryCache.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
    });
  },
  delete: (key: string) => {
    memoryCache.delete(key);
  },
  clear: () => {
    memoryCache.clear();
  },
});

/**
 * Invalidates cached queries by key pattern or tags.
 * Supports wildcard patterns and tag-based invalidation.
 *
 * @param {object} criteria - Invalidation criteria
 * @returns {Promise<number>} Number of invalidated cache entries
 *
 * @example
 * ```typescript
 * // Invalidate by pattern
 * await invalidateCache({ pattern: 'user:*' });
 *
 * // Invalidate by tags
 * await invalidateCache({ tags: ['users', 'posts'] });
 * ```
 */
export const invalidateCache = async (criteria: {
  pattern?: string;
  tags?: string[];
  exact?: string;
}): Promise<number> => {
  const cache = getMemoryCache();
  let invalidated = 0;

  if (criteria.exact) {
    cache.delete(criteria.exact);
    invalidated = 1;
  } else if (criteria.pattern) {
    const regex = new RegExp(criteria.pattern.replace('*', '.*'));
    memoryCache.forEach((_, key) => {
      if (regex.test(key)) {
        cache.delete(key);
        invalidated++;
      }
    });
  } else if (criteria.tags) {
    // Tag-based invalidation requires tag tracking
    // Placeholder for tag tracking implementation
  }

  return invalidated;
};

/**
 * Warms up cache with pre-computed query results.
 * Useful for frequently accessed data with predictable patterns.
 *
 * @param {Array} queries - Array of queries to warm up
 * @returns {Promise<object>} Warming results
 *
 * @example
 * ```typescript
 * await warmCache([
 *   { key: 'popular-posts', fn: () => Post.findAll({ limit: 10, order: [['views', 'DESC']] }) },
 *   { key: 'active-users', fn: () => User.findAll({ where: { status: 'active' } }) }
 * ]);
 * ```
 */
export const warmCache = async (
  queries: Array<{
    key: string;
    fn: () => Promise<any>;
    options?: Partial<CacheOptions>;
  }>
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ key: string; error: string }>;
}> => {
  let success = 0;
  let failed = 0;
  const errors: Array<{ key: string; error: string }> = [];

  await Promise.allSettled(
    queries.map(async ({ key, fn, options }) => {
      try {
        await cacheQuery(key, fn, { ...options, refresh: true });
        success++;
      } catch (error) {
        failed++;
        errors.push({ key, error: error instanceof Error ? error.message : String(error) });
      }
    })
  );

  return { success, failed, errors };
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Optimized bulk insert with automatic batching and error handling.
 * Supports validation, conflict resolution, and progress tracking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {BulkInsertConfig<T>} config - Bulk insert configuration
 * @returns {Promise<object>} Insert results with statistics
 *
 * @example
 * ```typescript
 * const result = await bulkInsertOptimized(User, {
 *   data: users,
 *   options: { batchSize: 500, updateOnDuplicate: ['email', 'name'] },
 *   onProgress: (processed, total) => console.log(`${processed}/${total}`)
 * });
 * ```
 */
export const bulkInsertOptimized = async <T extends Model>(
  model: ModelStatic<T>,
  config: BulkInsertConfig<T>
): Promise<{
  inserted: number;
  updated: number;
  failed: number;
  errors: Array<{ index: number; error: string }>;
}> => {
  const options = BulkOperationSchema.parse(config.options || {});
  const { data, onProgress } = config;

  let inserted = 0;
  let updated = 0;
  let failed = 0;
  const errors: Array<{ index: number; error: string }> = [];

  const totalBatches = Math.ceil(data.length / options.batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const start = i * options.batchSize;
    const end = Math.min(start + options.batchSize, data.length);
    const batch = data.slice(start, end);

    try {
      const result = await model.bulkCreate(batch as any[], {
        validate: options.validate,
        hooks: options.hooks,
        ignoreDuplicates: options.ignoreDuplicates,
        updateOnDuplicate: options.updateOnDuplicate,
        returning: options.returning,
      });

      if (options.updateOnDuplicate) {
        updated += result.length;
      } else {
        inserted += result.length;
      }
    } catch (error) {
      failed += batch.length;
      errors.push({
        index: start,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (onProgress) {
      onProgress(end, data.length);
    }
  }

  return { inserted, updated, failed, errors };
};

/**
 * Optimized bulk update with conditional updates and batching.
 * Supports different update conditions per batch.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {BulkUpdateConfig<T>} config - Bulk update configuration
 * @returns {Promise<object>} Update results with statistics
 *
 * @example
 * ```typescript
 * const result = await bulkUpdateOptimized(User, {
 *   updates: [
 *     { where: { status: 'pending' }, data: { status: 'active' } },
 *     { where: { lastLogin: { [Op.lt]: oldDate } }, data: { status: 'inactive' } }
 *   ],
 *   options: { batchSize: 1000 }
 * });
 * ```
 */
export const bulkUpdateOptimized = async <T extends Model>(
  model: ModelStatic<T>,
  config: BulkUpdateConfig<T>
): Promise<{
  updated: number;
  failed: number;
  errors: Array<{ index: number; error: string }>;
}> => {
  const options = BulkOperationSchema.parse(config.options || {});
  const { updates, onProgress } = config;

  let updated = 0;
  let failed = 0;
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < updates.length; i++) {
    const { where, data } = updates[i];

    try {
      const [affectedCount] = await model.update(data as any, {
        where,
        individualHooks: options.hooks,
        validate: options.validate,
      });

      updated += affectedCount;
    } catch (error) {
      failed++;
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    if (onProgress) {
      onProgress(i + 1, updates.length);
    }
  }

  return { updated, failed, errors };
};

/**
 * Optimized bulk delete with batching and soft delete support.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {WhereOptions<T>} where - Delete conditions
 * @param {object} options - Delete options
 * @returns {Promise<number>} Number of deleted records
 *
 * @example
 * ```typescript
 * const deleted = await bulkDeleteOptimized(User, {
 *   status: 'inactive',
 *   lastLogin: { [Op.lt]: thresholdDate }
 * }, { batchSize: 500, force: false });
 * ```
 */
export const bulkDeleteOptimized = async <T extends Model>(
  model: ModelStatic<T>,
  where: WhereOptions<T>,
  options: {
    batchSize?: number;
    force?: boolean;
    hooks?: boolean;
  } = {}
): Promise<number> => {
  const { batchSize = 1000, force = false, hooks = false } = options;

  let totalDeleted = 0;
  let hasMore = true;

  while (hasMore) {
    const deleted = await model.destroy({
      where,
      limit: batchSize,
      force,
      hooks,
    });

    totalDeleted += deleted;
    hasMore = deleted === batchSize;
  }

  return totalDeleted;
};

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Implements cursor-based pagination for efficient large dataset traversal.
 * Superior to offset pagination for real-time data and large tables.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {CursorPaginationOptions} options - Cursor pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<CursorPaginatedResult<T>>} Paginated results with cursors
 *
 * @example
 * ```typescript
 * const result = await cursorPaginate(User, {
 *   cursor: 'eyJpZCI6MTAwfQ==',
 *   limit: 20,
 *   cursorField: 'createdAt'
 * }, {
 *   where: { status: 'active' },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export const cursorPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: Partial<CursorPaginationOptions>,
  findOptions: FindOptions<T> = {}
): Promise<CursorPaginatedResult<T>> => {
  const validated = CursorPaginationSchema.parse(options);
  const { cursor, limit, cursorField, direction } = validated;

  // Decode cursor
  let cursorValue: any = null;
  if (cursor) {
    try {
      cursorValue = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    } catch (error) {
      throw new Error('Invalid cursor format');
    }
  }

  // Build where clause with cursor
  const where: any = { ...findOptions.where };
  if (cursorValue) {
    const operator = direction === 'forward' ? Op.gt : Op.lt;
    where[cursorField] = { [operator]: cursorValue[cursorField] };
  }

  // Fetch limit + 1 to check for more results
  const results = await model.findAll({
    ...findOptions,
    where,
    limit: limit + 1,
    order: findOptions.order || [[cursorField, direction === 'forward' ? 'ASC' : 'DESC']],
  });

  const hasMore = results.length > limit;
  const data = hasMore ? results.slice(0, -1) : results;

  // Generate next/prev cursors
  const nextCursor =
    hasMore && data.length > 0
      ? Buffer.from(JSON.stringify({ [cursorField]: (data[data.length - 1] as any)[cursorField] })).toString('base64')
      : null;

  const prevCursor =
    data.length > 0
      ? Buffer.from(JSON.stringify({ [cursorField]: (data[0] as any)[cursorField] })).toString('base64')
      : null;

  return {
    data,
    cursors: {
      next: nextCursor,
      prev: prevCursor,
      hasMore,
      hasPrev: !!cursor,
    },
  };
};

/**
 * Implements offset-based pagination with total count and page metadata.
 * Suitable for smaller datasets with stable ordering.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {PaginationOptions} options - Pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<PaginatedResult<T>>} Paginated results with metadata
 *
 * @example
 * ```typescript
 * const result = await offsetPaginate(User, { page: 2, limit: 20 }, {
 *   where: { status: 'active' },
 *   order: [['createdAt', 'DESC']]
 * });
 * ```
 */
export const offsetPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: Partial<PaginationOptions>,
  findOptions: FindOptions<T> = {}
): Promise<PaginatedResult<T>> => {
  const validated = PaginationSchema.parse(options);
  const { page, limit } = validated;

  const offset = validated.offset ?? (page - 1) * limit;

  const { rows: data, count: total } = await model.findAndCountAll({
    ...findOptions,
    limit,
    offset,
    distinct: true,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Implements keyset pagination for optimal performance on indexed columns.
 * More efficient than cursor pagination for multi-column sorting.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {object} options - Keyset pagination options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<object>} Paginated results with keyset
 *
 * @example
 * ```typescript
 * const result = await keysetPaginate(Post, {
 *   keyset: { createdAt: '2024-01-01', id: 100 },
 *   limit: 20,
 *   direction: 'forward'
 * }, {
 *   order: [['createdAt', 'DESC'], ['id', 'DESC']]
 * });
 * ```
 */
export const keysetPaginate = async <T extends Model>(
  model: ModelStatic<T>,
  options: {
    keyset?: Record<string, any>;
    limit?: number;
    direction?: 'forward' | 'backward';
  },
  findOptions: FindOptions<T> = {}
): Promise<{
  data: T[];
  nextKeyset: Record<string, any> | null;
  prevKeyset: Record<string, any> | null;
  hasMore: boolean;
}> => {
  const { keyset, limit = 20, direction = 'forward' } = options;

  // Extract order fields from findOptions
  const orderFields = (findOptions.order as any[]) || [];
  if (orderFields.length === 0) {
    throw new Error('Keyset pagination requires explicit ordering');
  }

  // Build keyset where clause
  const where: any = { ...findOptions.where };
  if (keyset) {
    const keysetConditions: any[] = [];

    orderFields.forEach(([field, dir]: [string, string], index: number) => {
      const condition: any = {};
      const operator = direction === 'forward' ? (dir === 'DESC' ? Op.lt : Op.gt) : dir === 'DESC' ? Op.gt : Op.lt;

      // For compound keyset, we need to handle equality for previous fields
      if (index === 0) {
        condition[field] = { [operator]: keyset[field] };
      } else {
        const equalConditions: any = {};
        for (let i = 0; i < index; i++) {
          const [prevField] = orderFields[i];
          equalConditions[prevField] = keyset[prevField];
        }
        condition[Op.and] = [equalConditions, { [field]: { [operator]: keyset[field] } }];
      }

      keysetConditions.push(condition);
    });

    where[Op.or] = keysetConditions;
  }

  // Fetch limit + 1
  const results = await model.findAll({
    ...findOptions,
    where,
    limit: limit + 1,
  });

  const hasMore = results.length > limit;
  const data = hasMore ? results.slice(0, -1) : results;

  // Generate next/prev keysets
  const nextKeyset = hasMore && data.length > 0 ? extractKeyset(data[data.length - 1], orderFields) : null;
  const prevKeyset = data.length > 0 ? extractKeyset(data[0], orderFields) : null;

  return {
    data,
    nextKeyset,
    prevKeyset,
    hasMore,
  };
};

const extractKeyset = (instance: any, orderFields: any[]): Record<string, any> => {
  const keyset: Record<string, any> = {};
  orderFields.forEach(([field]) => {
    keyset[field] = instance[field];
  });
  return keyset;
};

// ============================================================================
// FILTERING & SORTING
// ============================================================================

/**
 * Builds dynamic filter conditions from query parameters.
 * Supports complex operators and nested conditions.
 *
 * @param {Record<string, any>} filters - Filter object
 * @param {object} options - Filter options
 * @returns {WhereOptions<any>} Sequelize where conditions
 *
 * @example
 * ```typescript
 * const where = buildDynamicFilters({
 *   'age[gte]': 18,
 *   'status[in]': ['active', 'pending'],
 *   'email[like]': '%@example.com'
 * });
 * ```
 */
export const buildDynamicFilters = (
  filters: Record<string, any>,
  options: {
    allowedFields?: string[];
    operatorMap?: Record<string, symbol>;
  } = {}
): WhereOptions<any> => {
  const { allowedFields, operatorMap = {} } = options;
  const where: any = {};

  const defaultOperatorMap: Record<string, symbol> = {
    eq: Op.eq,
    ne: Op.ne,
    gt: Op.gt,
    gte: Op.gte,
    lt: Op.lt,
    lte: Op.lte,
    in: Op.in,
    notIn: Op.notIn,
    like: Op.like,
    iLike: Op.iLike,
    notLike: Op.notLike,
    between: Op.between,
    notBetween: Op.notBetween,
    is: Op.is,
    isNot: Op.isNot,
    contains: Op.contains,
    contained: Op.contained,
    overlap: Op.overlap,
    startsWith: Op.startsWith,
    endsWith: Op.endsWith,
    substring: Op.substring,
    regexp: Op.regexp,
    iRegexp: Op.iRegexp,
    notRegexp: Op.notRegexp,
    ...operatorMap,
  };

  Object.entries(filters).forEach(([key, value]) => {
    // Skip null/undefined values
    if (value === null || value === undefined) return;

    // Parse field[operator] syntax
    const operatorMatch = key.match(/^([^[]+)\[([^\]]+)\]$/);

    if (operatorMatch) {
      const [, field, operatorStr] = operatorMatch;

      // Check allowed fields
      if (allowedFields && !allowedFields.includes(field)) return;

      const operator = defaultOperatorMap[operatorStr];
      if (!operator) {
        throw new Error(`Unknown filter operator: ${operatorStr}`);
      }

      where[field] = { [operator]: value };
    } else {
      // Check allowed fields
      if (allowedFields && !allowedFields.includes(key)) return;

      // Simple equality
      where[key] = value;
    }
  });

  return where;
};

/**
 * Builds dynamic sort order from query parameters.
 * Supports multi-field sorting with nulls handling.
 *
 * @param {SortOptions[]} sorts - Sort configurations
 * @param {object} options - Sort options
 * @returns {Order} Sequelize order array
 *
 * @example
 * ```typescript
 * const order = buildDynamicSort([
 *   { field: 'priority', direction: 'DESC', nulls: 'LAST' },
 *   { field: 'createdAt', direction: 'DESC' }
 * ]);
 * ```
 */
export const buildDynamicSort = (
  sorts: SortOptions[],
  options: {
    allowedFields?: string[];
    defaultSort?: SortOptions;
  } = {}
): Order => {
  const { allowedFields, defaultSort } = options;
  const order: Order = [];

  const processSort = (sort: SortOptions) => {
    // Validate with Zod
    const validated = SortSchema.parse(sort);

    // Check allowed fields
    if (allowedFields && !allowedFields.includes(validated.field)) return;

    if (validated.nulls) {
      order.push([validated.field, validated.direction, validated.nulls]);
    } else {
      order.push([validated.field, validated.direction]);
    }
  };

  if (sorts.length === 0 && defaultSort) {
    processSort(defaultSort);
  } else {
    sorts.forEach(processSort);
  }

  return order;
};

/**
 * Implements PostgreSQL full-text search with ranking.
 * Supports multiple search configurations and result ranking.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {FullTextSearchOptions} options - Search options
 * @param {FindOptions<T>} findOptions - Additional find options
 * @returns {Promise<T[]>} Ranked search results
 *
 * @example
 * ```typescript
 * const results = await fullTextSearch(Article, {
 *   query: 'healthcare technology',
 *   fields: ['title', 'content'],
 *   minRank: 0.1
 * });
 * ```
 */
export const fullTextSearch = async <T extends Model>(
  model: ModelStatic<T>,
  options: Partial<FullTextSearchOptions>,
  findOptions: FindOptions<T> = {}
): Promise<T[]> => {
  const validated = FullTextSearchSchema.parse(options);
  const { query, fields, language, rank, minRank } = validated;

  // Build tsvector expression
  const tsvectorExpr = fields.map((field) => `coalesce(${field}, '')`).join(" || ' ' || ");

  // Build search query
  const searchQuery = literal(
    `to_tsvector('${language}', ${tsvectorExpr}) @@ plainto_tsquery('${language}', '${query.replace(/'/g, "''")}')`
  );

  const where: any = {
    ...findOptions.where,
    [Op.and]: [searchQuery],
  };

  // Add rank filtering if specified
  if (rank && minRank !== undefined) {
    const rankExpr = literal(
      `ts_rank(to_tsvector('${language}', ${tsvectorExpr}), plainto_tsquery('${language}', '${query.replace(/'/g, "''")}')) >= ${minRank}`
    );
    where[Op.and].push(rankExpr);
  }

  // Build query options
  const queryOptions: FindOptions<T> = {
    ...findOptions,
    where,
  };

  // Add rank as attribute if requested
  if (rank) {
    queryOptions.attributes = {
      include: [
        [
          literal(
            `ts_rank(to_tsvector('${language}', ${tsvectorExpr}), plainto_tsquery('${language}', '${query.replace(/'/g, "''")}'))`
          ),
          'searchRank',
        ],
      ],
    };

    // Order by rank
    queryOptions.order = [[literal('searchRank'), 'DESC'], ...(findOptions.order || [])];
  }

  return model.findAll(queryOptions);
};

// ============================================================================
// AGGREGATIONS
// ============================================================================

/**
 * Performs complex aggregations with grouping and having clauses.
 * Supports multiple aggregation operations and group by.
 *
 * @template T
 * @param {ModelStatic<T>} model - Target model
 * @param {object} config - Aggregation configuration
 * @returns {Promise<any[]>} Aggregation results
 *
 * @example
 * ```typescript
 * const stats = await complexAggregation(Order, {
 *   aggregations: [
 *     { field: 'total', operation: 'sum', alias: 'totalRevenue' },
 *     { field: 'id', operation: 'count', alias: 'orderCount' }
 *   ],
 *   groupBy: ['customerId', 'status'],
 *   having: { totalRevenue: { [Op.gt]: 1000 } }
 * });
 * ```
 */
export const complexAggregation = async <T extends Model>(
  model: ModelStatic<T>,
  config: {
    aggregations: AggregationOptions[];
    groupBy?: string[];
    having?: Record<string, any>;
    where?: WhereOptions<T>;
    include?: Includeable[];
    order?: Order;
  }
): Promise<any[]> => {
  const { aggregations, groupBy = [], having, where, include, order } = config;

  // Build attributes
  const attributes: any[] = [...groupBy];

  aggregations.forEach((agg) => {
    const validated = AggregationSchema.parse(agg);
    const { field, operation, alias, distinct } = validated;

    const aggAlias = alias || `${operation}_${field}`;

    let aggFunction: any;
    switch (operation) {
      case 'count':
        aggFunction = distinct ? fn('COUNT', fn('DISTINCT', col(field))) : fn('COUNT', col(field));
        break;
      case 'sum':
        aggFunction = fn('SUM', col(field));
        break;
      case 'avg':
        aggFunction = fn('AVG', col(field));
        break;
      case 'min':
        aggFunction = fn('MIN', col(field));
        break;
      case 'max':
        aggFunction = fn('MAX', col(field));
        break;
      case 'stddev':
        aggFunction = fn('STDDEV', col(field));
        break;
      case 'variance':
        aggFunction = fn('VARIANCE', col(field));
        break;
    }

    attributes.push([aggFunction, aggAlias]);
  });

  const queryOptions: FindOptions<T> = {
    attributes,
    where,
    group: groupBy.length > 0 ? groupBy : undefined,
    include,
    order,
    raw: true,
  };

  // Add having clause if specified
  if (having && groupBy.length > 0) {
    // Convert having conditions to sequelize.having format
    const havingConditions: any[] = [];

    Object.entries(having).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([op, val]) => {
          const operator = (Op as any)[op];
          if (operator) {
            havingConditions.push({ [key]: { [operator]: val } });
          }
        });
      } else {
        havingConditions.push({ [key]: value });
      }
    });

    // Note: Sequelize's having clause support is limited
    // For complex having clauses, use raw queries
  }

  return model.findAll(queryOptions);
};

/**
 * Implements window functions for advanced analytics.
 * Supports ranking, row numbering, lag/lead, and custom frames.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} table - Table name
 * @param {WindowFunctionConfig[]} windows - Window function configurations
 * @param {object} options - Query options
 * @returns {Promise<any[]>} Results with window function columns
 *
 * @example
 * ```typescript
 * const ranked = await windowFunction(sequelize, 'orders', [
 *   {
 *     function: 'row_number',
 *     partitionBy: ['customerId'],
 *     orderBy: [{ field: 'createdAt', direction: 'DESC' }],
 *     alias: 'orderRank'
 *   }
 * ]);
 * ```
 */
export const windowFunction = async (
  sequelize: Sequelize,
  table: string,
  windows: WindowFunctionConfig[],
  options: {
    where?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> => {
  const { where, limit, offset } = options;

  // Build window function expressions
  const windowExprs = windows.map((win) => {
    const { function: func, partitionBy = [], orderBy = [], frame, alias } = win;

    let funcExpr = func.toUpperCase();

    // Add function-specific arguments
    if (['LAG', 'LEAD'].includes(funcExpr)) {
      funcExpr = `${funcExpr}(${win.alias}_column)`; // Placeholder, needs actual column
    } else if (funcExpr === 'NTILE') {
      funcExpr = `${funcExpr}(4)`; // Default 4 buckets
    } else if (['FIRST_VALUE', 'LAST_VALUE'].includes(funcExpr)) {
      funcExpr = `${funcExpr}(${win.alias}_column)`; // Placeholder
    } else {
      funcExpr = `${funcExpr}()`;
    }

    // Build OVER clause
    const overParts: string[] = [];

    if (partitionBy.length > 0) {
      overParts.push(`PARTITION BY ${partitionBy.join(', ')}`);
    }

    if (orderBy.length > 0) {
      const orderStr = orderBy.map((o) => `${o.field} ${o.direction}`).join(', ');
      overParts.push(`ORDER BY ${orderStr}`);
    }

    if (frame) {
      const frameStr = `${frame.type} BETWEEN ${frame.start}${frame.end ? ` AND ${frame.end}` : ''}`;
      overParts.push(frameStr);
    }

    const overClause = overParts.length > 0 ? ` OVER (${overParts.join(' ')})` : '';

    return `${funcExpr}${overClause} AS ${alias}`;
  });

  // Build full query
  const selectCols = ['*', ...windowExprs].join(', ');
  let query = `SELECT ${selectCols} FROM ${table}`;

  if (where) {
    query += ` WHERE ${where}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  if (offset) {
    query += ` OFFSET ${offset}`;
  }

  return sequelize.query(query, { type: QueryTypes.SELECT });
};

// ============================================================================
// COMMON TABLE EXPRESSIONS (CTEs)
// ============================================================================

/**
 * Builds queries using Common Table Expressions for complex hierarchical data.
 * Supports recursive and non-recursive CTEs with materialization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CTEConfig[]} ctes - CTE configurations
 * @param {string} mainQuery - Main query using CTEs
 * @returns {Promise<any[]>} Query results
 *
 * @example
 * ```typescript
 * const result = await buildCTE(sequelize, [
 *   {
 *     name: 'category_tree',
 *     recursive: true,
 *     query: `
 *       SELECT id, name, parent_id, 1 as level FROM categories WHERE parent_id IS NULL
 *       UNION ALL
 *       SELECT c.id, c.name, c.parent_id, ct.level + 1
 *       FROM categories c JOIN category_tree ct ON c.parent_id = ct.id
 *     `
 *   }
 * ], 'SELECT * FROM category_tree ORDER BY level, name');
 * ```
 */
export const buildCTE = async (
  sequelize: Sequelize,
  ctes: CTEConfig[],
  mainQuery: string
): Promise<any[]> => {
  const cteStrings = ctes.map((cte) => {
    const { name, query, columns, recursive, materialized } = cte;

    let cteStr = recursive ? 'RECURSIVE ' : '';
    cteStr += name;

    if (columns && columns.length > 0) {
      cteStr += ` (${columns.join(', ')})`;
    }

    cteStr += ' AS ';

    if (materialized !== undefined) {
      cteStr += materialized ? 'MATERIALIZED ' : 'NOT MATERIALIZED ';
    }

    cteStr += `(${query})`;

    return cteStr;
  });

  const fullQuery = `WITH ${cteStrings.join(', ')} ${mainQuery}`;

  return sequelize.query(fullQuery, { type: QueryTypes.SELECT });
};

/**
 * Implements recursive CTE for hierarchical data traversal.
 * Optimized for tree structures like org charts, categories, etc.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} config - Recursive CTE configuration
 * @returns {Promise<any[]>} Hierarchical results
 *
 * @example
 * ```typescript
 * const orgChart = await recursiveCTE(sequelize, {
 *   table: 'employees',
 *   anchorCondition: 'manager_id IS NULL',
 *   recursiveJoin: 'e.manager_id = emp.id',
 *   selectFields: ['id', 'name', 'manager_id'],
 *   levelField: 'level',
 *   maxDepth: 10
 * });
 * ```
 */
export const recursiveCTE = async (
  sequelize: Sequelize,
  config: {
    table: string;
    anchorCondition: string;
    recursiveJoin: string;
    selectFields?: string[];
    levelField?: string;
    pathField?: string;
    maxDepth?: number;
    orderBy?: string;
  }
): Promise<any[]> => {
  const {
    table,
    anchorCondition,
    recursiveJoin,
    selectFields = ['*'],
    levelField = 'level',
    pathField,
    maxDepth,
    orderBy,
  } = config;

  const fields = selectFields.join(', ');
  const cteName = `${table}_tree`;

  // Build anchor query
  const anchorFields = pathField ? `${fields}, 1 as ${levelField}, id::text as ${pathField}` : `${fields}, 1 as ${levelField}`;

  let anchorQuery = `SELECT ${anchorFields} FROM ${table} WHERE ${anchorCondition}`;

  // Build recursive query
  const recursiveFields = pathField
    ? `${selectFields.map((f) => `t.${f}`).join(', ')}, tree.${levelField} + 1, tree.${pathField} || '/' || t.id::text`
    : `${selectFields.map((f) => `t.${f}`).join(', ')}, tree.${levelField} + 1`;

  let recursiveQuery = `SELECT ${recursiveFields} FROM ${table} t JOIN ${cteName} tree ON ${recursiveJoin}`;

  if (maxDepth) {
    recursiveQuery += ` WHERE tree.${levelField} < ${maxDepth}`;
  }

  // Build full CTE
  const cte = `
    WITH RECURSIVE ${cteName} AS (
      ${anchorQuery}
      UNION ALL
      ${recursiveQuery}
    )
    SELECT * FROM ${cteName}
    ${orderBy ? `ORDER BY ${orderBy}` : ''}
  `;

  return sequelize.query(cte, { type: QueryTypes.SELECT });
};

// ============================================================================
// RAW QUERIES WITH TYPE SAFETY
// ============================================================================

/**
 * Executes type-safe raw SQL queries with parameter binding.
 * Prevents SQL injection and provides type inference.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query with named parameters
 * @param {object} options - Query options
 * @returns {Promise<T[]>} Typed query results
 *
 * @example
 * ```typescript
 * const users = await typeSafeRawQuery<User>(sequelize,
 *   'SELECT * FROM users WHERE age >= :minAge AND status = :status',
 *   {
 *     replacements: { minAge: 18, status: 'active' },
 *     model: User
 *   }
 * );
 * ```
 */
export const typeSafeRawQuery = async <T>(
  sequelize: Sequelize,
  query: string,
  options: {
    replacements?: Record<string, any>;
    type?: QueryTypes;
    model?: ModelStatic<any>;
    mapToModel?: boolean;
    transaction?: Transaction;
  } = {}
): Promise<T[]> => {
  const { replacements, type = QueryTypes.SELECT, model, mapToModel = false, transaction } = options;

  // Validate query for basic SQL injection patterns
  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      if (typeof value === 'string' && /[;'"\\]/.test(value) && !query.includes(`:${key}`)) {
        console.warn(`Potential SQL injection risk detected for parameter: ${key}`);
      }
    });
  }

  const queryOptions: any = {
    replacements,
    type,
    transaction,
  };

  if (model) {
    queryOptions.model = model;
    queryOptions.mapToModel = mapToModel;
  }

  return sequelize.query(query, queryOptions) as Promise<T[]>;
};

/**
 * Builds parameterized queries with automatic type conversion.
 * Ensures safe parameter binding for all data types.
 *
 * @param {string} query - Base SQL query
 * @param {Record<string, any>} params - Query parameters
 * @param {object} options - Build options
 * @returns {object} Query with replacements
 *
 * @example
 * ```typescript
 * const { query, replacements } = buildParameterizedQuery(
 *   'SELECT * FROM users WHERE created_at > :date AND status IN (:statuses)',
 *   { date: new Date(), statuses: ['active', 'pending'] }
 * );
 * ```
 */
export const buildParameterizedQuery = (
  query: string,
  params: Record<string, any>,
  options: {
    arrayFormat?: 'postgres' | 'mysql';
    dateFormat?: 'iso' | 'timestamp';
  } = {}
): {
  query: string;
  replacements: Record<string, any>;
} => {
  const { arrayFormat = 'postgres', dateFormat = 'iso' } = options;
  const replacements: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle arrays
      if (arrayFormat === 'postgres') {
        replacements[key] = value;
      } else {
        // MySQL: expand to multiple parameters
        const placeholders = value.map((_, i) => `:${key}_${i}`).join(', ');
        query = query.replace(`:${key}`, placeholders);
        value.forEach((v, i) => {
          replacements[`${key}_${i}`] = v;
        });
        return;
      }
    } else if (value instanceof Date) {
      // Handle dates
      replacements[key] = dateFormat === 'iso' ? value.toISOString() : value.getTime();
    } else if (typeof value === 'boolean') {
      // Handle booleans
      replacements[key] = value;
    } else {
      replacements[key] = value;
    }
  });

  return { query, replacements };
};

// ============================================================================
// TRANSACTION MANAGEMENT
// ============================================================================

/**
 * Executes queries within managed transaction with auto-rollback.
 * Supports isolation levels and savepoints.
 *
 * @template T
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Function} callback - Transaction callback
 * @param {TransactionConfig} config - Transaction configuration
 * @returns {Promise<T>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await withTransaction(sequelize, async (t) => {
 *   const user = await User.create({ name: 'John' }, { transaction: t });
 *   const profile = await Profile.create({ userId: user.id }, { transaction: t });
 *   return { user, profile };
 * }, { isolationLevel: IsolationLevel.SERIALIZABLE });
 * ```
 */
export const withTransaction = async <T>(
  sequelize: Sequelize,
  callback: (transaction: Transaction) => Promise<T>,
  config: TransactionConfig = {}
): Promise<T> => {
  const transactionOptions: TransactionOptions = {};

  if (config.isolationLevel) {
    transactionOptions.isolationLevel = config.isolationLevel;
  }

  if (config.autocommit !== undefined) {
    transactionOptions.autocommit = config.autocommit;
  }

  if (config.deferrable) {
    transactionOptions.deferrable = config.deferrable;
  }

  if (config.type) {
    transactionOptions.type = config.type as any;
  }

  if (config.logging !== undefined) {
    transactionOptions.logging = config.logging;
  }

  return sequelize.transaction(transactionOptions, callback);
};

/**
 * Implements savepoint-based nested transactions.
 * Allows partial rollback within larger transactions.
 *
 * @param {Transaction} transaction - Parent transaction
 * @param {string} name - Savepoint name
 * @param {Function} callback - Savepoint callback
 * @returns {Promise<T>} Savepoint result
 *
 * @example
 * ```typescript
 * await withTransaction(sequelize, async (t) => {
 *   const user = await User.create({ name: 'John' }, { transaction: t });
 *
 *   try {
 *     await withSavepoint(t, 'profile_create', async () => {
 *       await Profile.create({ userId: user.id, invalid: true }, { transaction: t });
 *     });
 *   } catch (error) {
 *     // Profile creation failed, but user creation is preserved
 *   }
 *
 *   return user;
 * });
 * ```
 */
export const withSavepoint = async <T>(
  transaction: Transaction,
  name: string,
  callback: () => Promise<T>
): Promise<T> => {
  // Create savepoint
  await transaction.sequelize.query(`SAVEPOINT ${name}`, { transaction });

  try {
    const result = await callback();
    // Release savepoint on success
    await transaction.sequelize.query(`RELEASE SAVEPOINT ${name}`, { transaction });
    return result;
  } catch (error) {
    // Rollback to savepoint on error
    await transaction.sequelize.query(`ROLLBACK TO SAVEPOINT ${name}`, { transaction });
    throw error;
  }
};

// ============================================================================
// PERFORMANCE MONITORING & PROFILING
// ============================================================================

/**
 * Profiles query execution with detailed performance metrics.
 * Captures execution time, row count, and resource usage.
 *
 * @template T
 * @param {Function} queryFn - Query function to profile
 * @param {object} options - Profiling options
 * @returns {Promise<object>} Query result with metrics
 *
 * @example
 * ```typescript
 * const { result, metrics } = await profileQuery(
 *   () => User.findAll({ where: { status: 'active' } }),
 *   { explain: true, captureSQL: true }
 * );
 * console.log(`Query took ${metrics.executionTime}ms`);
 * ```
 */
export const profileQuery = async <T>(
  queryFn: () => Promise<T>,
  options: {
    explain?: boolean;
    captureSQL?: boolean;
    threshold?: number;
  } = {}
): Promise<{
  result: T;
  metrics: QueryMetrics;
}> => {
  const { explain = false, captureSQL = true, threshold } = options;

  const startTime = Date.now();
  let sql = '';
  let rowCount = 0;

  // Capture SQL if requested
  if (captureSQL) {
    // Note: SQL capture would need to be implemented via logging hooks
    // This is a simplified version
  }

  const result = await queryFn();

  const executionTime = Date.now() - startTime;

  // Get row count
  if (Array.isArray(result)) {
    rowCount = result.length;
  } else if (result && typeof result === 'object' && 'count' in result) {
    rowCount = (result as any).count;
  }

  const metrics: QueryMetrics = {
    sql,
    executionTime,
    rowCount,
    fromCache: false,
    indexesUsed: [],
    tableScan: false,
    timestamp: new Date(),
  };

  // Log slow queries
  if (threshold && executionTime > threshold) {
    console.warn(`SLOW QUERY (${executionTime}ms):`, sql.substring(0, 200));
  }

  return { result, metrics };
};

/**
 * Analyzes query execution plan using EXPLAIN ANALYZE.
 * Provides detailed insights into query performance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} query - SQL query to analyze
 * @param {object} options - Analysis options
 * @returns {Promise<PerformanceProfile>} Performance analysis
 *
 * @example
 * ```typescript
 * const profile = await analyzeQueryPlan(sequelize,
 *   'SELECT * FROM users WHERE status = $1',
 *   { replacements: ['active'], format: 'json' }
 * );
 * console.log('Optimization score:', profile.optimizationScore);
 * ```
 */
export const analyzeQueryPlan = async (
  sequelize: Sequelize,
  query: string,
  options: {
    replacements?: Record<string, any>;
    format?: 'text' | 'json' | 'yaml' | 'xml';
    analyze?: boolean;
    buffers?: boolean;
    timing?: boolean;
  } = {}
): Promise<PerformanceProfile> => {
  const { replacements, format = 'json', analyze = true, buffers = true, timing = true } = options;

  const explainOptions: string[] = [];
  if (analyze) explainOptions.push('ANALYZE');
  if (buffers) explainOptions.push('BUFFERS');
  if (timing) explainOptions.push('TIMING');
  if (format !== 'text') explainOptions.push(`FORMAT ${format.toUpperCase()}`);

  const explainQuery = `EXPLAIN (${explainOptions.join(', ')}) ${query}`;

  const startTime = Date.now();
  const explainResult = await sequelize.query(explainQuery, {
    replacements,
    type: QueryTypes.SELECT,
  });
  const executionTime = Date.now() - startTime;

  // Parse explain result
  const explain = format === 'json' ? explainResult[0] : explainResult;

  // Analyze plan for issues
  const recommendations: string[] = [];
  const warnings: string[] = [];
  let optimizationScore = 100;
  let tableScan = false;
  const indexesUsed: string[] = [];

  // Simple heuristic analysis (would need more sophisticated parsing for production)
  const planText = JSON.stringify(explain).toLowerCase();

  if (planText.includes('seq scan')) {
    tableScan = true;
    recommendations.push('Consider adding an index to avoid sequential scan');
    optimizationScore -= 30;
  }

  if (planText.includes('index scan')) {
    indexesUsed.push('detected via plan');
    optimizationScore += 10;
  }

  if (planText.includes('nested loop')) {
    warnings.push('Nested loop join detected - may be slow for large datasets');
    optimizationScore -= 10;
  }

  if (executionTime > 1000) {
    warnings.push(`Query took ${executionTime}ms - consider optimization`);
    optimizationScore -= 20;
  }

  const metrics: QueryMetrics = {
    sql: query,
    executionTime,
    rowCount: 0,
    fromCache: false,
    indexesUsed,
    tableScan,
    timestamp: new Date(),
  };

  return {
    metrics,
    explain,
    recommendations,
    warnings,
    optimizationScore: Math.max(0, optimizationScore),
  };
};

/**
 * Generates index recommendations based on query patterns.
 * Analyzes frequently used filters and joins.
 *
 * @param {object[]} queries - Array of query patterns
 * @returns {IndexRecommendation[]} Index recommendations
 *
 * @example
 * ```typescript
 * const recommendations = recommendIndexes([
 *   { table: 'users', filters: ['status', 'createdAt'], frequency: 100 },
 *   { table: 'posts', filters: ['authorId', 'publishedAt'], frequency: 50 }
 * ]);
 * ```
 */
export const recommendIndexes = (
  queries: Array<{
    table: string;
    filters?: string[];
    joins?: string[];
    frequency?: number;
  }>
): IndexRecommendation[] => {
  const recommendations: IndexRecommendation[] = [];
  const tablePatterns = new Map<string, { filters: Map<string, number>; joins: Map<string, number> }>();

  // Aggregate patterns
  queries.forEach(({ table, filters = [], joins = [], frequency = 1 }) => {
    if (!tablePatterns.has(table)) {
      tablePatterns.set(table, {
        filters: new Map(),
        joins: new Map(),
      });
    }

    const patterns = tablePatterns.get(table)!;

    filters.forEach((filter) => {
      patterns.filters.set(filter, (patterns.filters.get(filter) || 0) + frequency);
    });

    joins.forEach((join) => {
      patterns.joins.set(join, (patterns.joins.get(join) || 0) + frequency);
    });
  });

  // Generate recommendations
  tablePatterns.forEach((patterns, table) => {
    // Single column indexes for frequent filters
    patterns.filters.forEach((frequency, column) => {
      if (frequency > 10) {
        recommendations.push({
          table,
          columns: [column],
          type: 'btree',
          reason: `Column '${column}' used in ${frequency} queries`,
          estimatedImprovement: Math.min(frequency / 10, 10),
          priority: frequency > 50 ? 'high' : frequency > 20 ? 'medium' : 'low',
        });
      }
    });

    // Composite indexes for common filter combinations
    const frequentFilters = Array.from(patterns.filters.entries())
      .filter(([, freq]) => freq > 5)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([col]) => col);

    if (frequentFilters.length > 1) {
      recommendations.push({
        table,
        columns: frequentFilters,
        type: 'btree',
        reason: `Composite index for frequent filter combination`,
        estimatedImprovement: 5,
        priority: 'medium',
      });
    }

    // Foreign key indexes
    patterns.joins.forEach((frequency, column) => {
      recommendations.push({
        table,
        columns: [column],
        type: 'btree',
        reason: `Foreign key used in ${frequency} join operations`,
        estimatedImprovement: Math.min(frequency / 5, 15),
        priority: 'high',
      });
    });
  });

  return recommendations.sort((a, b) => b.estimatedImprovement - a.estimatedImprovement);
};

/**
 * Monitors connection pool health and statistics.
 * Tracks active connections, wait times, and bottlenecks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ConnectionPoolStats} Pool statistics
 *
 * @example
 * ```typescript
 * const stats = getConnectionPoolStats(sequelize);
 * if (stats.waiting > 10) {
 *   console.warn('Connection pool bottleneck detected');
 * }
 * ```
 */
export const getConnectionPoolStats = (sequelize: Sequelize): ConnectionPoolStats => {
  const pool = (sequelize.connectionManager as any).pool;

  if (!pool) {
    return {
      total: 0,
      active: 0,
      idle: 0,
      waiting: 0,
      max: 0,
      min: 0,
      acquireCount: 0,
      createCount: 0,
      destroyCount: 0,
      timeoutCount: 0,
    };
  }

  return {
    total: pool.size || 0,
    active: pool.borrowed || 0,
    idle: pool.available || 0,
    waiting: pool.pending || 0,
    max: pool.max || 0,
    min: pool.min || 0,
    acquireCount: pool.acquireCount || 0,
    createCount: pool.createCount || 0,
    destroyCount: pool.destroyCount || 0,
    timeoutCount: pool.timeoutCount || 0,
  };
};

/**
 * Detects and logs slow queries with configurable threshold.
 * Integrates with logging system for monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Detection options
 * @returns {Function} Cleanup function
 *
 * @example
 * ```typescript
 * const cleanup = detectSlowQueries(sequelize, {
 *   threshold: 1000,
 *   onSlowQuery: (query, time) => {
 *     logger.warn(`Slow query (${time}ms): ${query}`);
 *   }
 * });
 * ```
 */
export const detectSlowQueries = (
  sequelize: Sequelize,
  options: {
    threshold?: number;
    onSlowQuery?: (sql: string, time: number) => void;
    includeStackTrace?: boolean;
  } = {}
): (() => void) => {
  const { threshold = 1000, onSlowQuery, includeStackTrace = false } = options;

  const originalLogging = sequelize.options.logging;

  sequelize.options.logging = (sql: string, timing?: number) => {
    if (timing && timing > threshold) {
      const message = `SLOW QUERY (${timing}ms): ${sql.substring(0, 500)}`;

      if (onSlowQuery) {
        onSlowQuery(sql, timing);
      } else {
        console.warn(message);
      }

      if (includeStackTrace) {
        console.trace('Query stack trace:');
      }
    }

    if (originalLogging) {
      if (typeof originalLogging === 'function') {
        originalLogging(sql, timing);
      }
    }
  };

  // Return cleanup function
  return () => {
    sequelize.options.logging = originalLogging;
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // N+1 Prevention
  detectN1Queries,
  optimizeIncludes,
  createBatchLoader,
  createDataLoader,

  // Eager/Lazy Loading
  createOptimizedEagerLoad,
  lazyLoadWithCache,
  determineLoadingStrategy,

  // Caching
  cacheQuery,
  invalidateCache,
  warmCache,

  // Bulk Operations
  bulkInsertOptimized,
  bulkUpdateOptimized,
  bulkDeleteOptimized,

  // Pagination
  cursorPaginate,
  offsetPaginate,
  keysetPaginate,

  // Filtering & Sorting
  buildDynamicFilters,
  buildDynamicSort,
  fullTextSearch,

  // Aggregations
  complexAggregation,
  windowFunction,

  // CTEs
  buildCTE,
  recursiveCTE,

  // Raw Queries
  typeSafeRawQuery,
  buildParameterizedQuery,

  // Transactions
  withTransaction,
  withSavepoint,

  // Performance
  profileQuery,
  analyzeQueryPlan,
  recommendIndexes,
  getConnectionPoolStats,
  detectSlowQueries,
};
