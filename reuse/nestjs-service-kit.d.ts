/**
 * LOC: NEST-SVC-001
 * File: /reuse/nestjs-service-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/typeorm
 *   - typeorm
 *
 * DOWNSTREAM (imported by):
 *   - Backend service modules
 *   - Repository implementations
 *   - CRUD service generators
 */
/**
 * File: /reuse/nestjs-service-kit.ts
 * Locator: WC-UTL-NESTSVC-001
 * Purpose: NestJS Service Patterns - Comprehensive service layer utilities and generators
 *
 * Upstream: @nestjs/common, @nestjs/typeorm, typeorm
 * Downstream: ../backend/*, service modules, repository patterns
 * Dependencies: NestJS 10.x, TypeORM 0.3.x, TypeScript 5.x
 * Exports: 45 utility functions for service patterns, CRUD operations, repositories, data access
 *
 * LLM Context: Comprehensive NestJS service utilities for White Cross healthcare system.
 * Provides service generators, business logic helpers, CRUD service patterns, repository
 * implementations, data access layers, service composition, async providers, and factory
 * providers. Essential for scalable, maintainable healthcare application architecture.
 */
interface ServiceConfig {
    enableAudit?: boolean;
    enableCache?: boolean;
    cacheTTL?: number;
    enableSoftDelete?: boolean;
    enableValidation?: boolean;
}
interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface FindOptions {
    where?: Record<string, any>;
    relations?: string[];
    select?: string[];
    order?: Record<string, 'ASC' | 'DESC'>;
}
interface CrudServiceMethods<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string | number): Promise<T | null>;
    findAll(options?: FindOptions): Promise<T[]>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
    softDelete?(id: string | number): Promise<boolean>;
    restore?(id: string | number): Promise<T>;
}
interface FactoryProviderConfig {
    provide: string | symbol;
    useFactory: (...args: any[]) => any | Promise<any>;
    inject?: any[];
    scope?: 'DEFAULT' | 'REQUEST' | 'TRANSIENT';
}
interface AsyncProviderConfig {
    provide: string | symbol;
    useFactory: (...args: any[]) => Promise<any>;
    inject?: any[];
}
interface BusinessRule<T> {
    name: string;
    validate: (data: T) => boolean | Promise<boolean>;
    errorMessage: string;
}
/**
 * Creates a base CRUD service with standard operations.
 *
 * @param {any} repository - TypeORM repository instance
 * @param {ServiceConfig} [config] - Service configuration options
 * @returns {CrudServiceMethods<T>} CRUD service methods
 *
 * @example
 * ```typescript
 * const studentService = createCrudService(studentRepository, {
 *   enableAudit: true,
 *   enableCache: true,
 *   cacheTTL: 300
 * });
 * const student = await studentService.findById('123');
 * ```
 */
export declare const createCrudService: <T extends Record<string, any>>(repository: any, config?: ServiceConfig) => CrudServiceMethods<T>;
/**
 * Creates a paginated CRUD service with pagination support.
 *
 * @param {any} repository - TypeORM repository instance
 * @returns {Object} Service with paginated methods
 *
 * @example
 * ```typescript
 * const patientService = createPaginatedCrudService(patientRepository);
 * const result = await patientService.findPaginated({ page: 1, limit: 20 });
 * console.log(result.totalPages, result.data);
 * ```
 */
export declare const createPaginatedCrudService: <T>(repository: any) => {
    findPaginated(options: PaginationOptions): Promise<PaginatedResult<T>>;
    findAll(): Promise<T[]>;
    findById(id: string | number): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
};
/**
 * Creates a service with search and filter capabilities.
 *
 * @param {any} repository - TypeORM repository instance
 * @returns {Object} Service with search methods
 *
 * @example
 * ```typescript
 * const searchService = createSearchableService(studentRepository);
 * const results = await searchService.search({
 *   query: 'John',
 *   fields: ['firstName', 'lastName', 'email']
 * });
 * ```
 */
export declare const createSearchableService: <T>(repository: any) => {
    search(options: {
        query: string;
        fields: string[];
        limit?: number;
    }): Promise<T[]>;
    filter(filters: Record<string, any>): Promise<T[]>;
    advancedSearch(criteria: {
        filters?: Record<string, any>;
        search?: {
            query: string;
            fields: string[];
        };
        pagination?: PaginationOptions;
    }): Promise<PaginatedResult<T> | T[]>;
};
/**
 * Creates a repository wrapper with caching support.
 *
 * @param {any} repository - TypeORM repository instance
 * @param {any} cacheManager - NestJS cache manager
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Object} Cached repository methods
 *
 * @example
 * ```typescript
 * const cachedRepo = createCachedRepository(
 *   patientRepository,
 *   cacheManager,
 *   600
 * );
 * const patient = await cachedRepo.findById('123'); // Cached
 * ```
 */
export declare const createCachedRepository: <T>(repository: any, cacheManager: any, ttl?: number) => {
    findById(id: string | number): Promise<T | null>;
    findAll(): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
    clearCache(): Promise<void>;
};
/**
 * Creates a repository with transaction support.
 *
 * @param {any} repository - TypeORM repository instance
 * @param {any} dataSource - TypeORM data source
 * @returns {Object} Repository with transaction methods
 *
 * @example
 * ```typescript
 * const transactionalRepo = createTransactionalRepository(
 *   studentRepository,
 *   dataSource
 * );
 * await transactionalRepo.executeInTransaction(async (manager) => {
 *   await manager.save(student);
 *   await manager.save(enrollment);
 * });
 * ```
 */
export declare const createTransactionalRepository: <T>(repository: any, dataSource: any) => {
    executeInTransaction(callback: (manager: any) => Promise<any>): Promise<any>;
    createWithTransaction(data: Partial<T>): Promise<T>;
    updateWithTransaction(id: string | number, data: Partial<T>): Promise<T>;
    deleteWithTransaction(id: string | number): Promise<boolean>;
};
/**
 * Creates a repository with audit logging.
 *
 * @param {any} repository - TypeORM repository instance
 * @param {any} auditLogger - Audit logging service
 * @param {string} [userId] - Current user ID for audit trail
 * @returns {Object} Repository with audit logging
 *
 * @example
 * ```typescript
 * const auditedRepo = createAuditedRepository(
 *   medicalRecordRepository,
 *   auditService,
 *   currentUserId
 * );
 * await auditedRepo.create(recordData); // Automatically logged
 * ```
 */
export declare const createAuditedRepository: <T extends Record<string, any>>(repository: any, auditLogger: any, userId?: string) => {
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
    findById(id: string | number): Promise<T | null>;
};
/**
 * Creates a business rule validator for entity operations.
 *
 * @param {BusinessRule<T>[]} rules - Array of business rules
 * @returns {Function} Validation function
 *
 * @example
 * ```typescript
 * const validateStudent = createBusinessRuleValidator([
 *   {
 *     name: 'age_requirement',
 *     validate: (student) => student.age >= 5,
 *     errorMessage: 'Student must be at least 5 years old'
 *   }
 * ]);
 * await validateStudent(studentData);
 * ```
 */
export declare const createBusinessRuleValidator: <T>(rules: BusinessRule<T>[]) => (data: T) => Promise<void>;
/**
 * Creates a service method with automatic retry logic.
 *
 * @param {Function} method - Service method to wrap
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @param {number} [delay=1000] - Delay between retries in ms
 * @returns {Function} Wrapped method with retry logic
 *
 * @example
 * ```typescript
 * const resilientFetch = createRetryableMethod(
 *   async () => externalApi.fetch(),
 *   3,
 *   2000
 * );
 * const data = await resilientFetch();
 * ```
 */
export declare const createRetryableMethod: <T>(method: (...args: any[]) => Promise<T>, maxRetries?: number, delay?: number) => (...args: any[]) => Promise<T>;
/**
 * Creates a service method with caching decorator.
 *
 * @param {Function} method - Service method to cache
 * @param {any} cacheManager - NestJS cache manager
 * @param {string} keyPrefix - Cache key prefix
 * @param {number} [ttl=300] - Cache TTL in seconds
 * @returns {Function} Cached method
 *
 * @example
 * ```typescript
 * const getCachedPatient = createCachedMethod(
 *   patientService.findById,
 *   cacheManager,
 *   'patient',
 *   600
 * );
 * const patient = await getCachedPatient('123');
 * ```
 */
export declare const createCachedMethod: <T>(method: (...args: any[]) => Promise<T>, cacheManager: any, keyPrefix: string, ttl?: number) => (...args: any[]) => Promise<T>;
/**
 * Creates a service method with validation decorator.
 *
 * @param {Function} method - Service method to validate
 * @param {Function} validator - Validation function
 * @returns {Function} Validated method
 *
 * @example
 * ```typescript
 * const createValidatedStudent = createValidatedMethod(
 *   studentService.create,
 *   (data) => {
 *     if (!data.email) throw new Error('Email required');
 *   }
 * );
 * ```
 */
export declare const createValidatedMethod: <T>(method: (...args: any[]) => Promise<T>, validator: (...args: any[]) => void | Promise<void>) => (...args: any[]) => Promise<T>;
/**
 * Creates a service with data transformation pipeline.
 *
 * @param {Function} method - Service method
 * @param {Function[]} transformers - Array of transformation functions
 * @returns {Function} Method with transformation pipeline
 *
 * @example
 * ```typescript
 * const getTransformedData = createDataTransformer(
 *   service.getData,
 *   [
 *     (data) => ({ ...data, processed: true }),
 *     (data) => ({ ...data, timestamp: new Date() })
 *   ]
 * );
 * ```
 */
export declare const createDataTransformer: <T, R>(method: (...args: any[]) => Promise<T>, transformers: Array<(data: any) => any>) => (...args: any[]) => Promise<R>;
/**
 * Composes multiple services into a single orchestration service.
 *
 * @param {Object} services - Map of service names to instances
 * @returns {Object} Composed service with all methods
 *
 * @example
 * ```typescript
 * const orchestrator = composeServices({
 *   student: studentService,
 *   enrollment: enrollmentService,
 *   notification: notificationService
 * });
 * ```
 */
export declare const composeServices: <T extends Record<string, any>>(services: T) => T;
/**
 * Creates a service aggregator that combines results from multiple services.
 *
 * @param {Function[]} methods - Array of service methods
 * @param {Function} aggregator - Function to combine results
 * @returns {Function} Aggregated method
 *
 * @example
 * ```typescript
 * const getAllData = createAggregatorService(
 *   [studentsService.getAll, teachersService.getAll],
 *   (results) => ({ students: results[0], teachers: results[1] })
 * );
 * ```
 */
export declare const createAggregatorService: <T>(methods: Array<(...args: any[]) => Promise<any>>, aggregator: (results: any[]) => T) => (...args: any[]) => Promise<T>;
/**
 * Creates a service proxy with middleware support.
 *
 * @param {Object} service - Service instance
 * @param {Function[]} middleware - Array of middleware functions
 * @returns {Object} Proxied service
 *
 * @example
 * ```typescript
 * const proxiedService = createServiceProxy(studentService, [
 *   async (method, args, next) => {
 *     console.log('Before:', method);
 *     const result = await next();
 *     console.log('After:', method);
 *     return result;
 *   }
 * ]);
 * ```
 */
export declare const createServiceProxy: <T extends Record<string, any>>(service: T, middleware: Array<(method: string, args: any[], next: () => Promise<any>) => Promise<any>>) => T;
/**
 * Creates an async factory provider for external service connections.
 *
 * @param {AsyncProviderConfig} config - Provider configuration
 * @returns {Object} NestJS provider configuration
 *
 * @example
 * ```typescript
 * const dbProvider = createAsyncProvider({
 *   provide: 'DATABASE_CONNECTION',
 *   useFactory: async (configService) => {
 *     const conn = await createConnection(configService.get('db'));
 *     return conn;
 *   },
 *   inject: [ConfigService]
 * });
 * ```
 */
export declare const createAsyncProvider: (config: AsyncProviderConfig) => {
    provide: string | symbol;
    useFactory: (...args: any[]) => Promise<any>;
    inject: any[];
};
/**
 * Creates a conditional async provider based on environment.
 *
 * @param {string} token - Injection token
 * @param {Function} factoryFn - Factory function
 * @param {Function} condition - Condition function
 * @returns {Object} Conditional provider
 *
 * @example
 * ```typescript
 * const cacheProvider = createConditionalAsyncProvider(
 *   'CACHE_SERVICE',
 *   async (config) => new RedisCache(config),
 *   (config) => config.get('env') === 'production'
 * );
 * ```
 */
export declare const createConditionalAsyncProvider: (token: string | symbol, factoryFn: (...args: any[]) => Promise<any>, condition: (...args: any[]) => boolean) => {
    provide: string | symbol;
    useFactory: (...args: any[]) => Promise<any>;
};
/**
 * Creates an async provider with initialization validation.
 *
 * @param {string} token - Injection token
 * @param {Function} factoryFn - Factory function
 * @param {Function} validator - Validation function
 * @returns {Object} Validated async provider
 *
 * @example
 * ```typescript
 * const apiProvider = createValidatedAsyncProvider(
 *   'API_CLIENT',
 *   async () => new ApiClient(),
 *   async (client) => await client.healthCheck()
 * );
 * ```
 */
export declare const createValidatedAsyncProvider: (token: string | symbol, factoryFn: (...args: any[]) => Promise<any>, validator: (instance: any) => Promise<boolean>) => {
    provide: string | symbol;
    useFactory: (...args: any[]) => Promise<any>;
};
/**
 * Creates a factory provider with dependency injection.
 *
 * @param {FactoryProviderConfig} config - Factory configuration
 * @returns {Object} NestJS factory provider
 *
 * @example
 * ```typescript
 * const loggerFactory = createFactoryProvider({
 *   provide: 'LOGGER',
 *   useFactory: (config) => new Logger(config.get('logLevel')),
 *   inject: [ConfigService]
 * });
 * ```
 */
export declare const createFactoryProvider: (config: FactoryProviderConfig) => {
    provide: string | symbol;
    useFactory: (...args: any[]) => any | Promise<any>;
    inject: any[];
    scope: "DEFAULT" | "REQUEST" | "TRANSIENT" | undefined;
};
/**
 * Creates a multi-instance factory provider.
 *
 * @param {string} token - Injection token
 * @param {Function} factoryFn - Factory function
 * @returns {Object} Multi-instance provider
 *
 * @example
 * ```typescript
 * const processorFactory = createMultiInstanceFactory(
 *   'TASK_PROCESSOR',
 *   () => new TaskProcessor()
 * );
 * ```
 */
export declare const createMultiInstanceFactory: (token: string | symbol, factoryFn: () => any) => {
    provide: string | symbol;
    useFactory: () => any;
    scope: "TRANSIENT";
};
/**
 * Creates a singleton factory provider with lazy initialization.
 *
 * @param {string} token - Injection token
 * @param {Function} factoryFn - Factory function
 * @returns {Object} Lazy singleton provider
 *
 * @example
 * ```typescript
 * const heavyService = createLazySingletonFactory(
 *   'HEAVY_SERVICE',
 *   async () => await initializeHeavyService()
 * );
 * ```
 */
export declare const createLazySingletonFactory: (token: string | symbol, factoryFn: () => any | Promise<any>) => {
    provide: string | symbol;
    useFactory: () => Promise<any>;
};
/**
 * Creates a factory provider with configuration override.
 *
 * @param {string} token - Injection token
 * @param {Function} factoryFn - Factory function
 * @param {Record<string, any>} [overrides] - Configuration overrides
 * @returns {Object} Configurable factory provider
 *
 * @example
 * ```typescript
 * const dbFactory = createConfigurableFactory(
 *   'DATABASE',
 *   (config) => new Database(config),
 *   { poolSize: 20, ssl: true }
 * );
 * ```
 */
export declare const createConfigurableFactory: (token: string | symbol, factoryFn: (config: any) => any, overrides?: Record<string, any>) => {
    provide: string | symbol;
    useFactory: (configService: any) => any;
    inject: string[];
};
/**
 * Creates a data access layer with multiple data sources.
 *
 * @param {Record<string, any>} dataSources - Map of data source names to instances
 * @returns {Object} Unified data access layer
 *
 * @example
 * ```typescript
 * const dal = createDataAccessLayer({
 *   postgres: postgresDataSource,
 *   mongodb: mongoDataSource,
 *   redis: redisClient
 * });
 * ```
 */
export declare const createDataAccessLayer: (dataSources: Record<string, any>) => {
    getDataSource(name: string): any;
    executeQuery(dataSourceName: string, query: string, params?: any[]): Promise<any>;
    transaction(dataSourceName: string, callback: (manager: any) => Promise<any>): Promise<any>;
    healthCheck(): Promise<Record<string, boolean>>;
};
/**
 * Creates a repository manager for multiple entities.
 *
 * @param {any} dataSource - TypeORM data source
 * @param {any[]} entities - Array of entity classes
 * @returns {Object} Repository manager
 *
 * @example
 * ```typescript
 * const repoManager = createRepositoryManager(dataSource, [
 *   Student,
 *   Teacher,
 *   Course
 * ]);
 * const studentRepo = repoManager.getRepository(Student);
 * ```
 */
export declare const createRepositoryManager: (dataSource: any, entities: any[]) => {
    getRepository<T>(entity: any): any;
    clearAll(): Promise<void>;
    synchronize(): Promise<void>;
    getAllRepositories(): Map<any, any>;
};
/**
 * Creates a query builder factory for complex queries.
 *
 * @param {any} repository - TypeORM repository
 * @returns {Object} Query builder factory
 *
 * @example
 * ```typescript
 * const queryFactory = createQueryBuilderFactory(studentRepository);
 * const students = await queryFactory
 *   .where({ grade: 10 })
 *   .orderBy('lastName', 'ASC')
 *   .execute();
 * ```
 */
export declare const createQueryBuilderFactory: (repository: any) => {
    builder: any;
    where(conditions: Record<string, any>): /*elided*/ any;
    andWhere(condition: string, params: Record<string, any>): /*elided*/ any;
    orWhere(condition: string, params: Record<string, any>): /*elided*/ any;
    orderBy(field: string, order?: "ASC" | "DESC"): /*elided*/ any;
    limit(count: number): /*elided*/ any;
    offset(count: number): /*elided*/ any;
    execute(): Promise<any[]>;
    getOne(): Promise<any | null>;
    count(): Promise<number>;
    reset(): /*elided*/ any;
};
/**
 * Creates a service with health check capabilities.
 *
 * @param {Object} service - Service instance
 * @param {Function} healthCheckFn - Health check function
 * @returns {Object} Service with health check
 *
 * @example
 * ```typescript
 * const healthyService = createHealthCheckableService(
 *   databaseService,
 *   async () => await db.ping()
 * );
 * const isHealthy = await healthyService.healthCheck();
 * ```
 */
export declare const createHealthCheckableService: <T extends Record<string, any>>(service: T, healthCheckFn: () => Promise<boolean>) => T & {
    healthCheck: () => Promise<boolean>;
};
/**
 * Creates a service with graceful shutdown support.
 *
 * @param {Object} service - Service instance
 * @param {Function} shutdownFn - Shutdown cleanup function
 * @returns {Object} Service with shutdown method
 *
 * @example
 * ```typescript
 * const gracefulService = createGracefulShutdownService(
 *   cacheService,
 *   async () => await cache.disconnect()
 * );
 * await gracefulService.shutdown();
 * ```
 */
export declare const createGracefulShutdownService: <T extends Record<string, any>>(service: T, shutdownFn: () => Promise<void>) => T & {
    shutdown: () => Promise<void>;
};
/**
 * Creates a service with metrics collection.
 *
 * @param {Object} service - Service instance
 * @param {any} metricsCollector - Metrics collector instance
 * @returns {Object} Service with metrics
 *
 * @example
 * ```typescript
 * const monitoredService = createMetricsService(
 *   apiService,
 *   prometheusMetrics
 * );
 * // All method calls automatically tracked
 * ```
 */
export declare const createMetricsService: <T extends Record<string, any>>(service: T, metricsCollector: any) => T;
/**
 * Creates a service with rate limiting.
 *
 * @param {Object} service - Service instance
 * @param {number} maxCalls - Maximum calls per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} Rate-limited service
 *
 * @example
 * ```typescript
 * const limitedService = createRateLimitedService(
 *   externalApiService,
 *   100,
 *   60000
 * );
 * // Maximum 100 calls per minute
 * ```
 */
export declare const createRateLimitedService: <T extends Record<string, any>>(service: T, maxCalls: number, windowMs: number) => T;
/**
 * Creates a service with automatic error recovery.
 *
 * @param {Object} service - Service instance
 * @param {Function} recoveryFn - Recovery function
 * @returns {Object} Self-healing service
 *
 * @example
 * ```typescript
 * const resilientService = createSelfHealingService(
 *   dbService,
 *   async (error) => await dbService.reconnect()
 * );
 * ```
 */
export declare const createSelfHealingService: <T extends Record<string, any>>(service: T, recoveryFn: (error: Error) => Promise<void>) => T;
export {};
//# sourceMappingURL=nestjs-service-kit.d.ts.map