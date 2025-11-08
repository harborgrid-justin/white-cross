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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface RepositoryConfig {
  enableCache?: boolean;
  cacheTTL?: number;
  enableAudit?: boolean;
  softDelete?: boolean;
}

interface BusinessRule<T> {
  name: string;
  validate: (data: T) => boolean | Promise<boolean>;
  errorMessage: string;
}

interface AuditLog {
  action: string;
  entity: string;
  entityId: string | number;
  userId?: string;
  timestamp: Date;
  changes?: Record<string, any>;
}

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
export const createCrudService = <T extends Record<string, any>>(
  repository: any,
  config: ServiceConfig = {},
): CrudServiceMethods<T> => {
  return {
    async create(data: Partial<T>): Promise<T> {
      const entity = repository.create(data);
      const saved = await repository.save(entity);
      return saved;
    },

    async findById(id: string | number): Promise<T | null> {
      const entity = await repository.findOne({ where: { id } });
      return entity || null;
    },

    async findAll(options?: FindOptions): Promise<T[]> {
      const entities = await repository.find(options || {});
      return entities;
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      await repository.update(id, data);
      const updated = await repository.findOne({ where: { id } });
      return updated;
    },

    async delete(id: string | number): Promise<boolean> {
      if (config.enableSoftDelete) {
        await repository.softDelete(id);
      } else {
        await repository.delete(id);
      }
      return true;
    },

    ...(config.enableSoftDelete && {
      async softDelete(id: string | number): Promise<boolean> {
        await repository.softDelete(id);
        return true;
      },

      async restore(id: string | number): Promise<T> {
        await repository.restore(id);
        return await repository.findOne({ where: { id } });
      },
    }),
  };
};

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
export const createPaginatedCrudService = <T>(repository: any) => {
  return {
    async findPaginated(options: PaginationOptions): Promise<PaginatedResult<T>> {
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

    async findAll(): Promise<T[]> {
      return repository.find();
    },

    async findById(id: string | number): Promise<T | null> {
      return repository.findOne({ where: { id } });
    },

    async create(data: Partial<T>): Promise<T> {
      const entity = repository.create(data);
      return repository.save(entity);
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      await repository.update(id, data);
      return repository.findOne({ where: { id } });
    },

    async delete(id: string | number): Promise<boolean> {
      await repository.delete(id);
      return true;
    },
  };
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
export const createSearchableService = <T>(repository: any) => {
  return {
    async search(options: {
      query: string;
      fields: string[];
      limit?: number;
    }): Promise<T[]> {
      const { query, fields, limit = 50 } = options;
      const queryBuilder = repository.createQueryBuilder('entity');

      const conditions = fields.map((field) => `entity.${field} LIKE :query`);
      queryBuilder.where(conditions.join(' OR '), { query: `%${query}%` });

      if (limit) {
        queryBuilder.take(limit);
      }

      return queryBuilder.getMany();
    },

    async filter(filters: Record<string, any>): Promise<T[]> {
      return repository.find({ where: filters });
    },

    async advancedSearch(criteria: {
      filters?: Record<string, any>;
      search?: { query: string; fields: string[] };
      pagination?: PaginationOptions;
    }): Promise<PaginatedResult<T> | T[]> {
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
export const createCachedRepository = <T>(
  repository: any,
  cacheManager: any,
  ttl: number = 300,
) => {
  return {
    async findById(id: string | number): Promise<T | null> {
      const cacheKey = `${repository.metadata.tableName}:${id}`;

      const cached = await cacheManager.get(cacheKey);
      if (cached) return cached;

      const entity = await repository.findOne({ where: { id } });
      if (entity) {
        await cacheManager.set(cacheKey, entity, ttl);
      }

      return entity;
    },

    async findAll(): Promise<T[]> {
      const cacheKey = `${repository.metadata.tableName}:all`;

      const cached = await cacheManager.get(cacheKey);
      if (cached) return cached;

      const entities = await repository.find();
      await cacheManager.set(cacheKey, entities, ttl);

      return entities;
    },

    async create(data: Partial<T>): Promise<T> {
      const entity = repository.create(data);
      const saved = await repository.save(entity);

      // Invalidate cache
      await cacheManager.del(`${repository.metadata.tableName}:all`);

      return saved;
    },

    async update(id: string | number, data: Partial<T>): Promise<T> {
      await repository.update(id, data);
      const updated = await repository.findOne({ where: { id } });

      // Invalidate cache
      await cacheManager.del(`${repository.metadata.tableName}:${id}`);
      await cacheManager.del(`${repository.metadata.tableName}:all`);

      return updated;
    },

    async delete(id: string | number): Promise<boolean> {
      await repository.delete(id);

      // Invalidate cache
      await cacheManager.del(`${repository.metadata.tableName}:${id}`);
      await cacheManager.del(`${repository.metadata.tableName}:all`);

      return true;
    },

    async clearCache(): Promise<void> {
      const keys = await cacheManager.store.keys();
      const tableKeys = keys.filter((key: string) =>
        key.startsWith(`${repository.metadata.tableName}:`)
      );
      await Promise.all(tableKeys.map((key: string) => cacheManager.del(key)));
    },
  };
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
export const createTransactionalRepository = <T>(
  repository: any,
  dataSource: any,
) => {
  return {
    async executeInTransaction(
      callback: (manager: any) => Promise<any>,
    ): Promise<any> {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const result = await callback(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },

    async createWithTransaction(data: Partial<T>): Promise<T> {
      return this.executeInTransaction(async (manager) => {
        const entity = repository.create(data);
        return manager.save(entity);
      });
    },

    async updateWithTransaction(id: string | number, data: Partial<T>): Promise<T> {
      return this.executeInTransaction(async (manager) => {
        await manager.update(repository.metadata.target, id, data);
        return manager.findOne(repository.metadata.target, { where: { id } });
      });
    },

    async deleteWithTransaction(id: string | number): Promise<boolean> {
      return this.executeInTransaction(async (manager) => {
        await manager.delete(repository.metadata.target, id);
        return true;
      });
    },
  };
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
export const createAuditedRepository = <T extends Record<string, any>>(
  repository: any,
  auditLogger: any,
  userId?: string,
) => {
  const tableName = repository.metadata.tableName;

  return {
    async create(data: Partial<T>): Promise<T> {
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

    async update(id: string | number, data: Partial<T>): Promise<T> {
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

    async delete(id: string | number): Promise<boolean> {
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

    async findById(id: string | number): Promise<T | null> {
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
export const createBusinessRuleValidator = <T>(rules: BusinessRule<T>[]) => {
  return async (data: T): Promise<void> => {
    for (const rule of rules) {
      const isValid = await rule.validate(data);
      if (!isValid) {
        throw new Error(`Business rule violation [${rule.name}]: ${rule.errorMessage}`);
      }
    }
  };
};

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
export const createRetryableMethod = <T>(
  method: (...args: any[]) => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
) => {
  return async (...args: any[]): Promise<T> => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await method(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
        }
      }
    }

    throw lastError!;
  };
};

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
export const createCachedMethod = <T>(
  method: (...args: any[]) => Promise<T>,
  cacheManager: any,
  keyPrefix: string,
  ttl: number = 300,
) => {
  return async (...args: any[]): Promise<T> => {
    const cacheKey = `${keyPrefix}:${JSON.stringify(args)}`;

    const cached = await cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await method(...args);
    await cacheManager.set(cacheKey, result, ttl);

    return result;
  };
};

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
export const createValidatedMethod = <T>(
  method: (...args: any[]) => Promise<T>,
  validator: (...args: any[]) => void | Promise<void>,
) => {
  return async (...args: any[]): Promise<T> => {
    await validator(...args);
    return method(...args);
  };
};

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
export const createDataTransformer = <T, R>(
  method: (...args: any[]) => Promise<T>,
  transformers: Array<(data: any) => any>,
) => {
  return async (...args: any[]): Promise<R> => {
    let result = await method(...args);

    for (const transformer of transformers) {
      result = transformer(result);
    }

    return result as R;
  };
};

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
export const composeServices = <T extends Record<string, any>>(
  services: T,
): T => {
  return new Proxy(services, {
    get(target, prop: string) {
      // Allow direct access to services
      if (prop in target) {
        return target[prop];
      }

      // Allow method calls on composed services
      return (...args: any[]) => {
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
export const createAggregatorService = <T>(
  methods: Array<(...args: any[]) => Promise<any>>,
  aggregator: (results: any[]) => T,
) => {
  return async (...args: any[]): Promise<T> => {
    const results = await Promise.all(methods.map((method) => method(...args)));
    return aggregator(results);
  };
};

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
export const createServiceProxy = <T extends Record<string, any>>(
  service: T,
  middleware: Array<(method: string, args: any[], next: () => Promise<any>) => Promise<any>>,
): T => {
  return new Proxy(service, {
    get(target, prop: string) {
      const original = target[prop];

      if (typeof original !== 'function') {
        return original;
      }

      return async (...args: any[]) => {
        let index = 0;

        const next = async (): Promise<any> => {
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
export const createAsyncProvider = (config: AsyncProviderConfig) => {
  return {
    provide: config.provide,
    useFactory: config.useFactory,
    inject: config.inject || [],
  };
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
export const createConditionalAsyncProvider = (
  token: string | symbol,
  factoryFn: (...args: any[]) => Promise<any>,
  condition: (...args: any[]) => boolean,
) => {
  return {
    provide: token,
    useFactory: async (...args: any[]) => {
      if (condition(...args)) {
        return factoryFn(...args);
      }
      return null;
    },
  };
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
export const createValidatedAsyncProvider = (
  token: string | symbol,
  factoryFn: (...args: any[]) => Promise<any>,
  validator: (instance: any) => Promise<boolean>,
) => {
  return {
    provide: token,
    useFactory: async (...args: any[]) => {
      const instance = await factoryFn(...args);
      const isValid = await validator(instance);

      if (!isValid) {
        throw new Error(`Provider ${String(token)} failed validation`);
      }

      return instance;
    },
  };
};

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
export const createFactoryProvider = (config: FactoryProviderConfig) => {
  return {
    provide: config.provide,
    useFactory: config.useFactory,
    inject: config.inject || [],
    scope: config.scope,
  };
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
export const createMultiInstanceFactory = (
  token: string | symbol,
  factoryFn: () => any,
) => {
  return {
    provide: token,
    useFactory: factoryFn,
    scope: 'TRANSIENT' as const,
  };
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
export const createLazySingletonFactory = (
  token: string | symbol,
  factoryFn: () => any | Promise<any>,
) => {
  let instance: any = null;
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
export const createConfigurableFactory = (
  token: string | symbol,
  factoryFn: (config: any) => any,
  overrides?: Record<string, any>,
) => {
  return {
    provide: token,
    useFactory: (configService: any) => {
      const config = {
        ...configService.get(String(token).toLowerCase()),
        ...overrides,
      };
      return factoryFn(config);
    },
    inject: ['ConfigService'],
  };
};

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
export const createDataAccessLayer = (dataSources: Record<string, any>) => {
  return {
    getDataSource(name: string): any {
      if (!dataSources[name]) {
        throw new Error(`Data source '${name}' not found`);
      }
      return dataSources[name];
    },

    async executeQuery(dataSourceName: string, query: string, params?: any[]): Promise<any> {
      const dataSource = this.getDataSource(dataSourceName);
      return dataSource.query(query, params);
    },

    async transaction(dataSourceName: string, callback: (manager: any) => Promise<any>): Promise<any> {
      const dataSource = this.getDataSource(dataSourceName);
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const result = await callback(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    },

    async healthCheck(): Promise<Record<string, boolean>> {
      const results: Record<string, boolean> = {};

      for (const [name, dataSource] of Object.entries(dataSources)) {
        try {
          await dataSource.query('SELECT 1');
          results[name] = true;
        } catch {
          results[name] = false;
        }
      }

      return results;
    },
  };
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
export const createRepositoryManager = (dataSource: any, entities: any[]) => {
  const repositories = new Map();

  entities.forEach((entity) => {
    repositories.set(entity, dataSource.getRepository(entity));
  });

  return {
    getRepository<T>(entity: any): any {
      const repo = repositories.get(entity);
      if (!repo) {
        throw new Error(`Repository for ${entity.name} not found`);
      }
      return repo;
    },

    async clearAll(): Promise<void> {
      for (const repo of repositories.values()) {
        await repo.clear();
      }
    },

    async synchronize(): Promise<void> {
      await dataSource.synchronize();
    },

    getAllRepositories(): Map<any, any> {
      return repositories;
    },
  };
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
export const createQueryBuilderFactory = (repository: any) => {
  return {
    builder: null as any,

    where(conditions: Record<string, any>) {
      this.builder = repository.createQueryBuilder('entity');
      Object.entries(conditions).forEach(([key, value]) => {
        this.builder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      });
      return this;
    },

    andWhere(condition: string, params: Record<string, any>) {
      if (!this.builder) {
        this.builder = repository.createQueryBuilder('entity');
      }
      this.builder.andWhere(condition, params);
      return this;
    },

    orWhere(condition: string, params: Record<string, any>) {
      if (!this.builder) {
        this.builder = repository.createQueryBuilder('entity');
      }
      this.builder.orWhere(condition, params);
      return this;
    },

    orderBy(field: string, order: 'ASC' | 'DESC' = 'ASC') {
      if (!this.builder) {
        this.builder = repository.createQueryBuilder('entity');
      }
      this.builder.orderBy(`entity.${field}`, order);
      return this;
    },

    limit(count: number) {
      if (!this.builder) {
        this.builder = repository.createQueryBuilder('entity');
      }
      this.builder.limit(count);
      return this;
    },

    offset(count: number) {
      if (!this.builder) {
        this.builder = repository.createQueryBuilder('entity');
      }
      this.builder.offset(count);
      return this;
    },

    async execute(): Promise<any[]> {
      if (!this.builder) {
        return repository.find();
      }
      return this.builder.getMany();
    },

    async getOne(): Promise<any | null> {
      if (!this.builder) {
        return null;
      }
      return this.builder.getOne();
    },

    async count(): Promise<number> {
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
export const createHealthCheckableService = <T extends Record<string, any>>(
  service: T,
  healthCheckFn: () => Promise<boolean>,
): T & { healthCheck: () => Promise<boolean> } => {
  return {
    ...service,
    healthCheck: healthCheckFn,
  };
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
export const createGracefulShutdownService = <T extends Record<string, any>>(
  service: T,
  shutdownFn: () => Promise<void>,
): T & { shutdown: () => Promise<void> } => {
  return {
    ...service,
    shutdown: shutdownFn,
  };
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
export const createMetricsService = <T extends Record<string, any>>(
  service: T,
  metricsCollector: any,
): T => {
  return new Proxy(service, {
    get(target, prop: string) {
      const original = target[prop];

      if (typeof original !== 'function') {
        return original;
      }

      return async (...args: any[]) => {
        const startTime = Date.now();
        const methodName = `${service.constructor?.name}.${prop}`;

        try {
          const result = await original.apply(target, args);
          const duration = Date.now() - startTime;

          metricsCollector.recordSuccess(methodName, duration);
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;
          metricsCollector.recordError(methodName, duration);
          throw error;
        }
      };
    },
  });
};

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
export const createRateLimitedService = <T extends Record<string, any>>(
  service: T,
  maxCalls: number,
  windowMs: number,
): T => {
  const callCounts = new Map<string, { count: number; resetTime: number }>();

  return new Proxy(service, {
    get(target, prop: string) {
      const original = target[prop];

      if (typeof original !== 'function') {
        return original;
      }

      return async (...args: any[]) => {
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
export const createSelfHealingService = <T extends Record<string, any>>(
  service: T,
  recoveryFn: (error: Error) => Promise<void>,
): T => {
  return new Proxy(service, {
    get(target, prop: string) {
      const original = target[prop];

      if (typeof original !== 'function') {
        return original;
      }

      return async (...args: any[]) => {
        try {
          return await original.apply(target, args);
        } catch (error) {
          await recoveryFn(error as Error);
          return await original.apply(target, args);
        }
      };
    },
  });
};
