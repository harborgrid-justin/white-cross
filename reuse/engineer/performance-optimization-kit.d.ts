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
    ttl: number;
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
    threshold: number;
    level?: number;
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
    duration: number;
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
    errors: Array<{
        message: string;
        count: number;
    }>;
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
/**
 * Profiles query execution time
 */
export declare function profileQuery<T>(query: () => Promise<T>, queryString?: string): Promise<{
    result: T;
    profile: QueryPerformanceProfile;
}>;
/**
 * Generates optimization suggestions for slow queries
 */
export declare function generateOptimizationSuggestions(query?: string): string[];
/**
 * Analyzes query patterns to identify bottlenecks
 */
export declare function analyzeQueryPatterns(profiles: QueryPerformanceProfile[]): {
    slowQueries: QueryPerformanceProfile[];
    averageExecutionTime: number;
    totalQueries: number;
    queryDistribution: Record<string, number>;
};
/**
 * Creates a query profiler middleware
 */
export declare function createQueryProfiler(slowQueryThreshold?: number): {
    profile: <T>(query: () => Promise<T>, queryString?: string) => Promise<T>;
    getProfiles: () => QueryPerformanceProfile[];
    getSlowQueries: () => QueryPerformanceProfile[];
    clear: () => void;
};
/**
 * Monitors query execution times and alerts on anomalies
 */
export declare function monitorQueryPerformance(profile: QueryPerformanceProfile, baseline: number, threshold?: number): {
    isAnomaly: boolean;
    percentageIncrease: number;
};
/**
 * In-memory cache implementation
 */
export declare class MemoryCache<T = any> {
    private cache;
    private readonly config;
    constructor(config: CacheConfig);
    set(key: string, value: T, ttl?: number): void;
    get(key: string): T | null;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
    size(): number;
    keys(): string[];
    private getFullKey;
    private estimateSize;
    private enforceMaxSize;
    private startCleanupInterval;
}
/**
 * Cache decorator factory for methods
 */
export declare function Cacheable(config?: Partial<CacheConfig>): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
/**
 * Cache-aside pattern implementation
 */
export declare function cacheAside<T>(key: string, fetchFunction: () => Promise<T>, cache: MemoryCache<T>, ttl?: number): Promise<T>;
/**
 * Cache warming utility
 */
export declare function warmCache<T>(keys: string[], fetchFunction: (key: string) => Promise<T>, cache: MemoryCache<T>, concurrency?: number): Promise<void>;
/**
 * Invalidates cache entries based on pattern
 */
export declare function invalidateCachePattern(pattern: RegExp, cache: MemoryCache): number;
/**
 * Creates a connection pool manager
 */
export declare class ConnectionPoolManager {
    private config;
    private connections;
    private waitQueue;
    private stats;
    constructor(config: ConnectionPoolConfig);
    private initializePool;
    acquire(): Promise<string>;
    private waitForConnection;
    release(connectionId: string): void;
    getStats(): ConnectionPoolStats;
    drain(): Promise<void>;
}
/**
 * Monitors connection pool health
 */
export declare function monitorConnectionPool(stats: ConnectionPoolStats, config: ConnectionPoolConfig): {
    healthy: boolean;
    issues: string[];
};
/**
 * Determines if content should be compressed
 */
export declare function shouldCompress(contentLength: number, contentType: string, config: CompressionConfig): boolean;
/**
 * Calculates compression ratio
 */
export declare function calculateCompressionRatio(originalSize: number, compressedSize: number): {
    ratio: number;
    percentageReduction: number;
};
/**
 * Creates compression middleware configuration
 */
export declare function createCompressionMiddleware(config?: Partial<CompressionConfig>): {
    filter: (contentType: string, contentLength: number) => boolean;
    level: number | undefined;
};
/**
 * Implements lazy loading for large datasets
 */
export declare function lazyLoad<T>(fetchFunction: (offset: number, limit: number) => Promise<T[]>, config: LazyLoadConfig): AsyncGenerator<T[]>;
/**
 * Preloads relations for entities
 */
export declare function preloadRelations<T>(entities: T[], relations: string[], loadFunction: (entity: T, relation: string) => Promise<any>): Promise<T[]>;
/**
 * Lazy loads nested relations
 */
export declare class LazyRelationLoader<T> {
    private entity;
    private loadFunction;
    private loaded;
    constructor(entity: T, loadFunction: (relation: string) => Promise<any>);
    load(relation: string): Promise<any>;
    isLoaded(relation: string): boolean;
    clearCache(): void;
}
/**
 * Creates optimized pagination
 */
export declare function createPagination<T>(items: T[], config: PaginationConfig): PaginatedResult<T>;
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
export declare function createCursorPagination<T>(items: T[], config: CursorPaginationConfig): CursorPaginatedResult<T>;
/**
 * Builds optimized database pagination query
 */
export declare function buildPaginationQuery(config: PaginationConfig): {
    skip: number;
    take: number;
    order?: Record<string, 'ASC' | 'DESC'>;
};
/**
 * Suggests indexes for query optimization
 */
export declare function suggestIndexes(query: string, tableName: string): IndexSuggestion[];
/**
 * Optimizes SELECT query
 */
export declare function optimizeSelectQuery(query: string): QueryOptimization;
/**
 * Analyzes and optimizes N+1 query problem
 */
export declare function detectNPlusOneQueries(queries: QueryPerformanceProfile[]): {
    detected: boolean;
    patterns: Array<{
        query: string;
        count: number;
    }>;
    suggestion: string;
};
/**
 * Monitors memory usage
 */
export declare function getMemoryUsage(): MemoryUsage;
/**
 * Formats memory size for display
 */
export declare function formatMemorySize(bytes: number): string;
/**
 * Creates memory usage monitor
 */
export declare class MemoryMonitor {
    private measurements;
    private intervalId?;
    start(intervalMs?: number): void;
    stop(): void;
    getStats(): {
        average: MemoryUsage;
        peak: MemoryUsage;
        current: MemoryUsage;
    };
    clear(): void;
    private avg;
}
/**
 * Detects memory leaks
 */
export declare function detectMemoryLeak(measurements: MemoryUsage[], threshold?: number): {
    detected: boolean;
    trend: number;
};
/**
 * Performs a simple load test
 */
export declare function performLoadTest(config: LoadTestConfig, requestFunction: () => Promise<any>): Promise<LoadTestResult>;
/**
 * Analyzes load test results
 */
export declare function analyzeLoadTestResults(results: Array<{
    success: boolean;
    duration: number;
    error?: string;
}>): LoadTestResult;
/**
 * Creates a performance metrics collector
 */
export declare class PerformanceMetricsCollector {
    private metrics;
    record(operation: string, duration: number, metadata?: Record<string, any>): void;
    measure<T>(operation: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T>;
    getMetrics(): PerformanceMetrics[];
    getMetricsByOperation(operation: string): PerformanceMetrics[];
    getAverageForOperation(operation: string): number;
    clear(): void;
}
/**
 * Checks performance budgets
 */
export declare function checkPerformanceBudgets(budgets: PerformanceBudget[], metrics: PerformanceMetrics[]): PerformanceBudget[];
/**
 * Debounces a function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttles a function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Creates a mock cache for testing
 */
export declare function createMockCache<T = any>(): MemoryCache<T>;
/**
 * Creates mock query profiler for testing
 */
export declare function createMockQueryProfiler(): {
    profile: any;
    getProfiles: any;
    clear: any;
};
/**
 * Generates test performance metrics
 */
export declare function generateTestPerformanceMetrics(count: number): PerformanceMetrics[];
/**
 * Creates a test helper for performance testing
 */
export declare class PerformanceTestHelper {
    private collector;
    private memoryMonitor;
    measureOperation<T>(name: string, operation: () => Promise<T>): Promise<{
        result: T;
        duration: number;
    }>;
    startMemoryMonitoring(): void;
    stopMemoryMonitoring(): void;
    getMemoryStats(): {
        average: MemoryUsage;
        peak: MemoryUsage;
        current: MemoryUsage;
    };
    getMetrics(): PerformanceMetrics[];
    assertPerformance(operation: string, maxDuration: number): void;
    assertMemoryUsage(maxHeapMB: number): void;
    clear(): void;
}
/**
 * Mock connection pool for testing
 */
export declare function createMockConnectionPool(config?: Partial<ConnectionPoolConfig>): {
    acquire: any;
    release: any;
    getStats: any;
    drain: any;
};
/**
 * Asserts pagination result is correct
 */
export declare function assertPaginationResult<T>(result: PaginatedResult<T>, expectedTotal: number, expectedPage: number, expectedLimit: number): void;
/**
 * Export all testing utilities
 */
export declare const PerformanceTestingUtils: {
    createMockCache: typeof createMockCache;
    createMockQueryProfiler: typeof createMockQueryProfiler;
    generateTestPerformanceMetrics: typeof generateTestPerformanceMetrics;
    PerformanceTestHelper: typeof PerformanceTestHelper;
    createMockConnectionPool: typeof createMockConnectionPool;
    assertPaginationResult: typeof assertPaginationResult;
};
//# sourceMappingURL=performance-optimization-kit.d.ts.map