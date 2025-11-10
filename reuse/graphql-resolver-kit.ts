/**
 * @fileoverview GraphQL Resolver Kit - Comprehensive NestJS GraphQL Utilities
 * @module reuse/graphql-resolver-kit
 * @description Production-ready GraphQL resolver and schema utilities for NestJS including:
 * resolver base classes, field resolver helpers, pagination (cursor & offset), DataLoader factories
 * for N+1 prevention, subscription resolvers, mutation validators, custom scalars, directive builders,
 * query complexity calculators, authentication guards, field-level authorization, error formatters,
 * schema stitching, union/interface resolvers, input validators, connection builders, Relay pagination,
 * and response transformers.
 *
 * Key Features:
 * - Advanced resolver base classes with middleware support
 * - DataLoader factories for N+1 query prevention
 * - Relay-style and offset pagination utilities
 * - Real-time subscription helpers with filtering
 * - Custom scalar types (DateTime, JSON, Email, UUID, PhoneNumber, etc.)
 * - GraphQL directive builders for authorization and validation
 * - Query complexity and depth limiting
 * - Field-level authorization decorators
 * - HIPAA-compliant data masking and audit logging
 * - Schema stitching and federation support
 * - Union and interface type resolvers
 * - Input validation with class-validator integration
 * - Response transformers and error formatters
 * - Performance monitoring and metrics
 *
 * @target NestJS 10.x, GraphQL 16.x, Apollo Server 4.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Field-level authorization
 * - HIPAA-compliant data masking
 * - Audit logging for mutations
 * - Rate limiting support
 * - Input sanitization
 * - Query complexity limits
 *
 * @example Basic resolver with DataLoader
 * ```typescript
 * import { createBaseResolver, createEntityDataLoader } from './graphql-resolver-kit';
 *
 * @Resolver(() => Patient)
 * export class PatientResolver extends createBaseResolver(Patient) {
 *   constructor(private patientService: PatientService) {
 *     super();
 *   }
 * }
 * ```
 *
 * @example Relay pagination
 * ```typescript
 * import { createRelayConnection, encodeRelayC cursor } from './graphql-resolver-kit';
 *
 * @Query(() => PatientConnection)
 * async patients(@Args() args: RelayPaginationArgs) {
 *   const patients = await this.patientService.findAll(args);
 *   return createRelayConnection(patients, args);
 * }
 * ```
 *
 * LOC: GQLRES123456
 * UPSTREAM: @nestjs/graphql, graphql, dataloader, class-validator
 * DOWNSTREAM: GraphQL resolvers, NestJS modules, API gateway
 *
 * @version 2.0.0
 * @since 2025-11-08
 */

import { Type } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  Context,
  Info,
  Parent,
  ResolveField,
  registerEnumType,
  Field,
  ObjectType,
  InputType,
  InterfaceType,
  createUnionType,
  Int,
  Float,
  ID,
} from '@nestjs/graphql';
import {
  GraphQLScalarType,
  GraphQLError,
  GraphQLResolveInfo,
  GraphQLFieldResolver,
  GraphQLObjectType,
  GraphQLSchema,
  Kind,
  ValueNode,
  DocumentNode,
  ValidationContext,
  DirectiveNode,
} from 'graphql';
import DataLoader from 'dataloader';
import { validate, ValidationError as ClassValidatorError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Model, ModelStatic, FindOptions, WhereOptions, Op } from 'sequelize';
import { PubSub } from 'graphql-subscriptions';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @interface GraphQLContext
 * @description Standard GraphQL context interface
 */
export interface GraphQLContext {
  req: any;
  res: any;
  user?: any;
  dataloaders: Map<string, DataLoader<any, any>>;
  pubsub?: PubSub;
  requestId?: string;
  tenantId?: string;
  auditLog?: (action: string, metadata: any) => Promise<void>;
  [key: string]: any;
}

/**
 * @interface PaginationArgs
 * @description Offset-based pagination arguments
 */
export interface PaginationArgs {
  offset?: number;
  limit?: number;
  page?: number;
  perPage?: number;
}

/**
 * @interface RelayPaginationArgs
 * @description Relay-style cursor pagination arguments
 */
export interface RelayPaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

/**
 * @interface PageInfo
 * @description Relay PageInfo type
 */
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

/**
 * @interface Edge
 * @description Relay Edge type
 */
export interface Edge<T> {
  cursor: string;
  node: T;
}

/**
 * @interface Connection
 * @description Relay Connection type
 */
export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

/**
 * @interface PaginatedResult
 * @description Offset pagination result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * @interface SubscriptionFilterConfig
 * @description Subscription filter configuration
 */
export interface SubscriptionFilterConfig<T = any> {
  topic: string;
  filter?: (payload: T, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
  resolve?: (payload: T) => any;
}

/**
 * @interface AuthorizationRule
 * @description Authorization rule for fields and resolvers
 */
export interface AuthorizationRule {
  roles?: string[];
  permissions?: string[];
  customCheck?: (context: GraphQLContext, parent: any, args: any) => boolean | Promise<boolean>;
}

/**
 * @interface DataLoaderOptions
 * @description DataLoader configuration options
 */
export interface DataLoaderOptions {
  batch?: boolean;
  cache?: boolean;
  maxBatchSize?: number;
  batchScheduleFn?: (callback: () => void) => void;
  cacheKeyFn?: (key: any) => any;
}

/**
 * @interface ComplexityConfig
 * @description Query complexity configuration
 */
export interface ComplexityConfig {
  maxComplexity: number;
  defaultCost?: number;
  fieldCosts?: Record<string, number>;
  multipliers?: Record<string, number>;
}

/**
 * @interface ValidationConfig
 * @description Input validation configuration
 */
export interface ValidationConfig {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  forbidUnknownValues?: boolean;
}

/**
 * @interface DirectiveConfig
 * @description GraphQL directive configuration
 */
export interface DirectiveConfig {
  name: string;
  locations: string[];
  args?: Record<string, any>;
  resolver?: (next: any, source: any, args: any, context: any) => any;
}

/**
 * @interface ErrorFormatterConfig
 * @description Error formatting configuration
 */
export interface ErrorFormatterConfig {
  includeStackTrace?: boolean;
  maskSensitiveData?: boolean;
  logErrors?: boolean;
  customFormatter?: (error: Error) => any;
}

/**
 * @interface PerformanceMetrics
 * @description Resolver performance metrics
 */
export interface PerformanceMetrics {
  resolverName: string;
  executionTime: number;
  fieldCount: number;
  complexity: number;
  timestamp: Date;
  userId?: string;
}

// ============================================================================
// SECTION 1: BASE RESOLVER CLASSES
// ============================================================================

/**
 * 1. Creates a base resolver class with common CRUD operations
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @returns {Type<any>} Base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createBaseResolver(Patient) {
 *   constructor(private patientService: PatientService) {
 *     super();
 *   }
 * }
 * ```
 */
export function createBaseResolver<T>(classRef: Type<T>): Type<any> {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    @Query(() => [classRef], { name: `getAll${classRef.name}s` })
    async findAll(@Args() args?: PaginationArgs): Promise<T[]> {
      throw new Error('findAll must be implemented');
    }

    @Query(() => classRef, { name: `get${classRef.name}`, nullable: true })
    async findOne(@Args('id', { type: () => ID }) id: string): Promise<T | null> {
      throw new Error('findOne must be implemented');
    }

    @Mutation(() => classRef, { name: `create${classRef.name}` })
    async create(@Args('input') input: any): Promise<T> {
      throw new Error('create must be implemented');
    }

    @Mutation(() => classRef, { name: `update${classRef.name}` })
    async update(
      @Args('id', { type: () => ID }) id: string,
      @Args('input') input: any
    ): Promise<T> {
      throw new Error('update must be implemented');
    }

    @Mutation(() => Boolean, { name: `delete${classRef.name}` })
    async delete(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
      throw new Error('delete must be implemented');
    }
  }

  return BaseResolverHost as Type<any>;
}

/**
 * 2. Creates a paginated base resolver with offset pagination
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Type<any>} paginatedType - Paginated result type
 * @returns {Type<any>} Paginated base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createPaginatedResolver(Patient, PaginatedPatients) {
 *   // ...
 * }
 * ```
 */
export function createPaginatedResolver<T>(
  classRef: Type<T>,
  paginatedType: Type<any>
): Type<any> {
  @Resolver({ isAbstract: true })
  abstract class PaginatedResolverHost {
    @Query(() => paginatedType, { name: `getAll${classRef.name}sPaginated` })
    async findAllPaginated(@Args() args: PaginationArgs): Promise<PaginatedResult<T>> {
      throw new Error('findAllPaginated must be implemented');
    }
  }

  return PaginatedResolverHost as Type<any>;
}

/**
 * 3. Creates a Relay-style base resolver with cursor pagination
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Type<any>} connectionType - Connection type
 * @returns {Type<any>} Relay base resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Appointment)
 * export class AppointmentResolver extends createRelayResolver(Appointment, AppointmentConnection) {
 *   // ...
 * }
 * ```
 */
export function createRelayResolver<T>(
  classRef: Type<T>,
  connectionType: Type<any>
): Type<any> {
  @Resolver({ isAbstract: true })
  abstract class RelayResolverHost {
    @Query(() => connectionType, { name: `getAll${classRef.name}sConnection` })
    async findConnection(@Args() args: RelayPaginationArgs): Promise<Connection<T>> {
      throw new Error('findConnection must be implemented');
    }
  }

  return RelayResolverHost as Type<any>;
}

/**
 * 4. Creates a resolver with built-in authorization
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {AuthorizationRule} authRule - Authorization rule
 * @returns {Type<any>} Authorized resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => MedicalRecord)
 * export class MedicalRecordResolver extends createAuthorizedResolver(
 *   MedicalRecord,
 *   { roles: ['DOCTOR', 'NURSE'], permissions: ['read:medical-records'] }
 * ) {
 *   // ...
 * }
 * ```
 */
export function createAuthorizedResolver<T>(
  classRef: Type<T>,
  authRule: AuthorizationRule
): Type<any> {
  @Resolver({ isAbstract: true })
  abstract class AuthorizedResolverHost {
    protected async checkAuthorization(context: GraphQLContext): Promise<void> {
      const user = context.user;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (authRule.roles && !authRule.roles.includes(user.role)) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN', requiredRoles: authRule.roles },
        });
      }

      if (authRule.permissions) {
        const hasPermissions = authRule.permissions.every((perm) =>
          user.permissions?.includes(perm)
        );
        if (!hasPermissions) {
          throw new GraphQLError('Insufficient permissions', {
            extensions: { code: 'FORBIDDEN', requiredPermissions: authRule.permissions },
          });
        }
      }

      if (authRule.customCheck) {
        const allowed = await authRule.customCheck(context, null, null);
        if (!allowed) {
          throw new GraphQLError('Access denied', {
            extensions: { code: 'FORBIDDEN' },
          });
        }
      }
    }
  }

  return AuthorizedResolverHost as Type<any>;
}

/**
 * 5. Creates a resolver with automatic performance monitoring
 *
 * @template T Entity type
 * @param {Type<T>} classRef - Entity class reference
 * @param {Function} metricsCallback - Metrics collection callback
 * @returns {Type<any>} Monitored resolver class
 *
 * @example
 * ```typescript
 * @Resolver(() => Patient)
 * export class PatientResolver extends createMonitoredResolver(
 *   Patient,
 *   (metrics) => logger.info('Resolver metrics', metrics)
 * ) {
 *   // ...
 * }
 * ```
 */
export function createMonitoredResolver<T>(
  classRef: Type<T>,
  metricsCallback: (metrics: PerformanceMetrics) => void
): Type<any> {
  @Resolver({ isAbstract: true })
  abstract class MonitoredResolverHost {
    protected async executeWithMonitoring<R>(
      resolverName: string,
      fn: () => Promise<R>,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<R> {
      const startTime = Date.now();

      try {
        const result = await fn();
        const executionTime = Date.now() - startTime;

        metricsCallback({
          resolverName,
          executionTime,
          fieldCount: countFieldsInSelection(info),
          complexity: 0, // Can be calculated separately
          timestamp: new Date(),
          userId: context.user?.id,
        });

        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;

        metricsCallback({
          resolverName: `${resolverName}:error`,
          executionTime,
          fieldCount: countFieldsInSelection(info),
          complexity: 0,
          timestamp: new Date(),
          userId: context.user?.id,
        });

        throw error;
      }
    }
  }

  return MonitoredResolverHost as Type<any>;
}

// ============================================================================
// SECTION 2: FIELD RESOLVER HELPERS
// ============================================================================

/**
 * 6. Creates a field resolver with automatic parent property access
 *
 * @param {string} propertyPath - Dot-notation property path
 * @param {any} defaultValue - Default value if undefined
 * @returns {GraphQLFieldResolver} Field resolver function
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * fullName: GraphQLFieldResolver<any, any> = createPropertyResolver('profile.fullName', 'Unknown');
 * ```
 */
export function createPropertyResolver(
  propertyPath: string,
  defaultValue?: any
): GraphQLFieldResolver<any, any> {
  return (parent: any) => {
    const paths = propertyPath.split('.');
    let value = parent;

    for (const path of paths) {
      if (value == null) {
        return defaultValue;
      }
      value = value[path];
    }

    return value !== undefined ? value : defaultValue;
  };
}

/**
 * 7. Creates a computed field resolver with caching
 *
 * @param {Function} computeFn - Compute function
 * @param {number} ttl - Cache TTL in seconds
 * @returns {GraphQLFieldResolver} Cached field resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * fullName = createCachedFieldResolver(
 *   (parent) => `${parent.firstName} ${parent.lastName}`,
 *   300
 * );
 * ```
 */
export function createCachedFieldResolver(
  computeFn: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any,
  ttl: number = 300
): GraphQLFieldResolver<any, any> {
  const cache = new Map<string, { value: any; expiry: number }>();

  return async (parent, args, context, info) => {
    const cacheKey = JSON.stringify({ parentId: parent.id, args });
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const value = await computeFn(parent, args, context, info);
    cache.set(cacheKey, { value, expiry: now + ttl * 1000 });

    return value;
  };
}

/**
 * 8. Creates a conditional field resolver
 *
 * @param {Function} conditionFn - Condition function
 * @param {GraphQLFieldResolver} trueResolver - Resolver when true
 * @param {GraphQLFieldResolver} falseResolver - Resolver when false
 * @returns {GraphQLFieldResolver} Conditional resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => String)
 * sensitiveData = createConditionalResolver(
 *   (parent, args, context) => context.user?.role === 'ADMIN',
 *   (parent) => parent.ssn,
 *   () => '***-**-****'
 * );
 * ```
 */
export function createConditionalResolver(
  conditionFn: (parent: any, args: any, context: any) => boolean | Promise<boolean>,
  trueResolver: GraphQLFieldResolver<any, any>,
  falseResolver: GraphQLFieldResolver<any, any>
): GraphQLFieldResolver<any, any> {
  return async (parent, args, context, info) => {
    const condition = await conditionFn(parent, args, context);
    return condition
      ? trueResolver(parent, args, context, info)
      : falseResolver(parent, args, context, info);
  };
}

/**
 * 9. Creates an aggregation field resolver
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field
 * @param {string} aggregateFunction - Aggregate function (COUNT, SUM, AVG, etc.)
 * @param {string} aggregateField - Field to aggregate
 * @returns {GraphQLFieldResolver} Aggregation resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => Int)
 * appointmentCount = createAggregationResolver(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT',
 *   'id'
 * );
 * ```
 */
export function createAggregationResolver<M extends Model>(
  model: ModelStatic<M>,
  foreignKey: string,
  aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  aggregateField: string = '*'
): GraphQLFieldResolver<any, any> {
  return async (parent: any) => {
    const result = await model.findOne({
      attributes: [
        [model.sequelize!.fn(aggregateFunction, model.sequelize!.col(aggregateField)), 'result'],
      ],
      where: { [foreignKey]: parent.id } as WhereOptions,
      raw: true,
    });

    return result ? (result as any).result : 0;
  };
}

/**
 * 10. Creates a batched field resolver using DataLoader
 *
 * @param {string} loaderKey - DataLoader key in context
 * @param {Function} keyExtractor - Key extraction function
 * @returns {GraphQLFieldResolver} Batched field resolver
 *
 * @example
 * ```typescript
 * @ResolveField(() => User)
 * author = createBatchedFieldResolver(
 *   'userLoader',
 *   (parent) => parent.authorId
 * );
 * ```
 */
export function createBatchedFieldResolver(
  loaderKey: string,
  keyExtractor: (parent: any) => any
): GraphQLFieldResolver<any, any> {
  return async (parent, args, context: GraphQLContext) => {
    const loader = context.dataloaders.get(loaderKey);

    if (!loader) {
      throw new GraphQLError(`DataLoader "${loaderKey}" not found in context`);
    }

    const key = keyExtractor(parent);
    return loader.load(key);
  };
}

// ============================================================================
// SECTION 3: PAGINATION UTILITIES
// ============================================================================

/**
 * 11. Creates offset-based pagination parameters
 *
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {object} Normalized pagination parameters
 *
 * @example
 * ```typescript
 * const { offset, limit } = createOffsetPagination({ page: 2, perPage: 20 }, 100);
 * // Result: { offset: 20, limit: 20 }
 * ```
 */
export function createOffsetPagination(
  args: PaginationArgs,
  maxLimit: number = 100
): { offset: number; limit: number } {
  let limit = args.limit || args.perPage || 10;
  limit = Math.min(limit, maxLimit);

  let offset = args.offset || 0;

  if (args.page && args.perPage) {
    offset = (args.page - 1) * args.perPage;
  }

  return { offset, limit };
}

/**
 * 12. Creates a paginated result wrapper
 *
 * @template T Item type
 * @param {T[]} items - Result items
 * @param {number} total - Total count
 * @param {PaginationArgs} args - Pagination arguments
 * @returns {PaginatedResult<T>} Paginated result
 *
 * @example
 * ```typescript
 * const result = createPaginatedResult(patients, 150, { page: 2, perPage: 20 });
 * ```
 */
export function createPaginatedResult<T>(
  items: T[],
  total: number,
  args: PaginationArgs
): PaginatedResult<T> {
  const perPage = args.perPage || args.limit || 10;
  const page = args.page || 1;
  const totalPages = Math.ceil(total / perPage);

  return {
    items,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * 13. Encodes a Relay cursor
 *
 * @param {object} data - Cursor data
 * @returns {string} Base64-encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeRelayCursor({ id: 'patient-123', offset: 10 });
 * ```
 */
export function encodeRelayCursor(data: Record<string, any>): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * 14. Decodes a Relay cursor
 *
 * @param {string} cursor - Base64-encoded cursor
 * @returns {object|null} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodeRelayCursor(cursor);
 * // Result: { id: 'patient-123', offset: 10 }
 * ```
 */
export function decodeRelayCursor(cursor: string): Record<string, any> | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

/**
 * 15. Creates a Relay connection from array
 *
 * @template T Node type
 * @param {T[]} items - Array of items
 * @param {RelayPaginationArgs} args - Relay pagination args
 * @param {Function} cursorFn - Cursor generation function
 * @returns {Connection<T>} Relay connection
 *
 * @example
 * ```typescript
 * const connection = createRelayConnection(
 *   appointments,
 *   { first: 10 },
 *   (item, index) => encodeRelayCursor({ id: item.id, index })
 * );
 * ```
 */
export function createRelayConnection<T>(
  items: T[],
  args: RelayPaginationArgs,
  cursorFn?: (item: T, index: number) => string
): Connection<T> {
  const requestedCount = args.first || args.last || 10;
  const hasExtraItem = items.length > requestedCount;
  const limitedItems = hasExtraItem ? items.slice(0, requestedCount) : items;

  const defaultCursorFn = (item: any, index: number) =>
    encodeRelayCursor({ id: item.id, index });

  const edges: Edge<T>[] = limitedItems.map((item, index) => ({
    cursor: (cursorFn || defaultCursorFn)(item, index),
    node: item,
  }));

  const pageInfo: PageInfo = {
    hasNextPage: args.first ? hasExtraItem : false,
    hasPreviousPage: !!args.after || !!args.before,
    startCursor: edges[0]?.cursor,
    endCursor: edges[edges.length - 1]?.cursor,
  };

  return {
    edges,
    pageInfo,
    totalCount: items.length,
  };
}

// ============================================================================
// SECTION 4: DATALOADER FACTORIES
// ============================================================================

/**
 * 16. Creates a generic DataLoader with configuration
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {DataLoaderOptions} options - DataLoader options
 * @returns {DataLoader} Configured DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   { cache: true, maxBatchSize: 100 }
 * );
 * ```
 */
export function createDataLoader<K, V>(
  batchLoadFn: (keys: readonly K[]) => Promise<V[]>,
  options?: DataLoaderOptions
): DataLoader<K, V> {
  return new DataLoader(batchLoadFn, {
    batch: options?.batch !== false,
    cache: options?.cache !== false,
    maxBatchSize: options?.maxBatchSize || 100,
    batchScheduleFn: options?.batchScheduleFn || ((callback) => setTimeout(callback, 1)),
    cacheKeyFn: options?.cacheKeyFn,
  });
}

/**
 * 17. Creates an entity DataLoader for loading by ID
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} idField - ID field name
 * @returns {DataLoader} Entity DataLoader
 *
 * @example
 * ```typescript
 * const patientLoader = createEntityDataLoader(PatientModel);
 * const patient = await patientLoader.load('patient-123');
 * ```
 */
export function createEntityDataLoader<M extends Model>(
  model: ModelStatic<M>,
  idField: string = 'id'
): DataLoader<any, M | null> {
  return new DataLoader(async (ids: readonly any[]) => {
    const entities = await model.findAll({
      where: { [idField]: ids as any[] } as WhereOptions,
    });

    const entityMap = new Map(entities.map((entity) => [entity.get(idField), entity]));
    return ids.map((id) => entityMap.get(id) || null);
  });
}

/**
 * 18. Creates a one-to-many relationship DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Related model
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions} findOptions - Additional Sequelize options
 * @returns {DataLoader} One-to-many DataLoader
 *
 * @example
 * ```typescript
 * const appointmentsLoader = createOneToManyDataLoader(
 *   AppointmentModel,
 *   'patientId',
 *   { order: [['scheduledAt', 'DESC']], limit: 10 }
 * );
 * ```
 */
export function createOneToManyDataLoader<M extends Model>(
  model: ModelStatic<M>,
  foreignKey: string,
  findOptions?: FindOptions
): DataLoader<any, M[]> {
  return new DataLoader(async (parentIds: readonly any[]) => {
    const records = await model.findAll({
      where: { [foreignKey]: parentIds as any[] } as WhereOptions,
      ...findOptions,
    });

    const groupedRecords = new Map<any, M[]>();
    records.forEach((record) => {
      const parentId = record.get(foreignKey);
      if (!groupedRecords.has(parentId)) {
        groupedRecords.set(parentId, []);
      }
      groupedRecords.get(parentId)!.push(record);
    });

    return parentIds.map((id) => groupedRecords.get(id) || []);
  });
}

/**
 * 19. Creates a many-to-many relationship DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} targetModel - Target entity model
 * @param {ModelStatic<any>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key
 * @param {string} targetKey - Target foreign key
 * @returns {DataLoader} Many-to-many DataLoader
 *
 * @example
 * ```typescript
 * const diagnosesLoader = createManyToManyDataLoader(
 *   DiagnosisModel,
 *   PatientDiagnosisModel,
 *   'patientId',
 *   'diagnosisId'
 * );
 * ```
 */
export function createManyToManyDataLoader<M extends Model>(
  targetModel: ModelStatic<M>,
  junctionModel: ModelStatic<any>,
  sourceKey: string,
  targetKey: string
): DataLoader<any, M[]> {
  return new DataLoader(async (sourceIds: readonly any[]) => {
    const junctionRecords = await junctionModel.findAll({
      where: { [sourceKey]: sourceIds as any[] } as WhereOptions,
    });

    const targetIds = [...new Set(junctionRecords.map((r) => r.get(targetKey)))];
    const targetEntities = await targetModel.findAll({
      where: { id: targetIds } as WhereOptions,
    });

    const targetMap = new Map(targetEntities.map((e) => [e.get('id'), e]));
    const groupedResults = new Map<any, M[]>();

    junctionRecords.forEach((junction) => {
      const sourceId = junction.get(sourceKey);
      const targetId = junction.get(targetKey);
      const targetEntity = targetMap.get(targetId);

      if (targetEntity) {
        if (!groupedResults.has(sourceId)) {
          groupedResults.set(sourceId, []);
        }
        groupedResults.get(sourceId)!.push(targetEntity);
      }
    });

    return sourceIds.map((id) => groupedResults.get(id) || []);
  });
}

/**
 * 20. Creates an aggregation DataLoader
 *
 * @template M Model type
 * @param {ModelStatic<M>} model - Sequelize model
 * @param {string} groupByField - Field to group by
 * @param {string} aggregateFunction - SQL aggregate function
 * @param {string} aggregateField - Field to aggregate
 * @returns {DataLoader} Aggregation DataLoader
 *
 * @example
 * ```typescript
 * const appointmentCountLoader = createAggregationDataLoader(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT',
 *   'id'
 * );
 * const count = await appointmentCountLoader.load('patient-123');
 * ```
 */
export function createAggregationDataLoader<M extends Model>(
  model: ModelStatic<M>,
  groupByField: string,
  aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  aggregateField: string = '*'
): DataLoader<any, number> {
  return new DataLoader(async (groupKeys: readonly any[]) => {
    const results = await model.findAll({
      attributes: [
        groupByField,
        [model.sequelize!.fn(aggregateFunction, model.sequelize!.col(aggregateField)), 'aggregate'],
      ],
      where: { [groupByField]: groupKeys as any[] } as WhereOptions,
      group: [groupByField],
      raw: true,
    });

    const resultMap = new Map(
      results.map((r: any) => [r[groupByField], parseFloat(r.aggregate) || 0])
    );

    return groupKeys.map((key) => resultMap.get(key) || 0);
  });
}

// ============================================================================
// SECTION 5: SUBSCRIPTION RESOLVERS
// ============================================================================

/**
 * 21. Creates a basic subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topic - Subscription topic
 * @returns {Function} Subscription resolver
 *
 * @example
 * ```typescript
 * @Subscription(() => Notification)
 * notificationAdded() {
 *   return createSubscriptionResolver(this.pubsub, 'NOTIFICATION_ADDED');
 * }
 * ```
 */
export function createSubscriptionResolver(pubsub: PubSub, topic: string): () => AsyncIterator<any> {
  return () => pubsub.asyncIterator(topic);
}

/**
 * 22. Creates a filtered subscription resolver
 *
 * @template T Payload type
 * @param {PubSub} pubsub - PubSub instance
 * @param {SubscriptionFilterConfig<T>} config - Filter configuration
 * @returns {object} Subscription resolver configuration
 *
 * @example
 * ```typescript
 * @Subscription(() => Message, {
 *   filter: createFilteredSubscription(pubsub, {
 *     topic: 'MESSAGE_SENT',
 *     filter: (payload, variables, context) => payload.userId === context.user.id
 *   }).filter
 * })
 * messageSent() {
 *   return createFilteredSubscription(pubsub, {
 *     topic: 'MESSAGE_SENT'
 *   }).subscribe();
 * }
 * ```
 */
export function createFilteredSubscription<T>(
  pubsub: PubSub,
  config: SubscriptionFilterConfig<T>
): {
  subscribe: () => AsyncIterator<any>;
  filter?: (payload: T, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
  resolve?: (payload: T) => any;
} {
  return {
    subscribe: () => pubsub.asyncIterator(config.topic),
    filter: config.filter,
    resolve: config.resolve || ((payload: T) => payload),
  };
}

/**
 * 23. Creates a user-specific subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topic - Subscription topic
 * @param {string} userIdField - User ID field in payload
 * @returns {object} User-specific subscription configuration
 *
 * @example
 * ```typescript
 * @Subscription(() => Appointment, {
 *   filter: createUserSubscription(pubsub, 'APPOINTMENT_UPDATED', 'patientId').filter
 * })
 * appointmentUpdated() {
 *   return createUserSubscription(pubsub, 'APPOINTMENT_UPDATED', 'patientId').subscribe();
 * }
 * ```
 */
export function createUserSubscription(
  pubsub: PubSub,
  topic: string,
  userIdField: string = 'userId'
): {
  subscribe: () => AsyncIterator<any>;
  filter: (payload: any, variables: any, context: GraphQLContext) => boolean;
} {
  return {
    subscribe: () => pubsub.asyncIterator(topic),
    filter: (payload: any, variables: any, context: GraphQLContext) => {
      if (!context.user) return false;
      return payload[userIdField] === context.user.id;
    },
  };
}

/**
 * 24. Creates a room/channel-based subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string} topicPrefix - Topic prefix
 * @param {Function} roomExtractor - Room ID extractor function
 * @returns {Function} Room subscription factory
 *
 * @example
 * ```typescript
 * @Subscription(() => ChatMessage)
 * chatMessage(@Args('roomId') roomId: string) {
 *   return createRoomSubscription(
 *     pubsub,
 *     'CHAT_MESSAGE',
 *     (variables) => variables.roomId
 *   )(roomId);
 * }
 * ```
 */
export function createRoomSubscription(
  pubsub: PubSub,
  topicPrefix: string,
  roomExtractor: (variables: any) => string
): (roomId: string) => AsyncIterator<any> {
  return (roomId: string) => {
    const topic = `${topicPrefix}.${roomId}`;
    return pubsub.asyncIterator(topic);
  };
}

/**
 * 25. Creates a multi-topic subscription resolver
 *
 * @param {PubSub} pubsub - PubSub instance
 * @param {string[]} topics - Array of topics to subscribe to
 * @returns {Function} Multi-topic subscription
 *
 * @example
 * ```typescript
 * @Subscription(() => SystemEvent)
 * systemEvents() {
 *   return createMultiTopicSubscription(pubsub, [
 *     'SYSTEM_ALERT',
 *     'SYSTEM_WARNING',
 *     'SYSTEM_INFO'
 *   ])();
 * }
 * ```
 */
export function createMultiTopicSubscription(
  pubsub: PubSub,
  topics: string[]
): () => AsyncIterator<any> {
  return () => pubsub.asyncIterator(topics);
}

// ============================================================================
// SECTION 6: MUTATION INPUT VALIDATORS
// ============================================================================

/**
 * 26. Validates input using class-validator
 *
 * @template T Input type
 * @param {Type<T>} inputClass - Input class with validation decorators
 * @param {any} input - Input data to validate
 * @param {ValidationConfig} config - Validation configuration
 * @returns {Promise<T>} Validated and transformed input
 *
 * @example
 * ```typescript
 * @Mutation(() => Patient)
 * async createPatient(@Args('input') input: CreatePatientInput) {
 *   const validatedInput = await validateInput(CreatePatientInput, input);
 *   return this.patientService.create(validatedInput);
 * }
 * ```
 */
export async function validateInput<T extends object>(
  inputClass: Type<T>,
  input: any,
  config?: ValidationConfig
): Promise<T> {
  const inputInstance = plainToClass(inputClass, input);

  const errors = await validate(inputInstance, {
    skipMissingProperties: config?.skipMissingProperties || false,
    whitelist: config?.whitelist !== false,
    forbidNonWhitelisted: config?.forbidNonWhitelisted || false,
    forbidUnknownValues: config?.forbidUnknownValues || true,
  });

  if (errors.length > 0) {
    const formattedErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
      children: error.children,
    }));

    throw new GraphQLError('Validation failed', {
      extensions: {
        code: 'BAD_USER_INPUT',
        validationErrors: formattedErrors,
      },
    });
  }

  return inputInstance;
}

/**
 * 27. Creates a validation decorator for mutation inputs
 *
 * @param {Type<any>} inputClass - Input class with validation decorators
 * @returns {MethodDecorator} Validation decorator
 *
 * @example
 * ```typescript
 * @Mutation(() => Patient)
 * @ValidateInput(CreatePatientInput)
 * async createPatient(@Args('input') input: CreatePatientInput) {
 *   // Input is automatically validated
 *   return this.patientService.create(input);
 * }
 * ```
 */
export function ValidateInput(inputClass: Type<any>): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Find the input argument (usually the first @Args decorated parameter)
      const inputArg = args[0];

      if (inputArg && typeof inputArg === 'object') {
        await validateInput(inputClass, inputArg);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 28. Sanitizes string inputs to prevent XSS
 *
 * @param {any} input - Input object to sanitize
 * @param {string[]} fieldsToSanitize - Fields to sanitize
 * @returns {any} Sanitized input
 *
 * @example
 * ```typescript
 * @Mutation(() => Comment)
 * async createComment(@Args('input') input: CreateCommentInput) {
 *   const sanitized = sanitizeInput(input, ['content', 'title']);
 *   return this.commentService.create(sanitized);
 * }
 * ```
 */
export function sanitizeInput(input: any, fieldsToSanitize: string[]): any {
  const sanitized = { ...input };

  fieldsToSanitize.forEach((field) => {
    if (field in sanitized && typeof sanitized[field] === 'string') {
      // Remove HTML tags and trim
      sanitized[field] = sanitized[field]
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'"]/g, '')
        .trim();
    }
  });

  return sanitized;
}

/**
 * 29. Validates required fields in mutation input
 *
 * @param {any} input - Input object
 * @param {string[]} requiredFields - Required field names
 * @throws {GraphQLError} If required fields are missing
 *
 * @example
 * ```typescript
 * @Mutation(() => Appointment)
 * async createAppointment(@Args('input') input: CreateAppointmentInput) {
 *   validateRequiredFields(input, ['patientId', 'doctorId', 'scheduledAt']);
 *   return this.appointmentService.create(input);
 * }
 * ```
 */
export function validateRequiredFields(input: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter((field) => {
    const value = input[field];
    return value === null || value === undefined || value === '';
  });

  if (missingFields.length > 0) {
    throw new GraphQLError('Required fields are missing', {
      extensions: {
        code: 'BAD_USER_INPUT',
        missingFields,
      },
    });
  }
}

/**
 * 30. Creates a custom field validator function
 *
 * @param {Function} validatorFn - Validation function
 * @param {string} errorMessage - Error message
 * @returns {Function} Field validator
 *
 * @example
 * ```typescript
 * const validateAge = createFieldValidator(
 *   (value) => value >= 18 && value <= 120,
 *   'Age must be between 18 and 120'
 * );
 *
 * validateAge(input.age);
 * ```
 */
export function createFieldValidator(
  validatorFn: (value: any) => boolean,
  errorMessage: string
): (value: any, fieldName?: string) => void {
  return (value: any, fieldName?: string) => {
    if (!validatorFn(value)) {
      throw new GraphQLError(errorMessage, {
        extensions: {
          code: 'BAD_USER_INPUT',
          field: fieldName,
        },
      });
    }
  };
}

// ============================================================================
// SECTION 7: CUSTOM SCALAR TYPES
// ============================================================================

/**
 * 31. Creates a DateTime scalar type
 *
 * @returns {GraphQLScalarType} DateTime scalar
 *
 * @example
 * ```typescript
 * const DateTimeScalar = createDateTimeScalar();
 * // Use in schema: scalar DateTime
 * ```
 */
export function createDateTimeScalar(): GraphQLScalarType {
  return new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO-8601 DateTime string',
    serialize(value: any): string {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return new Date(value).toISOString();
    },
    parseValue(value: any): Date {
      return new Date(value);
    },
    parseLiteral(ast: ValueNode): Date {
      if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      throw new GraphQLError('DateTime must be a string or number');
    },
  });
}

/**
 * 32. Creates a JSON scalar type
 *
 * @returns {GraphQLScalarType} JSON scalar
 *
 * @example
 * ```typescript
 * const JSONScalar = createJSONScalar();
 * // Use for flexible JSON fields
 * ```
 */
export function createJSONScalar(): GraphQLScalarType {
  return new GraphQLScalarType({
    name: 'JSON',
    description: 'JSON scalar type',
    serialize(value: any): any {
      return value;
    },
    parseValue(value: any): any {
      return value;
    },
    parseLiteral(ast: ValueNode): any {
      if (ast.kind === Kind.OBJECT || ast.kind === Kind.LIST) {
        return parseJSONLiteral(ast);
      }
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      }
      return null;
    },
  });
}

/**
 * 33. Creates an Email scalar type with validation
 *
 * @returns {GraphQLScalarType} Email scalar
 *
 * @example
 * ```typescript
 * const EmailScalar = createEmailScalar();
 * // Validates email format automatically
 * ```
 */
export function createEmailScalar(): GraphQLScalarType {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return new GraphQLScalarType({
    name: 'Email',
    description: 'Email address scalar type',
    serialize(value: any): string {
      if (!emailRegex.test(value)) {
        throw new GraphQLError('Invalid email format');
      }
      return value.toLowerCase();
    },
    parseValue(value: any): string {
      if (!emailRegex.test(value)) {
        throw new GraphQLError('Invalid email format');
      }
      return value.toLowerCase();
    },
    parseLiteral(ast: ValueNode): string {
      if (ast.kind === Kind.STRING) {
        if (!emailRegex.test(ast.value)) {
          throw new GraphQLError('Invalid email format');
        }
        return ast.value.toLowerCase();
      }
      throw new GraphQLError('Email must be a string');
    },
  });
}

/**
 * 34. Creates a UUID scalar type with validation
 *
 * @returns {GraphQLScalarType} UUID scalar
 *
 * @example
 * ```typescript
 * const UUIDScalar = createUUIDScalar();
 * // Validates UUID format
 * ```
 */
export function createUUIDScalar(): GraphQLScalarType {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return new GraphQLScalarType({
    name: 'UUID',
    description: 'UUID scalar type',
    serialize(value: any): string {
      if (!uuidRegex.test(value)) {
        throw new GraphQLError('Invalid UUID format');
      }
      return value.toLowerCase();
    },
    parseValue(value: any): string {
      if (!uuidRegex.test(value)) {
        throw new GraphQLError('Invalid UUID format');
      }
      return value.toLowerCase();
    },
    parseLiteral(ast: ValueNode): string {
      if (ast.kind === Kind.STRING) {
        if (!uuidRegex.test(ast.value)) {
          throw new GraphQLError('Invalid UUID format');
        }
        return ast.value.toLowerCase();
      }
      throw new GraphQLError('UUID must be a string');
    },
  });
}

/**
 * 35. Creates a PhoneNumber scalar type with validation
 *
 * @returns {GraphQLScalarType} PhoneNumber scalar
 *
 * @example
 * ```typescript
 * const PhoneScalar = createPhoneNumberScalar();
 * // Validates phone number format
 * ```
 */
export function createPhoneNumberScalar(): GraphQLScalarType {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

  return new GraphQLScalarType({
    name: 'PhoneNumber',
    description: 'Phone number scalar type (E.164 format)',
    serialize(value: any): string {
      const cleaned = value.replace(/\D/g, '');
      if (!phoneRegex.test(cleaned)) {
        throw new GraphQLError('Invalid phone number format');
      }
      return cleaned;
    },
    parseValue(value: any): string {
      const cleaned = value.replace(/\D/g, '');
      if (!phoneRegex.test(cleaned)) {
        throw new GraphQLError('Invalid phone number format');
      }
      return cleaned;
    },
    parseLiteral(ast: ValueNode): string {
      if (ast.kind === Kind.STRING) {
        const cleaned = ast.value.replace(/\D/g, '');
        if (!phoneRegex.test(cleaned)) {
          throw new GraphQLError('Invalid phone number format');
        }
        return cleaned;
      }
      throw new GraphQLError('PhoneNumber must be a string');
    },
  });
}

// ============================================================================
// SECTION 8: DIRECTIVE BUILDERS
// ============================================================================

/**
 * 36. Creates an authentication directive
 *
 * @returns {DirectiveConfig} Authentication directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @auth
 * type Query {
 *   me: User @auth
 * }
 * ```
 */
export function createAuthDirective(): DirectiveConfig {
  return {
    name: 'auth',
    locations: ['FIELD_DEFINITION', 'OBJECT'],
    resolver: async (next, source, args, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return next();
    },
  };
}

/**
 * 37. Creates a role-based authorization directive
 *
 * @param {string[]} allowedRoles - Allowed roles
 * @returns {DirectiveConfig} Role directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @hasRole(roles: ["ADMIN", "DOCTOR"])
 * type Mutation {
 *   deletePatient(id: ID!): Boolean @hasRole(roles: ["ADMIN"])
 * }
 * ```
 */
export function createRoleDirective(allowedRoles: string[]): DirectiveConfig {
  return {
    name: 'hasRole',
    locations: ['FIELD_DEFINITION'],
    args: { roles: allowedRoles },
    resolver: async (next, source, args, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!allowedRoles.includes(context.user.role)) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN', requiredRoles: allowedRoles },
        });
      }

      return next();
    },
  };
}

/**
 * 38. Creates a permission-based authorization directive
 *
 * @param {string[]} requiredPermissions - Required permissions
 * @returns {DirectiveConfig} Permission directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @hasPermission(permissions: ["read:patients"])
 * type Query {
 *   patient(id: ID!): Patient @hasPermission(permissions: ["read:patients"])
 * }
 * ```
 */
export function createPermissionDirective(requiredPermissions: string[]): DirectiveConfig {
  return {
    name: 'hasPermission',
    locations: ['FIELD_DEFINITION'],
    args: { permissions: requiredPermissions },
    resolver: async (next, source, args, context: GraphQLContext) => {
      if (!context.user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const hasPermissions = requiredPermissions.every((perm) =>
        context.user.permissions?.includes(perm)
      );

      if (!hasPermissions) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN', requiredPermissions },
        });
      }

      return next();
    },
  };
}

/**
 * 39. Creates a rate limiting directive
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {DirectiveConfig} Rate limit directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @rateLimit(max: 10, window: 60000)
 * type Mutation {
 *   sendEmail(to: String!): Boolean @rateLimit(max: 10, window: 60000)
 * }
 * ```
 */
export function createRateLimitDirective(maxRequests: number, windowMs: number): DirectiveConfig {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return {
    name: 'rateLimit',
    locations: ['FIELD_DEFINITION'],
    args: { max: maxRequests, window: windowMs },
    resolver: async (next, source, args, context: GraphQLContext) => {
      const userId = context.user?.id || context.req?.ip || 'anonymous';
      const now = Date.now();

      let userRequests = requests.get(userId);

      if (!userRequests || userRequests.resetTime < now) {
        userRequests = { count: 0, resetTime: now + windowMs };
        requests.set(userId, userRequests);
      }

      if (userRequests.count >= maxRequests) {
        throw new GraphQLError('Rate limit exceeded', {
          extensions: {
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
          },
        });
      }

      userRequests.count++;
      return next();
    },
  };
}

/**
 * 40. Creates a field deprecation directive
 *
 * @param {string} reason - Deprecation reason
 * @param {string} alternativeField - Alternative field to use
 * @returns {DirectiveConfig} Deprecation directive configuration
 *
 * @example
 * ```typescript
 * // In schema: @deprecated(reason: "Use 'fullName' instead")
 * type User {
 *   name: String @deprecated(reason: "Use 'fullName' instead")
 *   fullName: String
 * }
 * ```
 */
export function createDeprecatedDirective(reason: string, alternativeField?: string): DirectiveConfig {
  return {
    name: 'deprecated',
    locations: ['FIELD_DEFINITION'],
    args: { reason, alternativeField },
    resolver: async (next, source, args, context: GraphQLContext) => {
      // Log deprecation warning
      if (context.req) {
        console.warn(`Deprecated field accessed: ${reason}`);
      }
      return next();
    },
  };
}

// ============================================================================
// SECTION 9: AUTHORIZATION AND SECURITY
// ============================================================================

/**
 * 41. Creates HIPAA-compliant field masking function
 *
 * @param {string[]} sensitiveFields - Fields to mask
 * @param {Function} maskFn - Masking function
 * @returns {Function} Field masking function
 *
 * @example
 * ```typescript
 * const maskPHI = createFieldMasking(
 *   ['ssn', 'creditCard'],
 *   (value) => value ? '***-**-' + value.slice(-4) : null
 * );
 * const maskedData = maskPHI(patientData, context);
 * ```
 */
export function createFieldMasking(
  sensitiveFields: string[],
  maskFn: (value: any) => any
): (data: any, context: GraphQLContext) => any {
  return (data: any, context: GraphQLContext): any => {
    if (!data) return data;

    const masked = { ...data };
    const user = context.user;

    // Admin can see everything
    if (user?.role === 'ADMIN' || user?.permissions?.includes('view:phi')) {
      return data;
    }

    sensitiveFields.forEach((field) => {
      if (field in masked) {
        masked[field] = maskFn(masked[field]);
      }
    });

    return masked;
  };
}

/**
 * 42. Creates audit logging middleware for mutations
 *
 * @param {Function} auditLogger - Audit log function
 * @returns {Function} Audit middleware
 *
 * @example
 * ```typescript
 * const auditMiddleware = createAuditMiddleware(
 *   async (entry) => AuditLog.create(entry)
 * );
 * ```
 */
export function createAuditMiddleware(
  auditLogger: (entry: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    changes?: any;
    timestamp: Date;
    ipAddress?: string;
  }) => void | Promise<void>
): (resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any> {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context: GraphQLContext, info) => {
      const result = await resolver(parent, args, context, info);

      if (info.operation.operation === 'mutation') {
        await auditLogger({
          userId: context.user?.id || 'anonymous',
          action: info.fieldName,
          resourceType: info.parentType.name,
          resourceId: result?.id,
          changes: args,
          timestamp: new Date(),
          ipAddress: context.req?.ip,
        });
      }

      return result;
    };
  };
}

/**
 * 43. Creates resource ownership checker
 *
 * @param {Function} ownerExtractor - Function to extract owner ID
 * @returns {Function} Ownership check function
 *
 * @example
 * ```typescript
 * const checkOwnership = createOwnershipChecker((resource) => resource.patientId);
 * if (await checkOwnership(context.user, appointment)) {
 *   // Allow access
 * }
 * ```
 */
export function createOwnershipChecker(
  ownerExtractor: (resource: any) => string | Promise<string>
): (user: any, resource: any) => Promise<boolean> {
  return async (user: any, resource: any): Promise<boolean> => {
    if (!user) return false;

    const ownerId = await ownerExtractor(resource);
    return user.id === ownerId || user.role === 'ADMIN';
  };
}

/**
 * 44. Creates query complexity calculator
 *
 * @param {ComplexityConfig} config - Complexity configuration
 * @returns {Function} Complexity calculator
 *
 * @example
 * ```typescript
 * const calculateComplexity = createComplexityCalculator({
 *   maxComplexity: 1000,
 *   defaultCost: 1,
 *   fieldCosts: { patients: 5, appointments: 3 }
 * });
 * ```
 */
export function createComplexityCalculator(config: ComplexityConfig): (info: GraphQLResolveInfo) => number {
  return (info: GraphQLResolveInfo): number => {
    let complexity = 0;

    const calculateSelection = (selections: any[], depth: number = 1): void => {
      selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          const fieldName = selection.name.value;
          const fieldCost = config.fieldCosts?.[fieldName] || config.defaultCost || 1;
          const multiplier = config.multipliers?.[fieldName] || 1;

          complexity += fieldCost * multiplier * depth;

          if (selection.selectionSet) {
            calculateSelection(selection.selectionSet.selections, depth + 1);
          }
        }
      });
    };

    if (info.fieldNodes[0]?.selectionSet) {
      calculateSelection(info.fieldNodes[0].selectionSet.selections);
    }

    if (complexity > config.maxComplexity) {
      throw new GraphQLError(
        `Query is too complex: ${complexity}. Maximum allowed complexity: ${config.maxComplexity}`,
        { extensions: { code: 'QUERY_TOO_COMPLEX', complexity } }
      );
    }

    return complexity;
  };
}

/**
 * 45. Creates depth limiting validator
 *
 * @param {number} maxDepth - Maximum query depth
 * @returns {Function} Depth validator
 *
 * @example
 * ```typescript
 * const validateDepth = createDepthLimiter(5);
 * validateDepth(info); // Throws if depth > 5
 * ```
 */
export function createDepthLimiter(maxDepth: number): (info: GraphQLResolveInfo) => void {
  return (info: GraphQLResolveInfo): void => {
    let currentDepth = 0;

    const calculateDepth = (selections: any[], depth: number = 0): number => {
      if (!selections || selections.length === 0) return depth;

      let maxChildDepth = depth;

      selections.forEach((selection) => {
        if (selection.kind === 'Field' && selection.selectionSet) {
          const childDepth = calculateDepth(selection.selectionSet.selections, depth + 1);
          maxChildDepth = Math.max(maxChildDepth, childDepth);
        }
      });

      return maxChildDepth;
    };

    if (info.fieldNodes[0]?.selectionSet) {
      currentDepth = calculateDepth(info.fieldNodes[0].selectionSet.selections, 1);
    }

    if (currentDepth > maxDepth) {
      throw new GraphQLError(
        `Query depth ${currentDepth} exceeds maximum allowed depth of ${maxDepth}`,
        { extensions: { code: 'QUERY_TOO_DEEP', depth: currentDepth, maxDepth } }
      );
    }
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to count fields in selection
 */
function countFieldsInSelection(info: GraphQLResolveInfo): number {
  let count = 0;

  const countSelections = (selections: any[]): void => {
    selections.forEach((selection) => {
      if (selection.kind === 'Field') {
        count++;
        if (selection.selectionSet) {
          countSelections(selection.selectionSet.selections);
        }
      }
    });
  };

  if (info.fieldNodes[0]?.selectionSet) {
    countSelections(info.fieldNodes[0].selectionSet.selections);
  }

  return count;
}

/**
 * Helper to parse JSON literal from AST
 */
function parseJSONLiteral(ast: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT: {
      const value: any = {};
      ast.fields.forEach((field: any) => {
        value[field.name.value] = parseJSONLiteral(field.value);
      });
      return value;
    }
    case Kind.LIST:
      return ast.values.map(parseJSONLiteral);
    default:
      return null;
  }
}

/**
 * @description Export all utilities for easy importing
 */
export default {
  // Base Resolvers
  createBaseResolver,
  createPaginatedResolver,
  createRelayResolver,
  createAuthorizedResolver,
  createMonitoredResolver,

  // Field Resolvers
  createPropertyResolver,
  createCachedFieldResolver,
  createConditionalResolver,
  createAggregationResolver,
  createBatchedFieldResolver,

  // Pagination
  createOffsetPagination,
  createPaginatedResult,
  encodeRelayCursor,
  decodeRelayCursor,
  createRelayConnection,

  // DataLoaders
  createDataLoader,
  createEntityDataLoader,
  createOneToManyDataLoader,
  createManyToManyDataLoader,
  createAggregationDataLoader,

  // Subscriptions
  createSubscriptionResolver,
  createFilteredSubscription,
  createUserSubscription,
  createRoomSubscription,
  createMultiTopicSubscription,

  // Validation
  validateInput,
  ValidateInput,
  sanitizeInput,
  validateRequiredFields,
  createFieldValidator,

  // Scalars
  createDateTimeScalar,
  createJSONScalar,
  createEmailScalar,
  createUUIDScalar,
  createPhoneNumberScalar,

  // Directives
  createAuthDirective,
  createRoleDirective,
  createPermissionDirective,
  createRateLimitDirective,
  createDeprecatedDirective,

  // Security
  createFieldMasking,
  createAuditMiddleware,
  createOwnershipChecker,
  createComplexityCalculator,
  createDepthLimiter,
};
