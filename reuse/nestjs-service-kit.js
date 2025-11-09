"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelfHealingService = exports.createRateLimitedService = exports.createMetricsService = exports.createGracefulShutdownService = exports.createHealthCheckableService = exports.createQueryBuilderFactory = exports.createRepositoryManager = exports.createDataAccessLayer = exports.createConfigurableFactory = exports.createLazySingletonFactory = exports.createMultiInstanceFactory = exports.createFactoryProvider = exports.createValidatedAsyncProvider = exports.createConditionalAsyncProvider = exports.createAsyncProvider = exports.createServiceProxy = exports.createAggregatorService = exports.composeServices = exports.createDataTransformer = exports.createValidatedMethod = exports.createCachedMethod = exports.createRetryableMethod = exports.createBusinessRuleValidator = exports.createAuditedRepository = exports.createTransactionalRepository = exports.createCachedRepository = exports.createSearchableService = exports.createPaginatedCrudService = exports.createCrudService = void 0;
// ============================================================================
// CRUD SERVICE GENERATORS
// ============================================================================
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
const createCrudService = (repository, config = {}) => {
    return {
        async create(data) {
            const entity = repository.create(data);
            const saved = await repository.save(entity);
            return saved;
        },
        async findById(id) {
            const entity = await repository.findOne({ where: { id } });
            return entity || null;
        },
        async findAll(options) {
            const entities = await repository.find(options || {});
            return entities;
        },
        async update(id, data) {
            await repository.update(id, data);
            const updated = await repository.findOne({ where: { id } });
            return updated;
        },
        async delete(id) {
            if (config.enableSoftDelete) {
                await repository.softDelete(id);
            }
            else {
                await repository.delete(id);
            }
            return true;
        },
        ...(config.enableSoftDelete && {
            async softDelete(id) {
                await repository.softDelete(id);
                return true;
            },
            async restore(id) {
                await repository.restore(id);
                return await repository.findOne({ where: { id } });
            },
        }),
    };
};
exports.createCrudService = createCrudService;
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
const createPaginatedCrudService = (repository) => {
    return {
        async findPaginated(options) {
            const { page, limit, sortBy, sortOrder } = options;
            const skip = (page - 1) * limit;
            const queryBuilder = repository.createQueryBuilder('entity');
            if (sortBy) {
                queryBuilder.orderBy(`entity.${sortBy}`, sortOrder || 'ASC');
            }
            const [data, total] = await queryBuilder
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            return {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        },
        async findAll() {
            return repository.find();
        },
        async findById(id) {
            return repository.findOne({ where: { id } });
        },
        async create(data) {
            const entity = repository.create(data);
            return repository.save(entity);
        },
        async update(id, data) {
            await repository.update(id, data);
            return repository.findOne({ where: { id } });
        },
        async delete(id) {
            await repository.delete(id);
            return true;
        },
    };
};
exports.createPaginatedCrudService = createPaginatedCrudService;
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
const createSearchableService = (repository) => {
    return {
        async search(options) {
            const { query, fields, limit = 50 } = options;
            const queryBuilder = repository.createQueryBuilder('entity');
            const conditions = fields.map((field) => `entity.${field} LIKE :query`);
            queryBuilder.where(conditions.join(' OR '), { query: `%${query}%` });
            if (limit) {
                queryBuilder.take(limit);
            }
            return queryBuilder.getMany();
        },
        async filter(filters) {
            return repository.find({ where: filters });
        },
        async advancedSearch(criteria) {
            const queryBuilder = repository.createQueryBuilder('entity');
            if (criteria.filters) {
                Object.entries(criteria.filters).forEach(([key, value]) => {
                    queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
                });
            }
            if (criteria.search) {
                const { query, fields } = criteria.search;
                const conditions = fields.map((field) => `entity.${field} LIKE :query`);
                queryBuilder.andWhere(`(${conditions.join(' OR ')})`, { query: `%${query}%` });
            }
            if (criteria.pagination) {
                const { page, limit, sortBy, sortOrder } = criteria.pagination;
                const skip = (page - 1) * limit;
                if (sortBy) {
                    queryBuilder.orderBy(`entity.${sortBy}`, sortOrder || 'ASC');
                }
                const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();
                return {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
            }
            return queryBuilder.getMany();
        },
    };
};
exports.createSearchableService = createSearchableService;
// ============================================================================
// REPOSITORY PATTERNS
// ============================================================================
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
const createCachedRepository = (repository, cacheManager, ttl = 300) => {
    return {
        async findById(id) {
            const cacheKey = `${repository.metadata.tableName}:${id}`;
            const cached = await cacheManager.get(cacheKey);
            if (cached)
                return cached;
            const entity = await repository.findOne({ where: { id } });
            if (entity) {
                await cacheManager.set(cacheKey, entity, ttl);
            }
            return entity;
        },
        async findAll() {
            const cacheKey = `${repository.metadata.tableName}:all`;
            const cached = await cacheManager.get(cacheKey);
            if (cached)
                return cached;
            const entities = await repository.find();
            await cacheManager.set(cacheKey, entities, ttl);
            return entities;
        },
        async create(data) {
            const entity = repository.create(data);
            const saved = await repository.save(entity);
            // Invalidate cache
            await cacheManager.del(`${repository.metadata.tableName}:all`);
            return saved;
        },
        async update(id, data) {
            await repository.update(id, data);
            const updated = await repository.findOne({ where: { id } });
            // Invalidate cache
            await cacheManager.del(`${repository.metadata.tableName}:${id}`);
            await cacheManager.del(`${repository.metadata.tableName}:all`);
            return updated;
        },
        async delete(id) {
            await repository.delete(id);
            // Invalidate cache
            await cacheManager.del(`${repository.metadata.tableName}:${id}`);
            await cacheManager.del(`${repository.metadata.tableName}:all`);
            return true;
        },
        async clearCache() {
            const keys = await cacheManager.store.keys();
            const tableKeys = keys.filter((key) => key.startsWith(`${repository.metadata.tableName}:`));
            await Promise.all(tableKeys.map((key) => cacheManager.del(key)));
        },
    };
};
exports.createCachedRepository = createCachedRepository;
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
const createTransactionalRepository = (repository, dataSource) => {
    return {
        async executeInTransaction(callback) {
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const result = await callback(queryRunner.manager);
                await queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        },
        async createWithTransaction(data) {
            return this.executeInTransaction(async (manager) => {
                const entity = repository.create(data);
                return manager.save(entity);
            });
        },
        async updateWithTransaction(id, data) {
            return this.executeInTransaction(async (manager) => {
                await manager.update(repository.metadata.target, id, data);
                return manager.findOne(repository.metadata.target, { where: { id } });
            });
        },
        async deleteWithTransaction(id) {
            return this.executeInTransaction(async (manager) => {
                await manager.delete(repository.metadata.target, id);
                return true;
            });
        },
    };
};
exports.createTransactionalRepository = createTransactionalRepository;
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
const createAuditedRepository = (repository, auditLogger, userId) => {
    const tableName = repository.metadata.tableName;
    return {
        async create(data) {
            const entity = repository.create(data);
            const saved = await repository.save(entity);
            await auditLogger.log({
                action: 'CREATE',
                entity: tableName,
                entityId: saved.id,
                userId,
                timestamp: new Date(),
                changes: data,
            });
            return saved;
        },
        async update(id, data) {
            const original = await repository.findOne({ where: { id } });
            await repository.update(id, data);
            const updated = await repository.findOne({ where: { id } });
            await auditLogger.log({
                action: 'UPDATE',
                entity: tableName,
                entityId: id,
                userId,
                timestamp: new Date(),
                changes: { original, updated },
            });
            return updated;
        },
        async delete(id) {
            const entity = await repository.findOne({ where: { id } });
            await repository.delete(id);
            await auditLogger.log({
                action: 'DELETE',
                entity: tableName,
                entityId: id,
                userId,
                timestamp: new Date(),
                changes: { deleted: entity },
            });
            return true;
        },
        async findById(id) {
            const entity = await repository.findOne({ where: { id } });
            if (entity) {
                await auditLogger.log({
                    action: 'READ',
                    entity: tableName,
                    entityId: id,
                    userId,
                    timestamp: new Date(),
                });
            }
            return entity;
        },
    };
};
exports.createAuditedRepository = createAuditedRepository;
// ============================================================================
// BUSINESS LOGIC HELPERS
// ============================================================================
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
const createBusinessRuleValidator = (rules) => {
    return async (data) => {
        for (const rule of rules) {
            const isValid = await rule.validate(data);
            if (!isValid) {
                throw new Error(`Business rule violation [${rule.name}]: ${rule.errorMessage}`);
            }
        }
    };
};
exports.createBusinessRuleValidator = createBusinessRuleValidator;
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
const createRetryableMethod = (method, maxRetries = 3, delay = 1000) => {
    return async (...args) => {
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await method(...args);
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
                }
            }
        }
        throw lastError;
    };
};
exports.createRetryableMethod = createRetryableMethod;
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
const createCachedMethod = (method, cacheManager, keyPrefix, ttl = 300) => {
    return async (...args) => {
        const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;
        const cached = await cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const result = await method(...args);
        await cacheManager.set(cacheKey, result, ttl);
        return result;
    };
};
exports.createCachedMethod = createCachedMethod;
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
const createValidatedMethod = (method, validator) => {
    return async (...args) => {
        await validator(...args);
        return method(...args);
    };
};
exports.createValidatedMethod = createValidatedMethod;
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
const createDataTransformer = (method, transformers) => {
    return async (...args) => {
        let result = await method(...args);
        for (const transformer of transformers) {
            result = transformer(result);
        }
        return result;
    };
};
exports.createDataTransformer = createDataTransformer;
// ============================================================================
// SERVICE COMPOSITION
// ============================================================================
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
const composeServices = (services) => {
    return new Proxy(services, {
        get(target, prop) {
            // Allow direct access to services
            if (prop in target) {
                return target[prop];
            }
            // Allow method calls on composed services
            return (...args) => {
                for (const service of Object.values(target)) {
                    if (typeof service[prop] === 'function') {
                        return service[prop](...args);
                    }
                }
                throw new Error(`Method ${prop} not found in any service`);
            };
        },
    });
};
exports.composeServices = composeServices;
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
const createAggregatorService = (methods, aggregator) => {
    return async (...args) => {
        const results = await Promise.all(methods.map((method) => method(...args)));
        return aggregator(results);
    };
};
exports.createAggregatorService = createAggregatorService;
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
const createServiceProxy = (service, middleware) => {
    return new Proxy(service, {
        get(target, prop) {
            const original = target[prop];
            if (typeof original !== 'function') {
                return original;
            }
            return async (...args) => {
                let index = 0;
                const next = async () => {
                    if (index < middleware.length) {
                        const currentMiddleware = middleware[index++];
                        return currentMiddleware(prop, args, next);
                    }
                    return original.apply(target, args);
                };
                return next();
            };
        },
    });
};
exports.createServiceProxy = createServiceProxy;
// ============================================================================
// ASYNC PROVIDERS
// ============================================================================
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
const createAsyncProvider = (config) => {
    return {
        provide: config.provide,
        useFactory: config.useFactory,
        inject: config.inject || [],
    };
};
exports.createAsyncProvider = createAsyncProvider;
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
const createConditionalAsyncProvider = (token, factoryFn, condition) => {
    return {
        provide: token,
        useFactory: async (...args) => {
            if (condition(...args)) {
                return factoryFn(...args);
            }
            return null;
        },
    };
};
exports.createConditionalAsyncProvider = createConditionalAsyncProvider;
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
const createValidatedAsyncProvider = (token, factoryFn, validator) => {
    return {
        provide: token,
        useFactory: async (...args) => {
            const instance = await factoryFn(...args);
            const isValid = await validator(instance);
            if (!isValid) {
                throw new Error(`Provider ${String(token)} failed validation`);
            }
            return instance;
        },
    };
};
exports.createValidatedAsyncProvider = createValidatedAsyncProvider;
// ============================================================================
// FACTORY PROVIDERS
// ============================================================================
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
const createFactoryProvider = (config) => {
    return {
        provide: config.provide,
        useFactory: config.useFactory,
        inject: config.inject || [],
        scope: config.scope,
    };
};
exports.createFactoryProvider = createFactoryProvider;
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
const createMultiInstanceFactory = (token, factoryFn) => {
    return {
        provide: token,
        useFactory: factoryFn,
        scope: 'TRANSIENT',
    };
};
exports.createMultiInstanceFactory = createMultiInstanceFactory;
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
const createLazySingletonFactory = (token, factoryFn) => {
    let instance = null;
    let initialized = false;
    return {
        provide: token,
        useFactory: async () => {
            if (!initialized) {
                instance = await factoryFn();
                initialized = true;
            }
            return instance;
        },
    };
};
exports.createLazySingletonFactory = createLazySingletonFactory;
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
const createConfigurableFactory = (token, factoryFn, overrides) => {
    return {
        provide: token,
        useFactory: (configService) => {
            const config = {
                ...configService.get(String(token).toLowerCase()),
                ...overrides,
            };
            return factoryFn(config);
        },
        inject: ['ConfigService'],
    };
};
exports.createConfigurableFactory = createConfigurableFactory;
// ============================================================================
// DATA ACCESS LAYER
// ============================================================================
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
const createDataAccessLayer = (dataSources) => {
    return {
        getDataSource(name) {
            if (!dataSources[name]) {
                throw new Error(`Data source '${name}' not found`);
            }
            return dataSources[name];
        },
        async executeQuery(dataSourceName, query, params) {
            const dataSource = this.getDataSource(dataSourceName);
            return dataSource.query(query, params);
        },
        async transaction(dataSourceName, callback) {
            const dataSource = this.getDataSource(dataSourceName);
            const queryRunner = dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                const result = await callback(queryRunner.manager);
                await queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
            finally {
                await queryRunner.release();
            }
        },
        async healthCheck() {
            const results = {};
            for (const [name, dataSource] of Object.entries(dataSources)) {
                try {
                    await dataSource.query('SELECT 1');
                    results[name] = true;
                }
                catch {
                    results[name] = false;
                }
            }
            return results;
        },
    };
};
exports.createDataAccessLayer = createDataAccessLayer;
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
const createRepositoryManager = (dataSource, entities) => {
    const repositories = new Map();
    entities.forEach((entity) => {
        repositories.set(entity, dataSource.getRepository(entity));
    });
    return {
        getRepository(entity) {
            const repo = repositories.get(entity);
            if (!repo) {
                throw new Error(`Repository for ${entity.name} not found`);
            }
            return repo;
        },
        async clearAll() {
            for (const repo of repositories.values()) {
                await repo.clear();
            }
        },
        async synchronize() {
            await dataSource.synchronize();
        },
        getAllRepositories() {
            return repositories;
        },
    };
};
exports.createRepositoryManager = createRepositoryManager;
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
const createQueryBuilderFactory = (repository) => {
    return {
        builder: null,
        where(conditions) {
            this.builder = repository.createQueryBuilder('entity');
            Object.entries(conditions).forEach(([key, value]) => {
                this.builder.andWhere(`entity.${key} = :${key}`, { [key]: value });
            });
            return this;
        },
        andWhere(condition, params) {
            if (!this.builder) {
                this.builder = repository.createQueryBuilder('entity');
            }
            this.builder.andWhere(condition, params);
            return this;
        },
        orWhere(condition, params) {
            if (!this.builder) {
                this.builder = repository.createQueryBuilder('entity');
            }
            this.builder.orWhere(condition, params);
            return this;
        },
        orderBy(field, order = 'ASC') {
            if (!this.builder) {
                this.builder = repository.createQueryBuilder('entity');
            }
            this.builder.orderBy(`entity.${field}`, order);
            return this;
        },
        limit(count) {
            if (!this.builder) {
                this.builder = repository.createQueryBuilder('entity');
            }
            this.builder.limit(count);
            return this;
        },
        offset(count) {
            if (!this.builder) {
                this.builder = repository.createQueryBuilder('entity');
            }
            this.builder.offset(count);
            return this;
        },
        async execute() {
            if (!this.builder) {
                return repository.find();
            }
            return this.builder.getMany();
        },
        async getOne() {
            if (!this.builder) {
                return null;
            }
            return this.builder.getOne();
        },
        async count() {
            if (!this.builder) {
                return repository.count();
            }
            return this.builder.getCount();
        },
        reset() {
            this.builder = null;
            return this;
        },
    };
};
exports.createQueryBuilderFactory = createQueryBuilderFactory;
// ============================================================================
// SERVICE LIFECYCLE & UTILITIES
// ============================================================================
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
const createHealthCheckableService = (service, healthCheckFn) => {
    return {
        ...service,
        healthCheck: healthCheckFn,
    };
};
exports.createHealthCheckableService = createHealthCheckableService;
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
const createGracefulShutdownService = (service, shutdownFn) => {
    return {
        ...service,
        shutdown: shutdownFn,
    };
};
exports.createGracefulShutdownService = createGracefulShutdownService;
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
const createMetricsService = (service, metricsCollector) => {
    return new Proxy(service, {
        get(target, prop) {
            const original = target[prop];
            if (typeof original !== 'function') {
                return original;
            }
            return async (...args) => {
                const startTime = Date.now();
                const methodName = `${service.constructor?.name}.${prop}`;
                try {
                    const result = await original.apply(target, args);
                    const duration = Date.now() - startTime;
                    metricsCollector.recordSuccess(methodName, duration);
                    return result;
                }
                catch (error) {
                    const duration = Date.now() - startTime;
                    metricsCollector.recordError(methodName, duration);
                    throw error;
                }
            };
        },
    });
};
exports.createMetricsService = createMetricsService;
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
const createRateLimitedService = (service, maxCalls, windowMs) => {
    const callCounts = new Map();
    return new Proxy(service, {
        get(target, prop) {
            const original = target[prop];
            if (typeof original !== 'function') {
                return original;
            }
            return async (...args) => {
                const now = Date.now();
                const methodKey = `${service.constructor?.name}.${prop}`;
                const record = callCounts.get(methodKey);
                if (!record || now > record.resetTime) {
                    callCounts.set(methodKey, { count: 1, resetTime: now + windowMs });
                    return original.apply(target, args);
                }
                if (record.count >= maxCalls) {
                    throw new Error(`Rate limit exceeded for ${methodKey}`);
                }
                record.count++;
                return original.apply(target, args);
            };
        },
    });
};
exports.createRateLimitedService = createRateLimitedService;
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
const createSelfHealingService = (service, recoveryFn) => {
    return new Proxy(service, {
        get(target, prop) {
            const original = target[prop];
            if (typeof original !== 'function') {
                return original;
            }
            return async (...args) => {
                try {
                    return await original.apply(target, args);
                }
                catch (error) {
                    await recoveryFn(error);
                    return await original.apply(target, args);
                }
            };
        },
    });
};
exports.createSelfHealingService = createSelfHealingService;
//# sourceMappingURL=nestjs-service-kit.js.map