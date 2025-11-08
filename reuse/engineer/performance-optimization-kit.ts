/**
 * LOC: PERFORMANCE_OPT_KIT_001
 * File: /reuse/engineer/performance-optimization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/testing
 *   - typeorm
 *   - redis
 *   - compression
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and services
 *   - Database repositories
 *   - Caching services
 *   - Performance monitoring services
 *   - Load testing utilities
 */

/**
 * File: /reuse/engineer/performance-optimization-kit.ts
 * Locator: WC-PERFORMANCE-OPT-KIT-001
 * Purpose: Comprehensive Performance Optimization and Scalability Toolkit
 *
 * Upstream: @nestjs/common, @nestjs/testing, typeorm, redis, compression
 * Downstream: Controllers, Services, Repositories, Monitoring, Testing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, TypeORM 0.3+, Redis 4+
 * Exports: 45 performance optimization functions with comprehensive testing utilities
 *
 * LLM Context: Enterprise-grade performance optimization toolkit for NestJS healthcare applications.
 * Provides query profiling, caching strategies, connection pooling, compression, lazy loading,
 * pagination, query optimization, memory monitoring, load testing, metrics collection, and
 * comprehensive NestJS testing helpers for performance features.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  timestamp: Date;
  operation: string;
  duration: number;
  memoryUsage: MemoryUsage;
  cpuUsage?: number;
  metadata?: Record<string, any>;
}

/**
 * Memory usage details
 */
export interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * Query performance profile
 */
export interface QueryPerformanceProfile {
  query: string;
  executionTime: number;
  rowsAffected?: number;
  parameters?: any[];
  timestamp: Date;
  database?: string;
  slow?: boolean;
  optimizationSuggestions?: string[];
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number;
  strategy: 'LRU' | 'LFU' | 'FIFO' | 'TTL';
  keyPrefix?: string;
  namespace?: string;
}

/**
 * Cache entry structure
 */
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  size?: number;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  cache?: boolean;
  cacheTTL?: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Connection pool configuration
 */
export interface ConnectionPoolConfig {
  min: number;
  max: number;
  acquireTimeoutMillis?: number;
  idleTimeoutMillis?: number;
  reapIntervalMillis?: number;
  createTimeoutMillis?: number;
  propagateCreateError?: boolean;
}

/**
 * Connection pool stats
 */
export interface ConnectionPoolStats {
  total: number;
  active: number;
  idle: number;
  waiting: number;
  created: number;
  destroyed: number;
  avgWaitTime: number;
  maxWaitTime: number;
}

/**
 * Compression configuration
 */
export interface CompressionConfig {
  threshold: number; // Minimum size in bytes to compress
  level?: number; // Compression level 1-9
  algorithm: 'gzip' | 'brotli' | 'deflate';
  mimeTypes?: string[];
}

/**
 * Lazy loading configuration
 */
export interface LazyLoadConfig {
  batchSize: number;
  preloadDepth?: number;
  relations?: string[];
  cache?: boolean;
}

/**
 * Query optimization result
 */
export interface QueryOptimization {
  originalQuery: string;
  optimizedQuery: string;
  estimatedImprovement: number;
  suggestions: string[];
  indexes?: string[];
}

/**
 * Load test configuration
 */
export interface LoadTestConfig {
  duration: number; // in seconds
  concurrentUsers: number;
  rampUpTime?: number;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Load test result
 */
export interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  percentiles: {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  errors: Array<{ message: string; count: number }>;
}

/**
 * Performance budget
 */
export interface PerformanceBudget {
  metric: string;
  threshold: number;
  actual?: number;
  passed?: boolean;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
}

/**
 * Database index suggestion
 */
export interface IndexSuggestion {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'composite';
  reason: string;
  estimatedImprovement: string;
}

// ============================================================================
// QUERY PERFORMANCE PROFILING
// ============================================================================

/**
 * Profiles query execution time
 */
export async function profileQuery<T>(
  query: () => Promise<T>,
  queryString?: string,
): Promise<{ result: T; profile: QueryPerformanceProfile }> {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();

  const result = await query();

  const executionTime = Date.now() - startTime;
  const endMemory = process.memoryUsage();

  const profile: QueryPerformanceProfile = {
    query: queryString || 'anonymous',
    executionTime,
    timestamp: new Date(),
    slow: executionTime > 1000, // Consider slow if > 1 second
    optimizationSuggestions: executionTime > 1000 ? generateOptimizationSuggestions(queryString) : [],
  };

  return { result, profile };
}

/**
 * Generates optimization suggestions for slow queries
 */
export function generateOptimizationSuggestions(query?: string): string[] {
  const suggestions: string[] = [];

  if (!query) return suggestions;

  if (query.includes('SELECT *')) {
    suggestions.push('Avoid SELECT *, specify only needed columns');
  }

  if (query.includes('WHERE') && !query.includes('INDEX')) {
    suggestions.push('Consider adding indexes on WHERE clause columns');
  }

  if (query.includes('JOIN') && query.split('JOIN').length > 3) {
    suggestions.push('Multiple JOINs detected, consider denormalization or caching');
  }

  if (query.includes('LIKE') && query.includes('%')) {
    suggestions.push('LIKE with leading wildcard prevents index usage');
  }

  if (query.includes('OR')) {
    suggestions.push('OR conditions may prevent index usage, consider UNION');
  }

  return suggestions;
}

/**
 * Analyzes query patterns to identify bottlenecks
 */
export function analyzeQueryPatterns(
  profiles: QueryPerformanceProfile[],
): {
  slowQueries: QueryPerformanceProfile[];
  averageExecutionTime: number;
  totalQueries: number;
  queryDistribution: Record<string, number>;
} {
  const slowQueries = profiles.filter((p) => p.slow);
  const averageExecutionTime =
    profiles.reduce((sum, p) => sum + p.executionTime, 0) / profiles.length;

  const queryDistribution = profiles.reduce((acc, p) => {
    const queryType = p.query.split(' ')[0] || 'unknown';
    acc[queryType] = (acc[queryType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    slowQueries,
    averageExecutionTime,
    totalQueries: profiles.length,
    queryDistribution,
  };
}

/**
 * Creates a query profiler middleware
 */
export function createQueryProfiler(slowQueryThreshold: number = 1000) {
  const profiles: QueryPerformanceProfile[] = [];

  return {
    profile: async <T>(query: () => Promise<T>, queryString?: string) => {
      const { result, profile } = await profileQuery(query, queryString);
      profiles.push(profile);

      if (profile.executionTime > slowQueryThreshold) {
        console.warn('Slow query detected:', profile);
      }

      return result;
    },
    getProfiles: () => profiles,
    getSlowQueries: () => profiles.filter((p) => p.slow),
    clear: () => {
      profiles.length = 0;
    },
  };
}

/**
 * Monitors query execution times and alerts on anomalies
 */
export function monitorQueryPerformance(
  profile: QueryPerformanceProfile,
  baseline: number,
  threshold: number = 1.5,
): { isAnomaly: boolean; percentageIncrease: number } {
  const percentageIncrease = ((profile.executionTime - baseline) / baseline) * 100;
  const isAnomaly = profile.executionTime > baseline * threshold;

  if (isAnomaly) {
    console.warn(
      `Query performance anomaly: ${profile.query} took ${profile.executionTime}ms (baseline: ${baseline}ms, +${percentageIncrease.toFixed(2)}%)`,
    );
  }

  return { isAnomaly, percentageIncrease };
}

// ============================================================================
// CACHING STRATEGIES AND HELPERS
// ============================================================================

/**
 * In-memory cache implementation
 */
export class MemoryCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
    this.startCleanupInterval();
  }

  set(key: string, value: T, ttl?: number): void {
    const effectiveTTL = ttl || this.config.ttl;
    const now = new Date();

    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      expiresAt: new Date(now.getTime() + effectiveTTL * 1000),
      accessCount: 0,
      lastAccessed: now,
      size: this.estimateSize(value),
    };

    this.cache.set(this.getFullKey(key), entry);
    this.enforceMaxSize();
  }

  get(key: string): T | null {
    const entry = this.cache.get(this.getFullKey(key));

    if (!entry) return null;

    if (new Date() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = new Date();

    return entry.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(this.getFullKey(key));
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(this.getFullKey(key));
    if (!entry) return false;

    if (new Date() > entry.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private getFullKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
  }

  private estimateSize(value: any): number {
    return JSON.stringify(value).length;
  }

  private enforceMaxSize(): void {
    if (!this.config.maxSize || this.cache.size <= this.config.maxSize) return;

    const entries = Array.from(this.cache.entries());

    switch (this.config.strategy) {
      case 'LRU':
        entries.sort((a, b) => a[1].lastAccessed.getTime() - b[1].lastAccessed.getTime());
        break;
      case 'LFU':
        entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
        break;
      case 'FIFO':
        entries.sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime());
        break;
      case 'TTL':
        entries.sort((a, b) => a[1].expiresAt.getTime() - b[1].expiresAt.getTime());
        break;
    }

    const toRemove = entries.slice(0, entries.length - this.config.maxSize);
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = new Date();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }
}

/**
 * Cache decorator factory for methods
 */
export function Cacheable(config: Partial<CacheConfig> = {}) {
  const cache = new MemoryCache({
    ttl: config.ttl || 300,
    maxSize: config.maxSize || 1000,
    strategy: config.strategy || 'LRU',
    keyPrefix: config.keyPrefix || 'cache',
  });

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, result);

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache-aside pattern implementation
 */
export async function cacheAside<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  cache: MemoryCache<T>,
  ttl?: number,
): Promise<T> {
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  const value = await fetchFunction();
  cache.set(key, value, ttl);

  return value;
}

/**
 * Cache warming utility
 */
export async function warmCache<T>(
  keys: string[],
  fetchFunction: (key: string) => Promise<T>,
  cache: MemoryCache<T>,
  concurrency: number = 5,
): Promise<void> {
  const batches = chunkArray(keys, concurrency);

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (key) => {
        const value = await fetchFunction(key);
        cache.set(key, value);
      }),
    );
  }
}

/**
 * Invalidates cache entries based on pattern
 */
export function invalidateCachePattern(
  pattern: RegExp,
  cache: MemoryCache,
): number {
  const keys = cache.keys();
  let invalidated = 0;

  keys.forEach((key) => {
    if (pattern.test(key)) {
      cache.delete(key);
      invalidated++;
    }
  });

  return invalidated;
}

// ============================================================================
// DATABASE CONNECTION POOLING
// ============================================================================

/**
 * Creates a connection pool manager
 */
export class ConnectionPoolManager {
  private connections: Array<{ id: string; inUse: boolean; createdAt: Date }> = [];
  private waitQueue: Array<{ resolve: Function; reject: Function; timestamp: Date }> = [];
  private stats = {
    created: 0,
    destroyed: 0,
    totalWaitTime: 0,
    maxWaitTime: 0,
  };

  constructor(private config: ConnectionPoolConfig) {
    this.initializePool();
  }

  private initializePool(): void {
    for (let i = 0; i < this.config.min; i++) {
      this.connections.push({
        id: `conn-${i}`,
        inUse: false,
        createdAt: new Date(),
      });
      this.stats.created++;
    }
  }

  async acquire(): Promise<string> {
    const availableConnection = this.connections.find((c) => !c.inUse);

    if (availableConnection) {
      availableConnection.inUse = true;
      return availableConnection.id;
    }

    if (this.connections.length < this.config.max) {
      const newConnection = {
        id: `conn-${this.connections.length}`,
        inUse: true,
        createdAt: new Date(),
      };
      this.connections.push(newConnection);
      this.stats.created++;
      return newConnection.id;
    }

    return this.waitForConnection();
  }

  private waitForConnection(): Promise<string> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const index = this.waitQueue.findIndex((w) => w.resolve === resolve);
        if (index > -1) {
          this.waitQueue.splice(index, 1);
        }
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeoutMillis || 30000);

      this.waitQueue.push({
        resolve: (connectionId: string) => {
          clearTimeout(timeoutId);
          const waitTime = Date.now() - startTime;
          this.stats.totalWaitTime += waitTime;
          this.stats.maxWaitTime = Math.max(this.stats.maxWaitTime, waitTime);
          resolve(connectionId);
        },
        reject,
        timestamp: new Date(),
      });
    });
  }

  release(connectionId: string): void {
    const connection = this.connections.find((c) => c.id === connectionId);

    if (connection) {
      if (this.waitQueue.length > 0) {
        const waiter = this.waitQueue.shift();
        waiter?.resolve(connectionId);
      } else {
        connection.inUse = false;
      }
    }
  }

  getStats(): ConnectionPoolStats {
    const active = this.connections.filter((c) => c.inUse).length;
    const idle = this.connections.filter((c) => !c.inUse).length;

    return {
      total: this.connections.length,
      active,
      idle,
      waiting: this.waitQueue.length,
      created: this.stats.created,
      destroyed: this.stats.destroyed,
      avgWaitTime: this.stats.created > 0 ? this.stats.totalWaitTime / this.stats.created : 0,
      maxWaitTime: this.stats.maxWaitTime,
    };
  }

  async drain(): Promise<void> {
    while (this.waitQueue.length > 0) {
      const waiter = this.waitQueue.shift();
      waiter?.reject(new Error('Pool is draining'));
    }

    this.connections = [];
    this.stats.destroyed += this.connections.length;
  }
}

/**
 * Monitors connection pool health
 */
export function monitorConnectionPool(
  stats: ConnectionPoolStats,
  config: ConnectionPoolConfig,
): { healthy: boolean; issues: string[] } {
  const issues: string[] = [];

  if (stats.active / stats.total > 0.9) {
    issues.push('Connection pool is near capacity (>90% active)');
  }

  if (stats.waiting > config.max * 0.5) {
    issues.push('High number of waiting connections');
  }

  if (stats.avgWaitTime > 100) {
    issues.push('Average wait time exceeds 100ms');
  }

  if (stats.maxWaitTime > 1000) {
    issues.push('Max wait time exceeds 1 second');
  }

  return {
    healthy: issues.length === 0,
    issues,
  };
}

// ============================================================================
// REQUEST/RESPONSE COMPRESSION
// ============================================================================

/**
 * Determines if content should be compressed
 */
export function shouldCompress(
  contentLength: number,
  contentType: string,
  config: CompressionConfig,
): boolean {
  if (contentLength < config.threshold) {
    return false;
  }

  if (config.mimeTypes && config.mimeTypes.length > 0) {
    return config.mimeTypes.some((type) => contentType.includes(type));
  }

  // Default compressible types
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
  ];

  return compressibleTypes.some((type) => contentType.includes(type));
}

/**
 * Calculates compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number,
): { ratio: number; percentageReduction: number } {
  const ratio = originalSize / compressedSize;
  const percentageReduction = ((originalSize - compressedSize) / originalSize) * 100;

  return { ratio, percentageReduction };
}

/**
 * Creates compression middleware configuration
 */
export function createCompressionMiddleware(config: Partial<CompressionConfig> = {}) {
  const defaultConfig: CompressionConfig = {
    threshold: config.threshold || 1024,
    level: config.level || 6,
    algorithm: config.algorithm || 'gzip',
    mimeTypes: config.mimeTypes || [
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'application/javascript',
    ],
  };

  return {
    filter: (contentType: string, contentLength: number) =>
      shouldCompress(contentLength, contentType, defaultConfig),
    level: defaultConfig.level,
  };
}

// ============================================================================
// LAZY LOADING UTILITIES
// ============================================================================

/**
 * Implements lazy loading for large datasets
 */
export async function* lazyLoad<T>(
  fetchFunction: (offset: number, limit: number) => Promise<T[]>,
  config: LazyLoadConfig,
): AsyncGenerator<T[]> {
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const batch = await fetchFunction(offset, config.batchSize);

    if (batch.length === 0) {
      hasMore = false;
    } else {
      yield batch;
      offset += config.batchSize;

      if (batch.length < config.batchSize) {
        hasMore = false;
      }
    }
  }
}

/**
 * Preloads relations for entities
 */
export async function preloadRelations<T>(
  entities: T[],
  relations: string[],
  loadFunction: (entity: T, relation: string) => Promise<any>,
): Promise<T[]> {
  for (const entity of entities) {
    for (const relation of relations) {
      const data = await loadFunction(entity, relation);
      (entity as any)[relation] = data;
    }
  }

  return entities;
}

/**
 * Lazy loads nested relations
 */
export class LazyRelationLoader<T> {
  private loaded = new Map<string, any>();

  constructor(
    private entity: T,
    private loadFunction: (relation: string) => Promise<any>,
  ) {}

  async load(relation: string): Promise<any> {
    if (this.loaded.has(relation)) {
      return this.loaded.get(relation);
    }

    const data = await this.loadFunction(relation);
    this.loaded.set(relation, data);

    return data;
  }

  isLoaded(relation: string): boolean {
    return this.loaded.has(relation);
  }

  clearCache(): void {
    this.loaded.clear();
  }
}

// ============================================================================
// PAGINATION OPTIMIZATION
// ============================================================================

/**
 * Creates optimized pagination
 */
export function createPagination<T>(
  items: T[],
  config: PaginationConfig,
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / config.limit);
  const offset = (config.page - 1) * config.limit;

  let paginatedItems = items.slice(offset, offset + config.limit);

  // Apply sorting if specified
  if (config.sortBy) {
    paginatedItems = sortItems(paginatedItems, config.sortBy, config.sortOrder);
  }

  return {
    items: paginatedItems,
    total,
    page: config.page,
    limit: config.limit,
    totalPages,
    hasNext: config.page < totalPages,
    hasPrevious: config.page > 1,
  };
}

/**
 * Cursor-based pagination for large datasets
 */
export interface CursorPaginationConfig {
  cursor?: string;
  limit: number;
  sortField: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

export function createCursorPagination<T>(
  items: T[],
  config: CursorPaginationConfig,
): CursorPaginatedResult<T> {
  let filteredItems = [...items];

  // Filter by cursor
  if (config.cursor) {
    const cursorIndex = items.findIndex(
      (item) => (item as any)[config.sortField] === config.cursor,
    );
    if (cursorIndex > -1) {
      filteredItems = items.slice(cursorIndex + 1);
    }
  }

  const paginatedItems = filteredItems.slice(0, config.limit);
  const hasMore = filteredItems.length > config.limit;

  const nextCursor = hasMore
    ? (paginatedItems[paginatedItems.length - 1] as any)[config.sortField]
    : undefined;

  return {
    items: paginatedItems,
    nextCursor,
    hasMore,
  };
}

/**
 * Builds optimized database pagination query
 */
export function buildPaginationQuery(config: PaginationConfig): {
  skip: number;
  take: number;
  order?: Record<string, 'ASC' | 'DESC'>;
} {
  const skip = (config.page - 1) * config.limit;
  const take = config.limit;

  const query: any = { skip, take };

  if (config.sortBy) {
    query.order = {
      [config.sortBy]: config.sortOrder || 'ASC',
    };
  }

  return query;
}

/**
 * Sorts items by field
 */
function sortItems<T>(
  items: T[],
  sortBy: string,
  sortOrder: 'ASC' | 'DESC' = 'ASC',
): T[] {
  return [...items].sort((a, b) => {
    const aVal = getNestedValue(a, sortBy);
    const bVal = getNestedValue(b, sortBy);

    if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  });
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// ============================================================================
// DATABASE QUERY OPTIMIZATION
// ============================================================================

/**
 * Suggests indexes for query optimization
 */
export function suggestIndexes(
  query: string,
  tableName: string,
): IndexSuggestion[] {
  const suggestions: IndexSuggestion[] = [];

  // Extract WHERE clause columns
  const whereMatch = query.match(/WHERE\s+(.+?)(?:GROUP|ORDER|LIMIT|$)/i);
  if (whereMatch) {
    const whereClause = whereMatch[1];
    const columns = extractColumnsFromWhere(whereClause);

    if (columns.length > 0) {
      if (columns.length === 1) {
        suggestions.push({
          table: tableName,
          columns,
          type: 'btree',
          reason: 'Single column WHERE clause',
          estimatedImprovement: 'High - Simple index lookup',
        });
      } else {
        suggestions.push({
          table: tableName,
          columns,
          type: 'composite',
          reason: 'Multiple columns in WHERE clause',
          estimatedImprovement: 'Medium - Composite index may help',
        });
      }
    }
  }

  // Extract JOIN columns
  const joinMatches = query.matchAll(/JOIN\s+\w+\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi);
  for (const match of joinMatches) {
    suggestions.push({
      table: match[1],
      columns: [match[2]],
      type: 'btree',
      reason: 'JOIN condition column',
      estimatedImprovement: 'High - Improves JOIN performance',
    });
  }

  // Extract ORDER BY columns
  const orderMatch = query.match(/ORDER\s+BY\s+(.+?)(?:LIMIT|$)/i);
  if (orderMatch) {
    const orderColumns = orderMatch[1]
      .split(',')
      .map((col) => col.trim().split(/\s+/)[0]);

    suggestions.push({
      table: tableName,
      columns: orderColumns,
      type: 'btree',
      reason: 'ORDER BY clause',
      estimatedImprovement: 'Medium - Avoids sorting',
    });
  }

  return suggestions;
}

function extractColumnsFromWhere(whereClause: string): string[] {
  const columns: string[] = [];
  const columnPattern = /(\w+)\s*[=<>]/g;
  let match;

  while ((match = columnPattern.exec(whereClause)) !== null) {
    if (!['AND', 'OR', 'NOT'].includes(match[1].toUpperCase())) {
      columns.push(match[1]);
    }
  }

  return [...new Set(columns)];
}

/**
 * Optimizes SELECT query
 */
export function optimizeSelectQuery(query: string): QueryOptimization {
  let optimizedQuery = query;
  const suggestions: string[] = [];

  // Replace SELECT *
  if (query.includes('SELECT *')) {
    suggestions.push('Replace SELECT * with specific columns');
    // Note: In production, this would need to know which columns to select
  }

  // Add LIMIT if missing for large result sets
  if (!query.includes('LIMIT') && !query.includes('TOP')) {
    optimizedQuery += ' LIMIT 1000';
    suggestions.push('Added LIMIT to prevent large result sets');
  }

  // Suggest EXISTS instead of COUNT for existence checks
  if (query.match(/COUNT\(\*\)\s*>\s*0/i)) {
    suggestions.push('Use EXISTS instead of COUNT(*) > 0 for better performance');
  }

  return {
    originalQuery: query,
    optimizedQuery,
    estimatedImprovement: suggestions.length * 10,
    suggestions,
    indexes: suggestIndexes(query, extractTableName(query)).map(
      (s) => `CREATE INDEX idx_${s.columns.join('_')} ON ${s.table}(${s.columns.join(', ')})`,
    ),
  };
}

function extractTableName(query: string): string {
  const match = query.match(/FROM\s+(\w+)/i);
  return match ? match[1] : 'unknown';
}

/**
 * Analyzes and optimizes N+1 query problem
 */
export function detectNPlusOneQueries(queries: QueryPerformanceProfile[]): {
  detected: boolean;
  patterns: Array<{ query: string; count: number }>;
  suggestion: string;
} {
  const queryGroups = queries.reduce((acc, q) => {
    const normalizedQuery = q.query.replace(/\d+/g, '?');
    acc[normalizedQuery] = (acc[normalizedQuery] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patterns = Object.entries(queryGroups)
    .filter(([_, count]) => count > 10)
    .map(([query, count]) => ({ query, count }));

  const detected = patterns.length > 0;

  return {
    detected,
    patterns,
    suggestion: detected
      ? 'Consider using eager loading or JOIN to fetch related data in a single query'
      : 'No N+1 query patterns detected',
  };
}

// ============================================================================
// MEMORY USAGE MONITORING
// ============================================================================

/**
 * Monitors memory usage
 */
export function getMemoryUsage(): MemoryUsage {
  const usage = process.memoryUsage();

  return {
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
    rss: usage.rss,
  };
}

/**
 * Formats memory size for display
 */
export function formatMemorySize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Creates memory usage monitor
 */
export class MemoryMonitor {
  private measurements: MemoryUsage[] = [];
  private intervalId?: NodeJS.Timeout;

  start(intervalMs: number = 1000): void {
    this.intervalId = setInterval(() => {
      this.measurements.push(getMemoryUsage());
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getStats(): {
    average: MemoryUsage;
    peak: MemoryUsage;
    current: MemoryUsage;
  } {
    if (this.measurements.length === 0) {
      const current = getMemoryUsage();
      return { average: current, peak: current, current };
    }

    const average: MemoryUsage = {
      heapUsed: this.avg(this.measurements.map((m) => m.heapUsed)),
      heapTotal: this.avg(this.measurements.map((m) => m.heapTotal)),
      external: this.avg(this.measurements.map((m) => m.external)),
      rss: this.avg(this.measurements.map((m) => m.rss)),
    };

    const peak: MemoryUsage = {
      heapUsed: Math.max(...this.measurements.map((m) => m.heapUsed)),
      heapTotal: Math.max(...this.measurements.map((m) => m.heapTotal)),
      external: Math.max(...this.measurements.map((m) => m.external)),
      rss: Math.max(...this.measurements.map((m) => m.rss)),
    };

    return { average, peak, current: this.measurements[this.measurements.length - 1] };
  }

  clear(): void {
    this.measurements = [];
  }

  private avg(numbers: number[]): number {
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
}

/**
 * Detects memory leaks
 */
export function detectMemoryLeak(
  measurements: MemoryUsage[],
  threshold: number = 0.1, // 10% increase per measurement
): { detected: boolean; trend: number } {
  if (measurements.length < 2) {
    return { detected: false, trend: 0 };
  }

  const heapTrend =
    (measurements[measurements.length - 1].heapUsed - measurements[0].heapUsed) /
    measurements[0].heapUsed;

  const detected = heapTrend > threshold;

  return { detected, trend: heapTrend };
}

// ============================================================================
// LOAD TESTING UTILITIES
// ============================================================================

/**
 * Performs a simple load test
 */
export async function performLoadTest(
  config: LoadTestConfig,
  requestFunction: () => Promise<any>,
): Promise<LoadTestResult> {
  const results: Array<{ success: boolean; duration: number; error?: string }> = [];
  const startTime = Date.now();

  const requests: Promise<void>[] = [];

  for (let i = 0; i < config.concurrentUsers; i++) {
    requests.push(
      (async () => {
        while (Date.now() - startTime < config.duration * 1000) {
          const reqStart = Date.now();

          try {
            await requestFunction();
            results.push({ success: true, duration: Date.now() - reqStart });
          } catch (error: any) {
            results.push({
              success: false,
              duration: Date.now() - reqStart,
              error: error.message,
            });
          }
        }
      })(),
    );
  }

  await Promise.all(requests);

  return analyzeLoadTestResults(results);
}

/**
 * Analyzes load test results
 */
export function analyzeLoadTestResults(
  results: Array<{ success: boolean; duration: number; error?: string }>,
): LoadTestResult {
  const successfulResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);

  const durations = results.map((r) => r.duration).sort((a, b) => a - b);

  const errorCounts = failedResults.reduce((acc, r) => {
    const msg = r.error || 'Unknown error';
    acc[msg] = (acc[msg] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRequests: results.length,
    successfulRequests: successfulResults.length,
    failedRequests: failedResults.length,
    averageResponseTime: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    minResponseTime: Math.min(...durations),
    maxResponseTime: Math.max(...durations),
    requestsPerSecond: results.length / (Math.max(...durations) / 1000),
    percentiles: {
      p50: calculatePercentile(durations, 50),
      p75: calculatePercentile(durations, 75),
      p90: calculatePercentile(durations, 90),
      p95: calculatePercentile(durations, 95),
      p99: calculatePercentile(durations, 99),
    },
    errors: Object.entries(errorCounts).map(([message, count]) => ({ message, count })),
  };
}

function calculatePercentile(sortedArray: number[], percentile: number): number {
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[index];
}

// ============================================================================
// PERFORMANCE METRICS COLLECTION
// ============================================================================

/**
 * Creates a performance metrics collector
 */
export class PerformanceMetricsCollector {
  private metrics: PerformanceMetrics[] = [];

  record(operation: string, duration: number, metadata?: Record<string, any>): void {
    this.metrics.push({
      timestamp: new Date(),
      operation,
      duration,
      memoryUsage: getMemoryUsage(),
      metadata,
    });
  }

  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await fn();
      this.record(operation, Date.now() - startTime, metadata);
      return result;
    } catch (error) {
      this.record(operation, Date.now() - startTime, {
        ...metadata,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  getMetricsByOperation(operation: string): PerformanceMetrics[] {
    return this.metrics.filter((m) => m.operation === operation);
  }

  getAverageForOperation(operation: string): number {
    const operationMetrics = this.getMetricsByOperation(operation);
    if (operationMetrics.length === 0) return 0;

    return (
      operationMetrics.reduce((sum, m) => sum + m.duration, 0) / operationMetrics.length
    );
  }

  clear(): void {
    this.metrics = [];
  }
}

/**
 * Checks performance budgets
 */
export function checkPerformanceBudgets(
  budgets: PerformanceBudget[],
  metrics: PerformanceMetrics[],
): PerformanceBudget[] {
  return budgets.map((budget) => {
    const relevantMetrics = metrics.filter((m) => m.operation === budget.metric);

    if (relevantMetrics.length === 0) {
      return { ...budget, passed: true };
    }

    const actual = relevantMetrics.reduce((sum, m) => sum + m.duration, 0) / relevantMetrics.length;

    return {
      ...budget,
      actual,
      passed: actual <= budget.threshold,
    };
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Chunks array into smaller batches
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// NESTJS TESTING UTILITIES
// ============================================================================

/**
 * Creates a mock cache for testing
 */
export function createMockCache<T = any>(): MemoryCache<T> {
  return new MemoryCache<T>({
    ttl: 300,
    maxSize: 100,
    strategy: 'LRU',
    keyPrefix: 'test',
  });
}

/**
 * Creates mock query profiler for testing
 */
export function createMockQueryProfiler() {
  const profiles: QueryPerformanceProfile[] = [];

  return {
    profile: jest.fn(async <T>(query: () => Promise<T>, queryString?: string) => {
      const profile: QueryPerformanceProfile = {
        query: queryString || 'test-query',
        executionTime: Math.random() * 100,
        timestamp: new Date(),
        slow: false,
      };
      profiles.push(profile);
      return await query();
    }),
    getProfiles: jest.fn(() => profiles),
    clear: jest.fn(() => {
      profiles.length = 0;
    }),
  };
}

/**
 * Generates test performance metrics
 */
export function generateTestPerformanceMetrics(count: number): PerformanceMetrics[] {
  const operations = ['query', 'save', 'delete', 'update', 'read'];

  return Array.from({ length: count }, () => ({
    timestamp: new Date(),
    operation: operations[Math.floor(Math.random() * operations.length)],
    duration: Math.random() * 1000,
    memoryUsage: {
      heapUsed: Math.random() * 100000000,
      heapTotal: Math.random() * 200000000,
      external: Math.random() * 10000000,
      rss: Math.random() * 300000000,
    },
  }));
}

/**
 * Creates a test helper for performance testing
 */
export class PerformanceTestHelper {
  private collector = new PerformanceMetricsCollector();
  private memoryMonitor = new MemoryMonitor();

  async measureOperation<T>(
    name: string,
    operation: () => Promise<T>,
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await this.collector.measure(name, operation);
    const duration = Date.now() - startTime;

    return { result, duration };
  }

  startMemoryMonitoring(): void {
    this.memoryMonitor.start();
  }

  stopMemoryMonitoring(): void {
    this.memoryMonitor.stop();
  }

  getMemoryStats() {
    return this.memoryMonitor.getStats();
  }

  getMetrics() {
    return this.collector.getMetrics();
  }

  assertPerformance(operation: string, maxDuration: number): void {
    const avg = this.collector.getAverageForOperation(operation);
    expect(avg).toBeLessThanOrEqual(maxDuration);
  }

  assertMemoryUsage(maxHeapMB: number): void {
    const stats = this.memoryMonitor.getStats();
    const heapMB = stats.peak.heapUsed / 1024 / 1024;
    expect(heapMB).toBeLessThanOrEqual(maxHeapMB);
  }

  clear(): void {
    this.collector.clear();
    this.memoryMonitor.clear();
  }
}

/**
 * Mock connection pool for testing
 */
export function createMockConnectionPool(config: Partial<ConnectionPoolConfig> = {}) {
  const pool = new ConnectionPoolManager({
    min: config.min || 2,
    max: config.max || 10,
    acquireTimeoutMillis: config.acquireTimeoutMillis || 5000,
  });

  return {
    acquire: jest.fn(() => pool.acquire()),
    release: jest.fn((id: string) => pool.release(id)),
    getStats: jest.fn(() => pool.getStats()),
    drain: jest.fn(() => pool.drain()),
  };
}

/**
 * Asserts pagination result is correct
 */
export function assertPaginationResult<T>(
  result: PaginatedResult<T>,
  expectedTotal: number,
  expectedPage: number,
  expectedLimit: number,
): void {
  expect(result.total).toBe(expectedTotal);
  expect(result.page).toBe(expectedPage);
  expect(result.limit).toBe(expectedLimit);
  expect(result.totalPages).toBe(Math.ceil(expectedTotal / expectedLimit));
  expect(result.items.length).toBeLessThanOrEqual(expectedLimit);
}

/**
 * Export all testing utilities
 */
export const PerformanceTestingUtils = {
  createMockCache,
  createMockQueryProfiler,
  generateTestPerformanceMetrics,
  PerformanceTestHelper,
  createMockConnectionPool,
  assertPaginationResult,
};
