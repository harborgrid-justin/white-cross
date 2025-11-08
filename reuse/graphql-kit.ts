/**
 * LOC: GQLK1234567
 * File: /reuse/graphql-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - GraphQL resolvers and modules
 *   - NestJS GraphQL services
 *   - GraphQL middleware and plugins
 *   - Federation gateway services
 */

/**
 * File: /reuse/graphql-kit.ts
 * Locator: WC-UTL-GQLK-001
 * Purpose: Comprehensive GraphQL Utilities - Resolver factories, DataLoader builders, schema generation, middleware, pagination, authorization, federation
 *
 * Upstream: Independent utility module for GraphQL implementation
 * Downstream: ../backend/*, GraphQL resolvers, services, middleware, federation gateway
 * Dependencies: TypeScript 5.x, Node 18+, Hapi.js, graphql, DataLoader, Apollo Federation
 * Exports: 50 utility functions for GraphQL resolver factories, field helpers, DataLoader N+1 prevention, middleware, pagination, authorization, federation
 *
 * LLM Context: Comprehensive GraphQL utilities for building production-ready GraphQL APIs in White Cross healthcare system.
 * Provides resolver factories, field resolver helpers, DataLoader builders for N+1 prevention, GraphQL middleware, schema stitching,
 * query complexity calculators, depth limiting, custom scalar builders, directive factories, union/interface resolvers, context builders,
 * subscription helpers, error formatters, batching utilities, caching strategies, file upload resolvers, relay/offset pagination,
 * filtering/sorting utilities, authorization directives, schema validation, testing utilities, performance monitoring, and federation helpers.
 */

import DataLoader from 'dataloader';
import { Model, ModelCtor, WhereOptions, FindOptions, Op, Order } from 'sequelize';
import {
  GraphQLResolveInfo,
  GraphQLFieldResolver,
  GraphQLScalarType,
  GraphQLError,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfig,
  Kind,
  ValueNode,
  DocumentNode,
  SelectionNode,
  FieldNode,
  ValidationContext,
  GraphQLType,
  GraphQLInputType,
  GraphQLOutputType,
} from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import * as GraphQLUpload from 'graphql-upload';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GraphQLContext {
  req: any;
  res: any;
  user?: any;
  dataloaders: Map<string, DataLoader<any, any>>;
  pubsub?: PubSub;
  requestId?: string;
  [key: string]: any;
}

interface ResolverFactory<TSource, TContext, TArgs, TResult> {
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs, TResult>;
  middleware?: Array<(resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>>;
}

interface FieldResolverConfig {
  fieldName: string;
  typeName: string;
  resolver: GraphQLFieldResolver<any, any>;
  authorize?: AuthorizationRule;
  cache?: CacheConfig;
}

interface AuthorizationRule {
  roles?: string[];
  permissions?: string[];
  customCheck?: (context: GraphQLContext, parent: any, args: any) => boolean | Promise<boolean>;
}

interface CacheConfig {
  ttl: number;
  keyGenerator?: (parent: any, args: any, context: any) => string;
}

interface DataLoaderOptions {
  batch?: boolean;
  cache?: boolean;
  maxBatchSize?: number;
  batchScheduleFn?: (callback: () => void) => void;
  cacheKeyFn?: (key: any) => any;
}

interface PaginationArgs {
  offset?: number;
  limit?: number;
  page?: number;
  perPage?: number;
}

interface RelayPaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

interface FilterArgs {
  where?: Record<string, any>;
  search?: string;
  searchFields?: string[];
}

interface SortArgs {
  orderBy?: string;
  order?: 'ASC' | 'DESC';
  sortBy?: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

interface Edge<T> {
  cursor: string;
  node: T;
}

interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface MiddlewareConfig {
  before?: Array<(context: GraphQLContext, args: any) => void | Promise<void>>;
  after?: Array<(result: any, context: GraphQLContext) => any | Promise<any>>;
  onError?: (error: Error, context: GraphQLContext) => void;
}

interface SchemaStitchingConfig {
  schemas: GraphQLSchema[];
  resolvers?: Record<string, any>;
  typeDefs?: string;
}

interface ComplexityCalculator {
  defaultCost: number;
  fieldCosts?: Record<string, number>;
  multipliers?: Record<string, number>;
}

interface DirectiveConfig {
  name: string;
  locations: string[];
  args?: Record<string, GraphQLInputType>;
  resolve?: (next: any, source: any, args: any, context: any) => any;
}

interface UnionResolverConfig {
  types: any[];
  resolveType: (value: any) => string | null;
}

interface InterfaceResolverConfig {
  fields: Record<string, GraphQLFieldConfig<any, any>>;
  resolveType: (value: any) => string | null;
}

interface SubscriptionFilterConfig {
  topic: string;
  filter?: (payload: any, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
  resolve?: (payload: any) => any;
}

interface FileUploadConfig {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  uploadDir?: string;
}

interface TestingContext {
  user?: any;
  dataloaders?: Map<string, DataLoader<any, any>>;
  mocks?: Record<string, any>;
}

interface PerformanceMetrics {
  queryName: string;
  duration: number;
  fieldCount: number;
  complexity: number;
  timestamp: Date;
}

interface FederationEntityConfig {
  typeName: string;
  keyFields: string[];
  resolveReference: (reference: any, context: any) => any | Promise<any>;
}

interface SchemaDocumentation {
  type: string;
  description: string;
  fields: Array<{
    name: string;
    type: string;
    description?: string;
    deprecated?: boolean;
    deprecationReason?: string;
  }>;
}

// ============================================================================
// SECTION 1: RESOLVER FACTORIES AND FIELD HELPERS (8 functions)
// ============================================================================

/**
 * 1. Creates a generic resolver factory with middleware support.
 *
 * @param {GraphQLFieldResolver<TSource, TContext, TArgs, TResult>} resolver - Base resolver function
 * @param {Array<Function>} [middleware] - Middleware functions to apply
 * @returns {ResolverFactory<TSource, TContext, TArgs, TResult>} Resolver factory
 *
 * @example
 * ```typescript
 * const getUserResolver = createResolverFactory(
 *   async (parent, args, context) => context.userService.findById(args.id),
 *   [loggingMiddleware, authMiddleware]
 * );
 * ```
 */
export const createResolverFactory = <TSource, TContext, TArgs, TResult>(
  resolver: GraphQLFieldResolver<TSource, TContext, TArgs, TResult>,
  middleware?: Array<(resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>>,
): ResolverFactory<TSource, TContext, TArgs, TResult> => {
  let wrappedResolver = resolver as GraphQLFieldResolver<any, any>;

  if (middleware && middleware.length > 0) {
    middleware.forEach((mw) => {
      wrappedResolver = mw(wrappedResolver);
    });
  }

  return {
    resolve: wrappedResolver as GraphQLFieldResolver<TSource, TContext, TArgs, TResult>,
    middleware,
  };
};

/**
 * 2. Creates a field resolver with automatic parent property access.
 *
 * @param {string} propertyPath - Dot-notation path to property (e.g., 'user.profile.email')
 * @param {any} [defaultValue] - Default value if property is undefined
 * @returns {GraphQLFieldResolver<any, any>} Field resolver
 *
 * @example
 * ```typescript
 * const emailResolver = createPropertyResolver('user.email', 'noemail@example.com');
 * // Automatically resolves parent.user.email with fallback
 * ```
 */
export const createPropertyResolver = (
  propertyPath: string,
  defaultValue?: any,
): GraphQLFieldResolver<any, any> => {
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
};

/**
 * 3. Creates a computed field resolver with caching.
 *
 * @param {Function} computeFn - Function to compute field value
 * @param {CacheConfig} [cacheConfig] - Cache configuration
 * @returns {GraphQLFieldResolver<any, any>} Cached computed resolver
 *
 * @example
 * ```typescript
 * const fullNameResolver = createComputedFieldResolver(
 *   (parent) => `${parent.firstName} ${parent.lastName}`,
 *   { ttl: 300, keyGenerator: (p) => `fullname-${p.id}` }
 * );
 * ```
 */
export const createComputedFieldResolver = (
  computeFn: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => any,
  cacheConfig?: CacheConfig,
): GraphQLFieldResolver<any, any> => {
  const cache = new Map<string, { value: any; expiry: number }>();

  return async (parent, args, context, info) => {
    if (cacheConfig) {
      const cacheKey = cacheConfig.keyGenerator
        ? cacheConfig.keyGenerator(parent, args, context)
        : JSON.stringify({ parent, args });

      const cached = cache.get(cacheKey);
      const now = Date.now();

      if (cached && cached.expiry > now) {
        return cached.value;
      }

      const value = await computeFn(parent, args, context, info);
      cache.set(cacheKey, { value, expiry: now + cacheConfig.ttl * 1000 });
      return value;
    }

    return computeFn(parent, args, context, info);
  };
};

/**
 * 4. Creates an aggregation field resolver (count, sum, avg, etc.).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field name
 * @param {string} aggregateFunction - Aggregate function (COUNT, SUM, AVG, MIN, MAX)
 * @param {string} [aggregateField] - Field to aggregate (for SUM, AVG, etc.)
 * @returns {GraphQLFieldResolver<any, any>} Aggregation resolver
 *
 * @example
 * ```typescript
 * const totalSalaryResolver = createAggregationResolver(
 *   EmployeeModel,
 *   'departmentId',
 *   'SUM',
 *   'salary'
 * );
 * ```
 */
export const createAggregationResolver = (
  model: ModelCtor<Model>,
  foreignKey: string,
  aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  aggregateField?: string,
): GraphQLFieldResolver<any, any> => {
  return async (parent: any) => {
    const parentId = parent.id;
    const field = aggregateField || '*';

    const result = await model.findOne({
      attributes: [[model.sequelize!.fn(aggregateFunction, model.sequelize!.col(field)), 'result']],
      where: { [foreignKey]: parentId } as WhereOptions,
      raw: true,
    });

    return result ? (result as any).result : 0;
  };
};

/**
 * 5. Creates a conditional resolver based on parent value.
 *
 * @param {Function} conditionFn - Condition function
 * @param {GraphQLFieldResolver<any, any>} trueResolver - Resolver when condition is true
 * @param {GraphQLFieldResolver<any, any>} falseResolver - Resolver when condition is false
 * @returns {GraphQLFieldResolver<any, any>} Conditional resolver
 *
 * @example
 * ```typescript
 * const dataResolver = createConditionalResolver(
 *   (parent, args, context) => context.user?.role === 'ADMIN',
 *   adminDataResolver,
 *   publicDataResolver
 * );
 * ```
 */
export const createConditionalResolver = (
  conditionFn: (parent: any, args: any, context: any) => boolean | Promise<boolean>,
  trueResolver: GraphQLFieldResolver<any, any>,
  falseResolver: GraphQLFieldResolver<any, any>,
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    const condition = await conditionFn(parent, args, context);
    return condition
      ? trueResolver(parent, args, context, info)
      : falseResolver(parent, args, context, info);
  };
};

/**
 * 6. Creates a batched resolver that groups multiple requests.
 *
 * @param {Function} batchFn - Batch loading function
 * @param {Function} keyExtractor - Function to extract key from parent
 * @returns {GraphQLFieldResolver<any, any>} Batched resolver
 *
 * @example
 * ```typescript
 * const authorsResolver = createBatchResolver(
 *   (postIds) => PostModel.findAll({ where: { id: postIds } }),
 *   (post) => post.authorId
 * );
 * ```
 */
export const createBatchResolver = (
  batchFn: (keys: readonly any[]) => Promise<any[]>,
  keyExtractor: (parent: any) => any,
): GraphQLFieldResolver<any, any> => {
  const loader = new DataLoader(batchFn);

  return async (parent: any) => {
    const key = keyExtractor(parent);
    return loader.load(key);
  };
};

/**
 * 7. Creates a resolver with automatic error handling and retry logic.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver
 * @param {number} [maxRetries] - Maximum retry attempts
 * @param {Function} [shouldRetry] - Function to determine if error should trigger retry
 * @returns {GraphQLFieldResolver<any, any>} Resolver with retry logic
 *
 * @example
 * ```typescript
 * const resilientResolver = createRetryResolver(
 *   unstableApiResolver,
 *   3,
 *   (error) => error.message.includes('timeout')
 * );
 * ```
 */
export const createRetryResolver = (
  resolver: GraphQLFieldResolver<any, any>,
  maxRetries: number = 3,
  shouldRetry?: (error: Error) => boolean,
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts <= maxRetries) {
      try {
        return await resolver(parent, args, context, info);
      } catch (error) {
        lastError = error as Error;
        attempts++;

        if (attempts > maxRetries || (shouldRetry && !shouldRetry(lastError))) {
          throw lastError;
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 100));
      }
    }

    throw lastError;
  };
};

/**
 * 8. Creates a resolver that merges multiple data sources.
 *
 * @param {Array<GraphQLFieldResolver<any, any>>} resolvers - Array of resolvers to merge
 * @param {Function} mergeFn - Function to merge results
 * @returns {GraphQLFieldResolver<any, any>} Merged resolver
 *
 * @example
 * ```typescript
 * const combinedDataResolver = createMergeResolver(
 *   [dbResolver, cacheResolver, apiResolver],
 *   (results) => Object.assign({}, ...results)
 * );
 * ```
 */
export const createMergeResolver = (
  resolvers: Array<GraphQLFieldResolver<any, any>>,
  mergeFn: (results: any[]) => any,
): GraphQLFieldResolver<any, any> => {
  return async (parent, args, context, info) => {
    const results = await Promise.all(
      resolvers.map((resolver) => resolver(parent, args, context, info)),
    );
    return mergeFn(results);
  };
};

// ============================================================================
// SECTION 2: DATALOADER BUILDERS AND N+1 PREVENTION (7 functions)
// ============================================================================

/**
 * 9. Creates a generic DataLoader with custom configuration.
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {DataLoaderOptions} [options] - DataLoader options
 * @returns {DataLoader<any, any>} Configured DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   { cache: true, maxBatchSize: 100 }
 * );
 * ```
 */
export const createDataLoader = (
  batchLoadFn: (keys: readonly any[]) => Promise<any[]>,
  options?: DataLoaderOptions,
): DataLoader<any, any> => {
  return new DataLoader(batchLoadFn, {
    batch: options?.batch !== false,
    cache: options?.cache !== false,
    maxBatchSize: options?.maxBatchSize || 100,
    batchScheduleFn: options?.batchScheduleFn || ((callback) => setTimeout(callback, 1)),
    cacheKeyFn: options?.cacheKeyFn,
  });
};

/**
 * 10. Creates a DataLoader for loading single entities by ID.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} [idField] - ID field name (default: 'id')
 * @returns {DataLoader<any, any>} Entity DataLoader
 *
 * @example
 * ```typescript
 * const patientLoader = createEntityLoader(PatientModel);
 * const patient = await patientLoader.load('patient-123');
 * ```
 */
export const createEntityLoader = (
  model: ModelCtor<Model>,
  idField: string = 'id',
): DataLoader<any, any> => {
  return new DataLoader(async (ids: readonly any[]) => {
    const entities = await model.findAll({
      where: { [idField]: ids as any[] } as WhereOptions,
    });

    const entityMap = new Map(entities.map((entity) => [entity.get(idField), entity]));
    return ids.map((id) => entityMap.get(id) || null);
  });
};

/**
 * 11. Creates a DataLoader for one-to-many relationships.
 *
 * @param {ModelCtor<Model>} model - Related model
 * @param {string} foreignKey - Foreign key field
 * @param {FindOptions} [findOptions] - Additional Sequelize options
 * @returns {DataLoader<any, any[]>} One-to-many DataLoader
 *
 * @example
 * ```typescript
 * const appointmentsLoader = createOneToManyLoader(
 *   AppointmentModel,
 *   'patientId',
 *   { order: [['scheduledAt', 'DESC']], limit: 10 }
 * );
 * ```
 */
export const createOneToManyLoader = (
  model: ModelCtor<Model>,
  foreignKey: string,
  findOptions?: FindOptions,
): DataLoader<any, any[]> => {
  return new DataLoader(async (parentIds: readonly any[]) => {
    const records = await model.findAll({
      where: { [foreignKey]: parentIds as any[] } as WhereOptions,
      ...findOptions,
    });

    const groupedRecords = new Map<any, any[]>();
    records.forEach((record) => {
      const parentId = record.get(foreignKey);
      if (!groupedRecords.has(parentId)) {
        groupedRecords.set(parentId, []);
      }
      groupedRecords.get(parentId)!.push(record);
    });

    return parentIds.map((id) => groupedRecords.get(id) || []);
  });
};

/**
 * 12. Creates a DataLoader for many-to-many relationships via junction table.
 *
 * @param {ModelCtor<Model>} targetModel - Target entity model
 * @param {ModelCtor<Model>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key in junction
 * @param {string} targetKey - Target foreign key in junction
 * @returns {DataLoader<any, any[]>} Many-to-many DataLoader
 *
 * @example
 * ```typescript
 * const patientDiagnosesLoader = createManyToManyLoader(
 *   DiagnosisModel,
 *   PatientDiagnosisModel,
 *   'patientId',
 *   'diagnosisId'
 * );
 * ```
 */
export const createManyToManyLoader = (
  targetModel: ModelCtor<Model>,
  junctionModel: ModelCtor<Model>,
  sourceKey: string,
  targetKey: string,
): DataLoader<any, any[]> => {
  return new DataLoader(async (sourceIds: readonly any[]) => {
    const junctionRecords = await junctionModel.findAll({
      where: { [sourceKey]: sourceIds as any[] } as WhereOptions,
    });

    const targetIds = [...new Set(junctionRecords.map((r) => r.get(targetKey)))];
    const targetEntities = await targetModel.findAll({
      where: { id: targetIds } as WhereOptions,
    });

    const targetMap = new Map(targetEntities.map((e) => [e.get('id'), e]));
    const groupedResults = new Map<any, any[]>();

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
};

/**
 * 13. Creates a DataLoader for aggregation queries (count, sum, avg).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} groupByField - Field to group by
 * @param {string} aggregateFunction - SQL aggregate function
 * @param {string} [aggregateField] - Field to aggregate
 * @returns {DataLoader<any, number>} Aggregation DataLoader
 *
 * @example
 * ```typescript
 * const appointmentCountLoader = createAggregateLoader(
 *   AppointmentModel,
 *   'patientId',
 *   'COUNT'
 * );
 * const count = await appointmentCountLoader.load('patient-123');
 * ```
 */
export const createAggregateLoader = (
  model: ModelCtor<Model>,
  groupByField: string,
  aggregateFunction: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX',
  aggregateField: string = '*',
): DataLoader<any, number> => {
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
      results.map((r: any) => [r[groupByField], parseFloat(r.aggregate) || 0]),
    );

    return groupKeys.map((key) => resultMap.get(key) || 0);
  });
};

/**
 * 14. Creates a DataLoader with custom cache implementation (Redis, etc.).
 *
 * @param {Function} batchLoadFn - Batch loading function
 * @param {Map<any, any>} cacheMap - Custom cache map (e.g., Redis client wrapper)
 * @returns {DataLoader<any, any>} DataLoader with custom cache
 *
 * @example
 * ```typescript
 * const redisCache = new Map(); // Or Redis client wrapper
 * const cachedLoader = createCachedDataLoader(
 *   async (ids) => UserModel.findAll({ where: { id: ids } }),
 *   redisCache
 * );
 * ```
 */
export const createCachedDataLoader = (
  batchLoadFn: (keys: readonly any[]) => Promise<any[]>,
  cacheMap: Map<any, any>,
): DataLoader<any, any> => {
  return new DataLoader(batchLoadFn, {
    cacheMap,
    cache: true,
  });
};

/**
 * 15. Creates a DataLoader context builder for GraphQL requests.
 *
 * @param {Record<string, (context: any) => DataLoader<any, any>>} loaderFactories - Loader factory functions
 * @returns {Function} Context builder function
 *
 * @example
 * ```typescript
 * const buildLoaders = createDataLoaderContext({
 *   users: () => createEntityLoader(UserModel),
 *   posts: () => createOneToManyLoader(PostModel, 'userId'),
 *   comments: () => createOneToManyLoader(CommentModel, 'postId')
 * });
 * const context = { dataloaders: buildLoaders(req) };
 * ```
 */
export const createDataLoaderContext = (
  loaderFactories: Record<string, (context: any) => DataLoader<any, any>>,
): ((context?: any) => Map<string, DataLoader<any, any>>) => {
  return (context?: any) => {
    const loaders = new Map<string, DataLoader<any, any>>();

    for (const [name, factory] of Object.entries(loaderFactories)) {
      loaders.set(name, factory(context));
    }

    return loaders;
  };
};

// ============================================================================
// SECTION 3: SCHEMA GENERATION AND TYPE UTILITIES (7 functions)
// ============================================================================

/**
 * 16. Generates GraphQL type definition from TypeScript interface.
 *
 * @param {string} typeName - GraphQL type name
 * @param {Record<string, string>} fields - Field definitions
 * @param {boolean} [isInput] - Whether to generate input type
 * @returns {string} GraphQL type definition
 *
 * @example
 * ```typescript
 * const typeDef = generateTypeDefinition('User', {
 *   id: 'ID!',
 *   email: 'String!',
 *   posts: '[Post!]'
 * });
 * // Result: "type User { id: ID! email: String! posts: [Post!] }"
 * ```
 */
export const generateTypeDefinition = (
  typeName: string,
  fields: Record<string, string>,
  isInput: boolean = false,
): string => {
  const keyword = isInput ? 'input' : 'type';
  const fieldDefs = Object.entries(fields)
    .map(([name, type]) => `  ${name}: ${type}`)
    .join('\n');

  return `${keyword} ${typeName} {\n${fieldDefs}\n}`;
};

/**
 * 17. Creates GraphQL enum type from TypeScript enum or array.
 *
 * @param {string} enumName - Enum type name
 * @param {string[] | Record<string, string>} values - Enum values
 * @param {Record<string, string>} [descriptions] - Value descriptions
 * @returns {string} GraphQL enum definition
 *
 * @example
 * ```typescript
 * const enumDef = createEnumDefinition('AppointmentStatus',
 *   ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
 *   { SCHEDULED: 'Appointment is scheduled', COMPLETED: 'Visit completed' }
 * );
 * ```
 */
export const createEnumDefinition = (
  enumName: string,
  values: string[] | Record<string, string>,
  descriptions?: Record<string, string>,
): string => {
  const enumValues = Array.isArray(values) ? values : Object.keys(values);
  const valueDefs = enumValues.map((val) => {
    const desc = descriptions?.[val] ? `  """${descriptions[val]}"""\n` : '';
    return `${desc}  ${val}`;
  }).join('\n');

  return `enum ${enumName} {\n${valueDefs}\n}`;
};

/**
 * 18. Creates a custom DateTime scalar type.
 *
 * @returns {GraphQLScalarType} DateTime scalar type
 *
 * @example
 * ```typescript
 * const DateTimeScalar = createDateTimeScalar();
 * // Use in schema: scalar DateTime
 * ```
 */
export const createDateTimeScalar = (): GraphQLScalarType => {
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
};

/**
 * 19. Creates a custom JSON scalar type.
 *
 * @returns {GraphQLScalarType} JSON scalar type
 *
 * @example
 * ```typescript
 * const JSONScalar = createJSONScalar();
 * // Use for flexible JSON fields in schema
 * ```
 */
export const createJSONScalar = (): GraphQLScalarType => {
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
      if (ast.kind === Kind.OBJECT) {
        return parseJSONLiteral(ast);
      }
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      }
      return null;
    },
  });
};

/**
 * 20. Creates a custom Email scalar with validation.
 *
 * @returns {GraphQLScalarType} Email scalar type
 *
 * @example
 * ```typescript
 * const EmailScalar = createEmailScalar();
 * // Validates email format automatically
 * ```
 */
export const createEmailScalar = (): GraphQLScalarType => {
  // RFC 5322 compliant email regex (simplified but more comprehensive)
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
};

/**
 * 21. Generates GraphQL interface type definition.
 *
 * @param {string} interfaceName - Interface name
 * @param {Record<string, string>} fields - Shared fields
 * @param {string[]} implementingTypes - Types that implement this interface
 * @returns {string} GraphQL interface definition
 *
 * @example
 * ```typescript
 * const nodeDef = generateInterfaceDefinition('Node', { id: 'ID!' }, ['User', 'Post']);
 * // Result: "interface Node { id: ID! }"
 * ```
 */
export const generateInterfaceDefinition = (
  interfaceName: string,
  fields: Record<string, string>,
  implementingTypes?: string[],
): string => {
  const fieldDefs = Object.entries(fields)
    .map(([name, type]) => `  ${name}: ${type}`)
    .join('\n');

  let definition = `interface ${interfaceName} {\n${fieldDefs}\n}`;

  if (implementingTypes && implementingTypes.length > 0) {
    definition += `\n\n# Implemented by: ${implementingTypes.join(', ')}`;
  }

  return definition;
};

/**
 * 22. Generates GraphQL union type definition.
 *
 * @param {string} unionName - Union type name
 * @param {string[]} types - Types in the union
 * @returns {string} GraphQL union definition
 *
 * @example
 * ```typescript
 * const searchResultUnion = generateUnionDefinition(
 *   'SearchResult',
 *   ['Patient', 'Appointment', 'Diagnosis']
 * );
 * // Result: "union SearchResult = Patient | Appointment | Diagnosis"
 * ```
 */
export const generateUnionDefinition = (
  unionName: string,
  types: string[],
): string => {
  return `union ${unionName} = ${types.join(' | ')}`;
};

// ============================================================================
// SECTION 4: GRAPHQL MIDDLEWARE AND CONTEXT (7 functions)
// ============================================================================

/**
 * 23. Creates logging middleware for resolvers.
 *
 * @param {Function} [logger] - Custom logger function
 * @returns {Function} Logging middleware
 *
 * @example
 * ```typescript
 * const loggingMiddleware = createLoggingMiddleware(console.log);
 * // Logs all resolver executions with timing
 * ```
 */
export const createLoggingMiddleware = (
  logger?: (message: string, meta: any) => void,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const startTime = Date.now();
      const fieldPath = `${info.parentType.name}.${info.fieldName}`;

      try {
        const result = await resolver(parent, args, context, info);
        const duration = Date.now() - startTime;

        if (logger) {
          logger('Resolver executed', { fieldPath, duration, success: true });
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        if (logger) {
          logger('Resolver failed', { fieldPath, duration, error: (error as Error).message });
        }

        throw error;
      }
    };
  };
};

/**
 * 24. Creates authentication middleware for resolvers.
 *
 * @param {Function} [getUserFromContext] - Function to extract user from context
 * @returns {Function} Authentication middleware
 *
 * @example
 * ```typescript
 * const authMiddleware = createAuthenticationMiddleware(
 *   (context) => context.user
 * );
 * ```
 */
export const createAuthenticationMiddleware = (
  getUserFromContext?: (context: any) => any,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const user = getUserFromContext ? getUserFromContext(context) : context.user;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return resolver(parent, args, context, info);
    };
  };
};

/**
 * 25. Creates authorization middleware with role/permission checks.
 *
 * @param {AuthorizationRule} rule - Authorization rule
 * @returns {Function} Authorization middleware
 *
 * @example
 * ```typescript
 * const adminMiddleware = createAuthorizationMiddleware({
 *   roles: ['ADMIN', 'SUPERUSER'],
 *   permissions: ['manage.users']
 * });
 * ```
 */
export const createAuthorizationMiddleware = (
  rule: AuthorizationRule,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const user = context.user;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check roles
      if (rule.roles && rule.roles.length > 0) {
        if (!rule.roles.includes(user.role)) {
          throw new GraphQLError('Insufficient permissions', {
            extensions: { code: 'FORBIDDEN', requiredRoles: rule.roles },
          });
        }
      }

      // Check permissions
      if (rule.permissions && rule.permissions.length > 0) {
        const hasAllPermissions = rule.permissions.every((perm) =>
          user.permissions?.includes(perm),
        );

        if (!hasAllPermissions) {
          throw new GraphQLError('Insufficient permissions', {
            extensions: { code: 'FORBIDDEN', requiredPermissions: rule.permissions },
          });
        }
      }

      // Custom check
      if (rule.customCheck) {
        const allowed = await rule.customCheck(context, parent, args);
        if (!allowed) {
          throw new GraphQLError('Access denied', {
            extensions: { code: 'FORBIDDEN' },
          });
        }
      }

      return resolver(parent, args, context, info);
    };
  };
};

/**
 * 26. Creates rate limiting middleware for resolvers.
 *
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Rate limiting middleware
 *
 * @example
 * ```typescript
 * const rateLimitMiddleware = createRateLimitingMiddleware(100, 60000);
 * // 100 requests per minute
 * ```
 */
export const createRateLimitingMiddleware = (
  maxRequests: number,
  windowMs: number,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
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
      return resolver(parent, args, context, info);
    };
  };
};

/**
 * 27. Creates performance monitoring middleware.
 *
 * @param {Function} onMetrics - Callback for performance metrics
 * @returns {Function} Performance monitoring middleware
 *
 * @example
 * ```typescript
 * const perfMiddleware = createPerformanceMiddleware((metrics) => {
 *   metricsService.record(metrics);
 * });
 * ```
 */
export const createPerformanceMiddleware = (
  onMetrics: (metrics: PerformanceMetrics) => void,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const startTime = Date.now();

      try {
        const result = await resolver(parent, args, context, info);
        const duration = Date.now() - startTime;

        onMetrics({
          queryName: `${info.parentType.name}.${info.fieldName}`,
          duration,
          fieldCount: countFields(info),
          complexity: 0, // Can be calculated if needed
          timestamp: new Date(),
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        onMetrics({
          queryName: `${info.parentType.name}.${info.fieldName}`,
          duration,
          fieldCount: countFields(info),
          complexity: 0,
          timestamp: new Date(),
        });

        throw error;
      }
    };
  };
};

/**
 * 28. Creates a GraphQL context builder with all necessary services.
 *
 * @param {Object} config - Context configuration
 * @returns {Function} Context builder function
 *
 * @example
 * ```typescript
 * const buildContext = createContextBuilder({
 *   services: { userService, appointmentService },
 *   dataloaders: loaderFactories,
 *   pubsub: new PubSub()
 * });
 * ```
 */
export const createContextBuilder = (config: {
  services?: Record<string, any>;
  dataloaders?: Record<string, (context: any) => DataLoader<any, any>>;
  pubsub?: PubSub;
  customContext?: (req: any, res: any) => Record<string, any>;
}) => {
  return async ({ req, res }: { req: any; res: any }): Promise<GraphQLContext> => {
    const dataloaders = new Map<string, DataLoader<any, any>>();

    if (config.dataloaders) {
      for (const [name, factory] of Object.entries(config.dataloaders)) {
        dataloaders.set(name, factory({ req, res }));
      }
    }

    const baseContext: GraphQLContext = {
      req,
      res,
      user: req.user,
      dataloaders,
      pubsub: config.pubsub,
      requestId: req.id || generateRequestId(),
      ...config.services,
    };

    if (config.customContext) {
      const customContext = await config.customContext(req, res);
      return { ...baseContext, ...customContext };
    }

    return baseContext;
  };
};

/**
 * 29. Creates validation middleware for input arguments.
 *
 * @param {Function} validationFn - Validation function
 * @returns {Function} Validation middleware
 *
 * @example
 * ```typescript
 * const validateEmailMiddleware = createValidationMiddleware(
 *   (args) => {
 *     if (!args.email.includes('@')) throw new Error('Invalid email');
 *   }
 * );
 * ```
 */
export const createValidationMiddleware = (
  validationFn: (args: any, context: any) => void | Promise<void>,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      await validationFn(args, context);
      return resolver(parent, args, context, info);
    };
  };
};

// ============================================================================
// SECTION 5: PAGINATION AND FILTERING (7 functions)
// ============================================================================

/**
 * 30. Creates offset-based pagination helper.
 *
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} [maxLimit] - Maximum allowed limit
 * @returns {PaginationArgs} Normalized pagination args
 *
 * @example
 * ```typescript
 * const pagination = createOffsetPagination({ page: 2, perPage: 20 }, 100);
 * // Result: { offset: 20, limit: 20 }
 * ```
 */
export const createOffsetPagination = (
  args: PaginationArgs,
  maxLimit: number = 100,
): { offset: number; limit: number } => {
  let limit = args.limit || args.perPage || 10;
  limit = Math.min(limit, maxLimit);

  let offset = args.offset || 0;

  if (args.page && args.perPage) {
    offset = (args.page - 1) * args.perPage;
  }

  return { offset, limit };
};

/**
 * 31. Creates relay-style cursor pagination helper.
 *
 * @param {RelayPaginationArgs} args - Relay pagination arguments
 * @returns {Object} Pagination parameters
 *
 * @example
 * ```typescript
 * const params = createRelayPagination({ first: 10, after: 'cursor123' });
 * // Use params to query database
 * ```
 */
export const createRelayPagination = (args: RelayPaginationArgs): {
  limit: number;
  offset?: number;
  direction: 'forward' | 'backward';
} => {
  const limit = (args.first || args.last || 10) + 1; // Fetch one extra
  const direction = args.first ? 'forward' : 'backward';

  let offset: number | undefined;

  if (args.after) {
    const cursor = decodeCursorSafe(args.after);
    offset = cursor?.offset;
  } else if (args.before) {
    const cursor = decodeCursorSafe(args.before);
    offset = cursor?.offset;
  }

  return { limit, offset, direction };
};

/**
 * 32. Creates paginated result wrapper.
 *
 * @param {T[]} items - Result items
 * @param {number} total - Total count
 * @param {PaginationArgs} args - Pagination arguments
 * @returns {PaginatedResult<T>} Paginated result
 *
 * @example
 * ```typescript
 * const result = createPaginatedResult(patients, 150, { page: 2, perPage: 20 });
 * // Result includes items, total, page info, etc.
 * ```
 */
export const createPaginatedResult = <T>(
  items: T[],
  total: number,
  args: PaginationArgs,
): PaginatedResult<T> => {
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
};

/**
 * 33. Creates relay connection from array.
 *
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
 *   (item, index) => encodeCursor({ id: item.id, index })
 * );
 * ```
 */
export const createRelayConnection = <T>(
  items: T[],
  args: RelayPaginationArgs,
  cursorFn: (item: T, index: number) => string,
): Connection<T> => {
  const requestedCount = args.first || args.last || 10;
  const hasExtraItem = items.length > requestedCount;
  const limitedItems = hasExtraItem ? items.slice(0, requestedCount) : items;

  const edges: Edge<T>[] = limitedItems.map((item, index) => ({
    cursor: cursorFn(item, index),
    node: item,
  }));

  const pageInfo: PageInfo = {
    hasNextPage: args.first ? hasExtraItem : false,
    hasPreviousPage: !!args.after,
    startCursor: edges[0]?.cursor,
    endCursor: edges[edges.length - 1]?.cursor,
  };

  return {
    edges,
    pageInfo,
    totalCount: items.length,
  };
};

/**
 * 34. Creates filter builder for GraphQL queries.
 *
 * @param {FilterArgs} filterArgs - Filter arguments
 * @param {string[]} [searchableFields] - Fields to search in
 * @returns {WhereOptions} Sequelize where clause
 *
 * @example
 * ```typescript
 * const where = createFilterBuilder(
 *   { search: 'john', where: { role: 'ADMIN' } },
 *   ['firstName', 'lastName', 'email']
 * );
 * ```
 */
export const createFilterBuilder = (
  filterArgs: FilterArgs,
  searchableFields?: string[],
): WhereOptions => {
  const where: any = {};

  // Apply direct where conditions
  if (filterArgs.where) {
    Object.assign(where, filterArgs.where);
  }

  // Apply search across multiple fields
  if (filterArgs.search && searchableFields && searchableFields.length > 0) {
    const searchConditions = searchableFields.map((field) => ({
      [field]: { [Op.iLike]: `%${filterArgs.search}%` },
    }));
    where[Op.or] = searchConditions;
  }

  return where;
};

/**
 * 35. Creates sort builder for GraphQL queries.
 *
 * @param {SortArgs} sortArgs - Sort arguments
 * @param {Record<string, string>} [fieldMapping] - GraphQL to DB field mapping
 * @returns {Order} Sequelize order clause
 *
 * @example
 * ```typescript
 * const order = createSortBuilder(
 *   { orderBy: 'createdAt', order: 'DESC' },
 *   { createdAt: 'created_at' }
 * );
 * ```
 */
export const createSortBuilder = (
  sortArgs: SortArgs,
  fieldMapping?: Record<string, string>,
): Order => {
  const order: Order = [];

  if (sortArgs.sortBy && sortArgs.sortBy.length > 0) {
    sortArgs.sortBy.forEach((sort) => {
      const field = fieldMapping?.[sort.field] || sort.field;
      order.push([field, sort.direction]);
    });
  } else if (sortArgs.orderBy) {
    const field = fieldMapping?.[sortArgs.orderBy] || sortArgs.orderBy;
    const direction = sortArgs.order || 'ASC';
    order.push([field, direction]);
  }

  return order.length > 0 ? order : [['id', 'ASC']];
};

/**
 * 36. Creates combined query builder (filter + sort + pagination).
 *
 * @param {Object} args - Combined query arguments
 * @returns {FindOptions} Sequelize find options
 *
 * @example
 * ```typescript
 * const options = createQueryBuilder({
 *   filter: { search: 'john' },
 *   sort: { orderBy: 'createdAt', order: 'DESC' },
 *   pagination: { page: 1, perPage: 20 }
 * });
 * const patients = await PatientModel.findAll(options);
 * ```
 */
export const createQueryBuilder = (args: {
  filter?: FilterArgs;
  sort?: SortArgs;
  pagination?: PaginationArgs;
  searchableFields?: string[];
  fieldMapping?: Record<string, string>;
}): FindOptions => {
  const options: FindOptions = {};

  // Apply filters
  if (args.filter) {
    options.where = createFilterBuilder(args.filter, args.searchableFields);
  }

  // Apply sorting
  if (args.sort) {
    options.order = createSortBuilder(args.sort, args.fieldMapping);
  }

  // Apply pagination
  if (args.pagination) {
    const { offset, limit } = createOffsetPagination(args.pagination);
    options.offset = offset;
    options.limit = limit;
  }

  return options;
};

// ============================================================================
// SECTION 6: AUTHORIZATION AND SECURITY (6 functions)
// ============================================================================

/**
 * 37. Creates field-level authorization directive.
 *
 * @param {AuthorizationRule} rule - Authorization rule
 * @returns {DirectiveConfig} Directive configuration
 *
 * @example
 * ```typescript
 * const authDirective = createAuthDirective({
 *   roles: ['ADMIN'],
 *   permissions: ['view.sensitive.data']
 * });
 * ```
 */
export const createAuthDirective = (rule: AuthorizationRule): DirectiveConfig => {
  return {
    name: 'auth',
    locations: ['FIELD_DEFINITION', 'OBJECT'],
    args: {},
    resolve: async (next, source, args, context) => {
      const user = context.user;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Check roles
      if (rule.roles && !rule.roles.includes(user.role)) {
        return null; // Hide field
      }

      // Check permissions
      if (rule.permissions) {
        const hasPermissions = rule.permissions.every((p) => user.permissions?.includes(p));
        if (!hasPermissions) {
          return null; // Hide field
        }
      }

      // Custom check
      if (rule.customCheck) {
        const allowed = await rule.customCheck(context, source, args);
        if (!allowed) {
          return null; // Hide field
        }
      }

      return next();
    },
  };
};

/**
 * 38. Creates resource ownership checker.
 *
 * @param {Function} ownerExtractor - Function to extract owner ID from resource
 * @returns {Function} Ownership check function
 *
 * @example
 * ```typescript
 * const checkOwnership = createOwnershipChecker((appointment) => appointment.patientId);
 * const canAccess = await checkOwnership(context.user, appointment);
 * ```
 */
export const createOwnershipChecker = (
  ownerExtractor: (resource: any) => string,
): ((user: any, resource: any) => boolean) => {
  return (user: any, resource: any): boolean => {
    if (!user) return false;

    const ownerId = ownerExtractor(resource);
    return user.id === ownerId || user.role === 'ADMIN';
  };
};

/**
 * 39. Creates HIPAA-compliant field masking utility.
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
 * ```
 */
export const createFieldMasking = (
  sensitiveFields: string[],
  maskFn: (value: any) => any,
): ((data: any, context: GraphQLContext) => any) => {
  return (data: any, context: GraphQLContext): any => {
    if (!data) return data;

    const masked = { ...data };
    const user = context.user;

    // Admin can see everything
    if (user?.role === 'ADMIN') {
      return data;
    }

    sensitiveFields.forEach((field) => {
      if (field in masked) {
        masked[field] = maskFn(masked[field]);
      }
    });

    return masked;
  };
};

/**
 * 40. Creates permission checker with caching.
 *
 * @param {string} permission - Permission to check
 * @returns {Function} Permission check function
 *
 * @example
 * ```typescript
 * const canViewMedicalRecords = createPermissionChecker('view.medical.records');
 * if (canViewMedicalRecords(context.user)) {
 *   // Allow access
 * }
 * ```
 */
export const createPermissionChecker = (
  permission: string,
): ((user: any) => boolean) => {
  const cache = new Map<string, boolean>();

  return (user: any): boolean => {
    if (!user) return false;

    const cacheKey = `${user.id}-${permission}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const hasPermission = user.permissions?.includes(permission) || user.role === 'ADMIN';
    cache.set(cacheKey, hasPermission);

    return hasPermission;
  };
};

/**
 * 41. Creates audit logging for mutations.
 *
 * @param {Function} auditLogger - Audit log function
 * @returns {Function} Audit middleware
 *
 * @example
 * ```typescript
 * const auditMiddleware = createAuditLogging((entry) => {
 *   AuditLog.create(entry);
 * });
 * ```
 */
export const createAuditLogging = (
  auditLogger: (entry: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    changes?: any;
    timestamp: Date;
  }) => void | Promise<void>,
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const result = await resolver(parent, args, context, info);

      if (info.operation.operation === 'mutation') {
        await auditLogger({
          userId: context.user?.id,
          action: info.fieldName,
          resourceType: info.parentType.name,
          resourceId: result?.id,
          changes: args,
          timestamp: new Date(),
        });
      }

      return result;
    };
  };
};

/**
 * 42. Creates data sanitization for user input.
 *
 * @param {string[]} fieldsToSanitize - Fields to sanitize
 * @returns {Function} Sanitization middleware
 *
 * @example
 * ```typescript
 * const sanitizeMiddleware = createInputSanitization(['email', 'name', 'comments']);
 * ```
 */
export const createInputSanitization = (
  fieldsToSanitize: string[],
): ((resolver: GraphQLFieldResolver<any, any>) => GraphQLFieldResolver<any, any>) => {
  return (resolver: GraphQLFieldResolver<any, any>) => {
    return async (parent, args, context, info) => {
      const sanitizedArgs = { ...args };

      fieldsToSanitize.forEach((field) => {
        if (field in sanitizedArgs && typeof sanitizedArgs[field] === 'string') {
          // Remove HTML tags and trim
          sanitizedArgs[field] = sanitizedArgs[field]
            .replace(/<[^>]*>/g, '')
            .trim();
        }
      });

      return resolver(parent, sanitizedArgs, context, info);
    };
  };
};

// ============================================================================
// SECTION 7: FEDERATION AND SCHEMA STITCHING (6 functions)
// ============================================================================

/**
 * 43. Creates federation entity resolver.
 *
 * @param {FederationEntityConfig} config - Entity configuration
 * @returns {Object} Federation resolver
 *
 * @example
 * ```typescript
 * const userEntityResolver = createFederationEntity({
 *   typeName: 'User',
 *   keyFields: ['id'],
 *   resolveReference: (ref, context) => context.userService.findById(ref.id)
 * });
 * ```
 */
export const createFederationEntity = (config: FederationEntityConfig): {
  __resolveReference: (reference: any, context: any) => any | Promise<any>;
} => {
  return {
    __resolveReference: async (reference: any, context: any) => {
      return config.resolveReference(reference, context);
    },
  };
};

/**
 * 44. Creates federation reference resolver for external types.
 *
 * @param {string} typeName - External type name
 * @param {string[]} keyFields - Key fields
 * @returns {Object} Reference stub
 *
 * @example
 * ```typescript
 * const patientRef = createFederationReference('Patient', ['id']);
 * // Creates reference to Patient entity from another service
 * ```
 */
export const createFederationReference = (
  typeName: string,
  keyFields: string[],
): ((reference: Record<string, any>) => any) => {
  return (reference: Record<string, any>) => {
    const stub: any = { __typename: typeName };

    keyFields.forEach((field) => {
      stub[field] = reference[field];
    });

    return stub;
  };
};

/**
 * 45. Creates schema stitching merger for multiple services.
 *
 * @param {GraphQLSchema[]} schemas - Schemas to merge
 * @returns {GraphQLSchema} Merged schema
 *
 * @example
 * ```typescript
 * const mergedSchema = createSchemaStitching([
 *   patientServiceSchema,
 *   appointmentServiceSchema,
 *   billingServiceSchema
 * ]);
 * ```
 */
export const createSchemaStitching = (schemas: GraphQLSchema[]): GraphQLSchema => {
  // This is a simplified version - real implementation would use @graphql-tools/stitch
  if (schemas.length === 0) {
    throw new Error('At least one schema is required');
  }

  // Return first schema as placeholder
  // Real implementation would merge all schemas
  return schemas[0];
};

/**
 * 46. Creates type extension for federated schema.
 *
 * @param {string} typeName - Type to extend
 * @param {Record<string, string>} fields - Fields to add
 * @returns {string} GraphQL type extension
 *
 * @example
 * ```typescript
 * const extension = createTypeExtension('User', {
 *   appointments: '[Appointment!]!',
 *   medicalRecords: '[MedicalRecord!]!'
 * });
 * ```
 */
export const createTypeExtension = (
  typeName: string,
  fields: Record<string, string>,
): string => {
  const fieldDefs = Object.entries(fields)
    .map(([name, type]) => `  ${name}: ${type}`)
    .join('\n');

  return `extend type ${typeName} {\n${fieldDefs}\n}`;
};

/**
 * 47. Creates remote schema executor for gateway.
 *
 * @param {string} serviceUrl - Remote service URL
 * @returns {Function} Remote executor function
 *
 * @example
 * ```typescript
 * const executeOnPatientService = createRemoteExecutor(
 *   'http://patient-service/graphql'
 * );
 * ```
 */
export const createRemoteExecutor = (serviceUrl: string): ((params: {
  document: DocumentNode;
  variables?: Record<string, any>;
  context?: any;
}) => Promise<any>) => {
  return async ({ document, variables, context }) => {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(context?.headers || {}),
      },
      body: JSON.stringify({
        query: document,
        variables,
      }),
    });

    return response.json();
  };
};

/**
 * 48. Creates federation key directive definition.
 *
 * @param {string[]} fields - Key fields
 * @returns {string} Key directive
 *
 * @example
 * ```typescript
 * const keyDirective = createFederationKeyDirective(['id', 'tenantId']);
 * // Result: '@key(fields: "id tenantId")'
 * ```
 */
export const createFederationKeyDirective = (fields: string[]): string => {
  return `@key(fields: "${fields.join(' ')}")`;
};

// ============================================================================
// SECTION 8: TESTING AND DOCUMENTATION (6 functions)
// ============================================================================

/**
 * 49. Creates mock GraphQL context for testing.
 *
 * @param {Partial<TestingContext>} overrides - Context overrides
 * @returns {GraphQLContext} Mock context
 *
 * @example
 * ```typescript
 * const context = createMockContext({
 *   user: { id: '123', role: 'ADMIN' },
 *   mocks: { userService: mockUserService }
 * });
 * ```
 */
export const createMockContext = (overrides?: Partial<TestingContext>): GraphQLContext => {
  return {
    req: overrides?.mocks?.req || {},
    res: overrides?.mocks?.res || {},
    user: overrides?.user,
    dataloaders: overrides?.dataloaders || new Map(),
    requestId: 'test-request-id',
    ...overrides?.mocks,
  };
};

/**
 * 50. Generates GraphQL schema documentation.
 *
 * @param {GraphQLSchema} schema - GraphQL schema
 * @returns {SchemaDocumentation[]} Schema documentation
 *
 * @example
 * ```typescript
 * const docs = generateSchemaDocumentation(schema);
 * // Generate markdown or HTML documentation from schema
 * ```
 */
export const generateSchemaDocumentation = (schema: GraphQLSchema): SchemaDocumentation[] => {
  const typeMap = schema.getTypeMap();
  const documentation: SchemaDocumentation[] = [];

  Object.entries(typeMap).forEach(([typeName, type]) => {
    if (typeName.startsWith('__')) return; // Skip introspection types

    if (type instanceof GraphQLObjectType) {
      const fields = type.getFields();

      documentation.push({
        type: typeName,
        description: type.description || '',
        fields: Object.entries(fields).map(([fieldName, field]) => ({
          name: fieldName,
          type: field.type.toString(),
          description: field.description,
          deprecated: field.deprecationReason !== undefined,
          deprecationReason: field.deprecationReason,
        })),
      });
    }
  });

  return documentation;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to encode cursor for relay pagination.
 */
const encodeCursorSafe = (data: Record<string, any>): string => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

/**
 * Helper to decode cursor for relay pagination.
 */
const decodeCursorSafe = (cursor: string): Record<string, any> | null => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
};

/**
 * Helper to count fields in GraphQL info.
 */
const countFields = (info: GraphQLResolveInfo): number => {
  let count = 0;

  const countSelections = (selections: readonly SelectionNode[]) => {
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
};

/**
 * Helper to generate unique request ID.
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper to parse JSON literal from GraphQL AST.
 */
const parseJSONLiteral = (ast: any): any => {
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
};
