/**
 * LOC: GQLS1234567
 * File: /reuse/nestjs-graphql-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - GraphQL resolvers and services
 *   - GraphQL schema builders
 *   - GraphQL middleware and guards
 */

/**
 * File: /reuse/nestjs-graphql-schema-kit.ts
 * Locator: WC-UTL-GQLS-001
 * Purpose: Comprehensive NestJS GraphQL Utilities - Schema generation, resolvers, DataLoader, subscriptions, complexity
 *
 * Upstream: Independent utility module for GraphQL schema design and implementation
 * Downstream: ../backend/*, GraphQL resolvers, services, guards, middleware
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/graphql, graphql, dataloader
 * Exports: 45 utility functions for GraphQL schemas, resolvers, DataLoader, subscriptions, complexity, authorization
 *
 * LLM Context: Comprehensive GraphQL utilities for implementing production-ready GraphQL APIs in White Cross system.
 * Provides schema builders, resolver factories, DataLoader patterns, N+1 prevention, subscription helpers, custom scalars,
 * directive builders, federation support, query complexity analysis, authorization decorators, and context builders.
 * Essential for building performant, secure, and scalable healthcare GraphQL APIs with HIPAA compliance.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import { ExecutionContext, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';
import DataLoader from 'dataloader';

interface GraphQLContext {
  req?: any;
  res?: any;
  connection?: any;
  user?: any;
  dataloaders?: Map<string, DataLoader<any, any>>;
  sequelize?: Sequelize;
  [key: string]: any;
}

interface PaginationArgs {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  skip?: number;
  limit?: number;
}

interface ConnectionEdge<T> {
  node: T;
  cursor: string;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

interface Connection<T> {
  edges: ConnectionEdge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}

interface ResolverOptions {
  nullable?: boolean;
  complexity?: number;
  description?: string;
  deprecationReason?: string;
}

interface DataLoaderBatchFunction<K, V> {
  (keys: readonly K[]): Promise<(V | Error)[]>;
}

interface ComplexityEstimatorArgs {
  type: any;
  field: any;
  args: Record<string, any>;
  childComplexity: number;
}

interface SubscriptionConfig {
  topics: string | string[];
  filter?: (payload: any, variables: any, context: any) => boolean | Promise<boolean>;
  resolve?: (payload: any) => any;
}

interface FieldMiddleware {
  (context: any, next: () => Promise<any>): Promise<any>;
}

interface AuthorizationRule {
  roles?: string[];
  permissions?: string[];
  customCheck?: (context: GraphQLContext) => boolean | Promise<boolean>;
}

interface QueryComplexityConfig {
  maximumComplexity: number;
  estimators?: any[];
  onComplete?: (complexity: number) => void;
}

interface SchemaDirectiveConfig {
  name: string;
  locations: string[];
  args?: Record<string, any>;
  implementation?: (schema: any, directiveName: string) => void;
}

interface FieldResolverConfig<T> {
  fieldName: string;
  typeFn: () => Type<any>;
  options?: ResolverOptions;
  resolver: (parent: T, args?: any, context?: GraphQLContext) => any;
}

// ============================================================================
// SECTION 1: SCHEMA GENERATION UTILITIES (Functions 1-8)
// ============================================================================

/**
 * 1. Creates a relay-style connection type for cursor-based pagination.
 *
 * @param {T[]} nodes - Array of nodes to paginate
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} totalCount - Total count of items
 * @returns {Connection<T>} Relay connection object
 *
 * @example
 * ```typescript
 * const connection = createConnection(users, { first: 10, after: 'cursor123' }, 100);
 * // Result: { edges: [...], pageInfo: {...}, totalCount: 100 }
 * ```
 */
export const createConnection = <T>(
  nodes: T[],
  args: PaginationArgs,
  totalCount: number,
): Connection<T> => {
  const edges = nodes.map((node, index) => ({
    node,
    cursor: encodeCursor({ index, id: (node as any).id }),
  }));

  const startCursor = edges.length > 0 ? edges[0].cursor : undefined;
  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : undefined;

  return {
    edges,
    pageInfo: {
      hasNextPage: args.first ? nodes.length === args.first : false,
      hasPreviousPage: !!args.after || !!args.before,
      startCursor,
      endCursor,
    },
    totalCount,
  };
};

/**
 * 2. Encodes cursor data to base64 string for relay pagination.
 *
 * @param {Record<string, any>} data - Cursor data object
 * @returns {string} Base64 encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor({ id: 123, timestamp: Date.now() });
 * // Result: 'eyJpZCI6MTIzLCJ0aW1lc3RhbXAiOjE2OTk5OTk5OTl9'
 * ```
 */
export const encodeCursor = (data: Record<string, any>): string => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

/**
 * 3. Decodes base64 cursor string to object.
 *
 * @param {string} cursor - Base64 encoded cursor
 * @returns {Record<string, any>} Decoded cursor data
 *
 * @example
 * ```typescript
 * const data = decodeCursor('eyJpZCI6MTIzfQ==');
 * // Result: { id: 123 }
 * ```
 */
export const decodeCursor = (cursor: string): Record<string, any> => {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
  } catch (error) {
    throw new Error('Invalid cursor format');
  }
};

/**
 * 4. Calculates offset and limit from relay pagination arguments.
 *
 * @param {PaginationArgs} args - Pagination arguments
 * @param {number} [defaultLimit=10] - Default page size
 * @returns {{ offset: number; limit: number }} Offset and limit values
 *
 * @example
 * ```typescript
 * const { offset, limit } = getPaginationOffset({ first: 20, after: 'cursor123' });
 * // Result: { offset: 10, limit: 20 }
 * ```
 */
export const getPaginationOffset = (
  args: PaginationArgs,
  defaultLimit: number = 10,
): { offset: number; limit: number } => {
  const limit = args.first || args.last || args.limit || defaultLimit;
  let offset = args.skip || 0;

  if (args.after) {
    try {
      const cursorData = decodeCursor(args.after);
      offset = (cursorData.index || 0) + 1;
    } catch (error) {
      offset = 0;
    }
  }

  return { offset, limit };
};

/**
 * 5. Builds GraphQL field configuration object.
 *
 * @param {string} fieldName - Name of the field
 * @param {() => Type<any>} typeFn - Type function
 * @param {ResolverOptions} [options] - Field options
 * @returns {Record<string, any>} Field configuration
 *
 * @example
 * ```typescript
 * const fieldConfig = buildFieldConfig('users', () => [User], {
 *   nullable: false,
 *   complexity: 10,
 *   description: 'List of users'
 * });
 * ```
 */
export const buildFieldConfig = (
  fieldName: string,
  typeFn: () => Type<any>,
  options?: ResolverOptions,
): Record<string, any> => {
  return {
    name: fieldName,
    type: typeFn,
    nullable: options?.nullable ?? true,
    complexity: options?.complexity ?? 1,
    description: options?.description,
    deprecationReason: options?.deprecationReason,
  };
};

/**
 * 6. Creates union type resolver function.
 *
 * @param {Map<string, Type<any>>} typeMap - Map of type names to classes
 * @returns {(value: any) => Type<any> | null} Union type resolver
 *
 * @example
 * ```typescript
 * const resolver = createUnionTypeResolver(new Map([
 *   ['User', UserType],
 *   ['Post', PostType]
 * ]));
 * const type = resolver({ __typename: 'User' });
 * ```
 */
export const createUnionTypeResolver = (
  typeMap: Map<string, Type<any>>,
): ((value: any) => Type<any> | null) => {
  return (value: any): Type<any> | null => {
    const typeName = value.__typename || value.constructor.name;
    return typeMap.get(typeName) || null;
  };
};

/**
 * 7. Builds schema directive configuration.
 *
 * @param {string} name - Directive name
 * @param {string[]} locations - Valid directive locations
 * @param {Record<string, any>} [args] - Directive arguments
 * @returns {SchemaDirectiveConfig} Directive configuration
 *
 * @example
 * ```typescript
 * const directive = buildSchemaDirective('auth', ['FIELD_DEFINITION'], {
 *   requires: { type: 'String' }
 * });
 * ```
 */
export const buildSchemaDirective = (
  name: string,
  locations: string[],
  args?: Record<string, any>,
): SchemaDirectiveConfig => {
  return {
    name,
    locations,
    args: args || {},
  };
};

/**
 * 8. Merges multiple GraphQL schemas into one.
 *
 * @param {any[]} schemas - Array of GraphQL schemas
 * @returns {any} Merged schema
 *
 * @example
 * ```typescript
 * const mergedSchema = mergeGraphQLSchemas([userSchema, postSchema, commentSchema]);
 * ```
 */
export const mergeGraphQLSchemas = (schemas: any[]): any => {
  // Simplified merge - in production, use graphql-tools
  return schemas.reduce((merged, schema) => {
    return {
      ...merged,
      ...schema,
      definitions: [...(merged.definitions || []), ...(schema.definitions || [])],
    };
  }, {});
};

// ============================================================================
// SECTION 2: DATALOADER UTILITIES (Functions 9-16)
// ============================================================================

/**
 * 9. Creates a DataLoader for batching database queries.
 *
 * @param {DataLoaderBatchFunction<K, V>} batchFn - Batch loading function
 * @param {boolean} [cache=true] - Enable caching
 * @returns {DataLoader<K, V>} DataLoader instance
 *
 * @example
 * ```typescript
 * const userLoader = createDataLoader(async (ids) => {
 *   const users = await User.findAll({ where: { id: ids } });
 *   return ids.map(id => users.find(u => u.id === id));
 * });
 * ```
 */
export const createDataLoader = <K, V>(
  batchFn: DataLoaderBatchFunction<K, V>,
  cache: boolean = true,
): DataLoader<K, V> => {
  return new DataLoader<K, V>(batchFn, {
    cache,
    batchScheduleFn: (callback) => setTimeout(callback, 1),
  });
};

/**
 * 10. Creates DataLoader for Sequelize model by primary key.
 *
 * @param {ModelCtor<T>} model - Sequelize model
 * @param {string} [keyField='id'] - Primary key field name
 * @returns {DataLoader<any, T>} DataLoader for model
 *
 * @example
 * ```typescript
 * const userLoader = createModelDataLoader(User);
 * const user = await userLoader.load(123);
 * ```
 */
export const createModelDataLoader = <T extends Model>(
  model: ModelCtor<T>,
  keyField: string = 'id',
): DataLoader<any, T | null> => {
  return new DataLoader<any, T | null>(async (keys) => {
    const items = await model.findAll({
      where: { [keyField]: keys as any[] } as any,
    });

    const itemMap = new Map(items.map((item) => [(item as any)[keyField], item]));
    return keys.map((key) => itemMap.get(key) || null);
  });
};

/**
 * 11. Creates DataLoader for one-to-many relationships.
 *
 * @param {ModelCtor<T>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field name
 * @returns {DataLoader<any, T[]>} DataLoader for relationship
 *
 * @example
 * ```typescript
 * const postsLoader = createOneToManyLoader(Post, 'userId');
 * const userPosts = await postsLoader.load(userId);
 * ```
 */
export const createOneToManyLoader = <T extends Model>(
  model: ModelCtor<T>,
  foreignKey: string,
): DataLoader<any, T[]> => {
  return new DataLoader<any, T[]>(async (parentIds) => {
    const items = await model.findAll({
      where: { [foreignKey]: parentIds as any[] } as any,
    });

    const itemsByParentId = new Map<any, T[]>();
    items.forEach((item) => {
      const parentId = (item as any)[foreignKey];
      if (!itemsByParentId.has(parentId)) {
        itemsByParentId.set(parentId, []);
      }
      itemsByParentId.get(parentId)!.push(item);
    });

    return parentIds.map((id) => itemsByParentId.get(id) || []);
  });
};

/**
 * 12. Creates DataLoader for many-to-many relationships through junction table.
 *
 * @param {ModelCtor<T>} model - Target model
 * @param {string} junctionTable - Junction table name
 * @param {string} sourceKey - Source foreign key
 * @param {string} targetKey - Target foreign key
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {DataLoader<any, T[]>} DataLoader for many-to-many
 *
 * @example
 * ```typescript
 * const tagsLoader = createManyToManyLoader(Tag, 'post_tags', 'postId', 'tagId', sequelize);
 * const postTags = await tagsLoader.load(postId);
 * ```
 */
export const createManyToManyLoader = <T extends Model>(
  model: ModelCtor<T>,
  junctionTable: string,
  sourceKey: string,
  targetKey: string,
  sequelize: Sequelize,
): DataLoader<any, T[]> => {
  return new DataLoader<any, T[]>(async (sourceIds) => {
    const query = `
      SELECT t.*, j.${sourceKey}
      FROM ${model.tableName} t
      INNER JOIN ${junctionTable} j ON t.id = j.${targetKey}
      WHERE j.${sourceKey} IN (:sourceIds)
    `;

    const results = await sequelize.query(query, {
      replacements: { sourceIds: sourceIds as any[] },
      model,
      mapToModel: true,
    });

    const itemsBySourceId = new Map<any, T[]>();
    (results as any[]).forEach((item) => {
      const sourceId = item[sourceKey];
      if (!itemsBySourceId.has(sourceId)) {
        itemsBySourceId.set(sourceId, []);
      }
      itemsBySourceId.get(sourceId)!.push(item as T);
    });

    return sourceIds.map((id) => itemsBySourceId.get(id) || []);
  });
};

/**
 * 13. Creates DataLoader with custom cache key function.
 *
 * @param {DataLoaderBatchFunction<K, V>} batchFn - Batch function
 * @param {(key: K) => string} cacheKeyFn - Cache key generator
 * @returns {DataLoader<K, V>} DataLoader with custom caching
 *
 * @example
 * ```typescript
 * const loader = createDataLoaderWithCacheKey(
 *   batchFn,
 *   (key) => `user:${key.id}:${key.tenant}`
 * );
 * ```
 */
export const createDataLoaderWithCacheKey = <K, V>(
  batchFn: DataLoaderBatchFunction<K, V>,
  cacheKeyFn: (key: K) => string,
): DataLoader<K, V> => {
  return new DataLoader<K, V>(batchFn, {
    cacheKeyFn,
    batchScheduleFn: (callback) => setTimeout(callback, 1),
  });
};

/**
 * 14. Primes DataLoader cache with pre-fetched data.
 *
 * @param {DataLoader<K, V>} loader - DataLoader instance
 * @param {V[]} items - Items to prime
 * @param {(item: V) => K} keyFn - Function to extract key from item
 * @returns {void}
 *
 * @example
 * ```typescript
 * const users = await User.findAll();
 * primeDataLoader(userLoader, users, (user) => user.id);
 * ```
 */
export const primeDataLoader = <K, V>(
  loader: DataLoader<K, V>,
  items: V[],
  keyFn: (item: V) => K,
): void => {
  items.forEach((item) => {
    loader.prime(keyFn(item), item);
  });
};

/**
 * 15. Clears DataLoader cache for specific keys.
 *
 * @param {DataLoader<K, V>} loader - DataLoader instance
 * @param {K[]} keys - Keys to clear
 * @returns {void}
 *
 * @example
 * ```typescript
 * clearDataLoaderCache(userLoader, [userId1, userId2]);
 * ```
 */
export const clearDataLoaderCache = <K, V>(
  loader: DataLoader<K, V>,
  keys: K[],
): void => {
  keys.forEach((key) => loader.clear(key));
};

/**
 * 16. Creates a map of DataLoaders for GraphQL context.
 *
 * @param {Record<string, () => DataLoader<any, any>>} loaderFactories - Loader factories
 * @returns {Map<string, DataLoader<any, any>>} Map of loaders
 *
 * @example
 * ```typescript
 * const loaders = createDataLoaderMap({
 *   user: () => createModelDataLoader(User),
 *   posts: () => createOneToManyLoader(Post, 'userId')
 * });
 * ```
 */
export const createDataLoaderMap = (
  loaderFactories: Record<string, () => DataLoader<any, any>>,
): Map<string, DataLoader<any, any>> => {
  const loaderMap = new Map<string, DataLoader<any, any>>();
  Object.entries(loaderFactories).forEach(([name, factory]) => {
    loaderMap.set(name, factory());
  });
  return loaderMap;
};

// ============================================================================
// SECTION 3: RESOLVER UTILITIES (Functions 17-24)
// ============================================================================

/**
 * 17. Extracts GraphQL execution context from NestJS execution context.
 *
 * @param {ExecutionContext} context - NestJS execution context
 * @returns {GraphQLContext} GraphQL context
 *
 * @example
 * ```typescript
 * const gqlContext = getGraphQLContext(executionContext);
 * const user = gqlContext.user;
 * ```
 */
export const getGraphQLContext = (context: ExecutionContext): GraphQLContext => {
  const gqlContext = GqlExecutionContext.create(context);
  return gqlContext.getContext<GraphQLContext>();
};

/**
 * 18. Extracts current user from GraphQL context.
 *
 * @param {GraphQLContext} context - GraphQL context
 * @returns {any | null} Current user or null
 *
 * @example
 * ```typescript
 * const user = getCurrentUser(context);
 * if (user) { console.log(user.id); }
 * ```
 */
export const getCurrentUser = (context: GraphQLContext): any | null => {
  return context.user || context.req?.user || null;
};

/**
 * 19. Creates a field resolver function with error handling.
 *
 * @param {Function} resolverFn - Resolver function
 * @param {string} [fieldName] - Field name for error context
 * @returns {Function} Wrapped resolver function
 *
 * @example
 * ```typescript
 * const resolver = createFieldResolver(
 *   async (parent, args, context) => {
 *     return await fetchData(parent.id);
 *   },
 *   'userData'
 * );
 * ```
 */
export const createFieldResolver = (
  resolverFn: Function,
  fieldName?: string,
): Function => {
  return async (...args: any[]) => {
    try {
      return await resolverFn(...args);
    } catch (error) {
      const errorMessage = fieldName
        ? `Error resolving field '${fieldName}': ${(error as Error).message}`
        : `Resolver error: ${(error as Error).message}`;
      throw new Error(errorMessage);
    }
  };
};

/**
 * 20. Creates a mutation resolver with validation and transaction support.
 *
 * @param {Function} mutationFn - Mutation function
 * @param {Function} [validateFn] - Validation function
 * @param {boolean} [useTransaction=true] - Use database transaction
 * @returns {Function} Mutation resolver
 *
 * @example
 * ```typescript
 * const createUser = createMutationResolver(
 *   async (input, context) => User.create(input),
 *   (input) => validateUserInput(input)
 * );
 * ```
 */
export const createMutationResolver = (
  mutationFn: Function,
  validateFn?: Function,
  useTransaction: boolean = true,
): Function => {
  return async (input: any, context: GraphQLContext) => {
    if (validateFn) {
      const validationResult = await validateFn(input);
      if (validationResult !== true) {
        throw new Error(
          typeof validationResult === 'string' ? validationResult : 'Validation failed',
        );
      }
    }

    if (useTransaction && context.sequelize) {
      return await context.sequelize.transaction(async (transaction) => {
        return await mutationFn(input, { ...context, transaction });
      });
    }

    return await mutationFn(input, context);
  };
};

/**
 * 21. Creates a batched field resolver using DataLoader.
 *
 * @param {string} loaderName - DataLoader name in context
 * @param {(parent: any) => any} keyFn - Function to extract key from parent
 * @returns {Function} Batched field resolver
 *
 * @example
 * ```typescript
 * const postsResolver = createBatchedResolver('postsLoader', (user) => user.id);
 * ```
 */
export const createBatchedResolver = (
  loaderName: string,
  keyFn: (parent: any) => any,
): Function => {
  return async (parent: any, args: any, context: GraphQLContext) => {
    const loader = context.dataloaders?.get(loaderName);
    if (!loader) {
      throw new Error(`DataLoader '${loaderName}' not found in context`);
    }
    const key = keyFn(parent);
    return await loader.load(key);
  };
};

/**
 * 22. Creates a resolver with caching support.
 *
 * @param {Function} resolverFn - Resolver function
 * @param {number} ttl - Cache TTL in seconds
 * @param {(args: any) => string} cacheKeyFn - Cache key generator
 * @returns {Function} Cached resolver
 *
 * @example
 * ```typescript
 * const resolver = createCachedResolver(
 *   fetchExpensiveData,
 *   3600,
 *   (args) => `data:${args.id}`
 * );
 * ```
 */
export const createCachedResolver = (
  resolverFn: Function,
  ttl: number,
  cacheKeyFn: (args: any) => string,
): Function => {
  const cache = new Map<string, { data: any; expires: number }>();

  return async (...args: any[]) => {
    const cacheKey = cacheKeyFn(args[1] || {});
    const now = Date.now();

    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const result = await resolverFn(...args);
    cache.set(cacheKey, {
      data: result,
      expires: now + ttl * 1000,
    });

    return result;
  };
};

/**
 * 23. Creates a paginated resolver with cursor support.
 *
 * @param {Function} fetchFn - Function to fetch paginated data
 * @returns {Function} Paginated resolver
 *
 * @example
 * ```typescript
 * const usersResolver = createPaginatedResolver(
 *   async (args) => User.findAll({ limit: args.first, offset: args.offset })
 * );
 * ```
 */
export const createPaginatedResolver = (fetchFn: Function): Function => {
  return async (parent: any, args: PaginationArgs, context: GraphQLContext) => {
    const { offset, limit } = getPaginationOffset(args);
    const items = await fetchFn({ ...args, offset, limit }, context);
    const totalCount = await fetchFn.count ? await fetchFn.count(args, context) : items.length;
    return createConnection(items, args, totalCount);
  };
};

/**
 * 24. Creates a resolver with authorization check.
 *
 * @param {Function} resolverFn - Resolver function
 * @param {AuthorizationRule} rule - Authorization rule
 * @returns {Function} Authorized resolver
 *
 * @example
 * ```typescript
 * const resolver = createAuthorizedResolver(
 *   fetchSensitiveData,
 *   { roles: ['admin', 'doctor'] }
 * );
 * ```
 */
export const createAuthorizedResolver = (
  resolverFn: Function,
  rule: AuthorizationRule,
): Function => {
  return async (...args: any[]) => {
    const context = args[2] as GraphQLContext;
    const user = getCurrentUser(context);

    if (!user) {
      throw new Error('Authentication required');
    }

    if (rule.roles && !rule.roles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }

    if (rule.permissions) {
      const userPermissions = user.permissions || [];
      const hasPermission = rule.permissions.some((p) => userPermissions.includes(p));
      if (!hasPermission) {
        throw new Error('Missing required permissions');
      }
    }

    if (rule.customCheck) {
      const isAuthorized = await rule.customCheck(context);
      if (!isAuthorized) {
        throw new Error('Authorization failed');
      }
    }

    return await resolverFn(...args);
  };
};

// ============================================================================
// SECTION 4: SUBSCRIPTION UTILITIES (Functions 25-30)
// ============================================================================

/**
 * 25. Creates a subscription filter function.
 *
 * @param {Function} filterFn - Filter predicate
 * @returns {Function} Subscription filter
 *
 * @example
 * ```typescript
 * const filter = createSubscriptionFilter(
 *   (payload, variables, context) => payload.userId === variables.userId
 * );
 * ```
 */
export const createSubscriptionFilter = (filterFn: Function): Function => {
  return async (payload: any, variables: any, context: GraphQLContext) => {
    try {
      return await filterFn(payload, variables, context);
    } catch (error) {
      console.error('Subscription filter error:', error);
      return false;
    }
  };
};

/**
 * 26. Creates a subscription resolver with authentication.
 *
 * @param {string} topic - PubSub topic
 * @param {Function} [filterFn] - Filter function
 * @param {boolean} [requireAuth=true] - Require authentication
 * @returns {SubscriptionConfig} Subscription configuration
 *
 * @example
 * ```typescript
 * const config = createAuthenticatedSubscription(
 *   'MESSAGE_SENT',
 *   (payload, vars) => payload.recipientId === vars.userId
 * );
 * ```
 */
export const createAuthenticatedSubscription = (
  topic: string,
  filterFn?: Function,
  requireAuth: boolean = true,
): SubscriptionConfig => {
  return {
    topics: topic,
    filter: async (payload, variables, context) => {
      if (requireAuth && !getCurrentUser(context)) {
        return false;
      }
      if (filterFn) {
        return await filterFn(payload, variables, context);
      }
      return true;
    },
  };
};

/**
 * 27. Creates a subscription with rate limiting.
 *
 * @param {string} topic - PubSub topic
 * @param {number} maxEventsPerMinute - Maximum events per minute
 * @returns {SubscriptionConfig} Rate-limited subscription
 *
 * @example
 * ```typescript
 * const config = createRateLimitedSubscription('NOTIFICATION', 60);
 * ```
 */
export const createRateLimitedSubscription = (
  topic: string,
  maxEventsPerMinute: number,
): SubscriptionConfig => {
  const eventCounts = new Map<string, { count: number; resetAt: number }>();

  return {
    topics: topic,
    filter: (payload, variables, context) => {
      const userId = context.user?.id || 'anonymous';
      const now = Date.now();
      const userEvents = eventCounts.get(userId);

      if (!userEvents || userEvents.resetAt < now) {
        eventCounts.set(userId, { count: 1, resetAt: now + 60000 });
        return true;
      }

      if (userEvents.count >= maxEventsPerMinute) {
        return false;
      }

      userEvents.count++;
      return true;
    },
  };
};

/**
 * 28. Creates subscription payload transformer.
 *
 * @param {Function} transformFn - Transform function
 * @returns {Function} Subscription resolver
 *
 * @example
 * ```typescript
 * const resolver = createSubscriptionTransform(
 *   (payload) => ({ ...payload.data, timestamp: new Date() })
 * );
 * ```
 */
export const createSubscriptionTransform = (transformFn: Function): Function => {
  return async (payload: any) => {
    try {
      return await transformFn(payload);
    } catch (error) {
      console.error('Subscription transform error:', error);
      return payload;
    }
  };
};

/**
 * 29. Creates a subscription with user-specific filtering.
 *
 * @param {string} topic - PubSub topic
 * @param {(payload: any) => any} userIdExtractor - Extract user ID from payload
 * @returns {SubscriptionConfig} User-filtered subscription
 *
 * @example
 * ```typescript
 * const config = createUserSubscription(
 *   'USER_UPDATED',
 *   (payload) => payload.userId
 * );
 * ```
 */
export const createUserSubscription = (
  topic: string,
  userIdExtractor: (payload: any) => any,
): SubscriptionConfig => {
  return {
    topics: topic,
    filter: (payload, variables, context) => {
      const currentUser = getCurrentUser(context);
      if (!currentUser) return false;
      const payloadUserId = userIdExtractor(payload);
      return currentUser.id === payloadUserId;
    },
  };
};

/**
 * 30. Creates a multi-topic subscription.
 *
 * @param {string[]} topics - Array of PubSub topics
 * @param {Function} [filterFn] - Optional filter function
 * @returns {SubscriptionConfig} Multi-topic subscription
 *
 * @example
 * ```typescript
 * const config = createMultiTopicSubscription(
 *   ['MESSAGE_SENT', 'MESSAGE_UPDATED', 'MESSAGE_DELETED']
 * );
 * ```
 */
export const createMultiTopicSubscription = (
  topics: string[],
  filterFn?: Function,
): SubscriptionConfig => {
  return {
    topics,
    filter: filterFn
      ? async (payload, variables, context) => await filterFn(payload, variables, context)
      : undefined,
  };
};

// ============================================================================
// SECTION 5: CONTEXT & MIDDLEWARE UTILITIES (Functions 31-36)
// ============================================================================

/**
 * 31. Creates GraphQL context builder function.
 *
 * @param {Record<string, any>} baseContext - Base context object
 * @param {Function[]} [enhancers] - Context enhancer functions
 * @returns {Function} Context builder
 *
 * @example
 * ```typescript
 * const contextBuilder = createContextBuilder(
 *   { sequelize },
 *   [(ctx) => ({ ...ctx, user: extractUser(ctx.req) })]
 * );
 * ```
 */
export const createContextBuilder = (
  baseContext: Record<string, any>,
  enhancers?: Function[],
): Function => {
  return async ({ req, res, connection }: any) => {
    let context: GraphQLContext = {
      ...baseContext,
      req,
      res,
      connection,
    };

    if (enhancers) {
      for (const enhancer of enhancers) {
        context = await enhancer(context);
      }
    }

    return context;
  };
};

/**
 * 32. Creates a field middleware for logging.
 *
 * @param {string} [logPrefix='Field'] - Log prefix
 * @returns {FieldMiddleware} Field middleware
 *
 * @example
 * ```typescript
 * const loggingMiddleware = createFieldLoggingMiddleware('GraphQL');
 * ```
 */
export const createFieldLoggingMiddleware = (logPrefix: string = 'Field'): FieldMiddleware => {
  return async (context: any, next: () => Promise<any>) => {
    const start = Date.now();
    const { info } = context;
    console.log(`[${logPrefix}] Resolving: ${info.parentType.name}.${info.fieldName}`);

    try {
      const result = await next();
      const duration = Date.now() - start;
      console.log(
        `[${logPrefix}] Resolved: ${info.parentType.name}.${info.fieldName} (${duration}ms)`,
      );
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `[${logPrefix}] Error: ${info.parentType.name}.${info.fieldName} (${duration}ms)`,
        error,
      );
      throw error;
    }
  };
};

/**
 * 33. Creates a field middleware for performance monitoring.
 *
 * @param {number} slowThreshold - Threshold in ms for slow queries
 * @param {Function} onSlow - Callback for slow queries
 * @returns {FieldMiddleware} Performance middleware
 *
 * @example
 * ```typescript
 * const perfMiddleware = createPerformanceMiddleware(
 *   1000,
 *   (fieldName, duration) => logger.warn(`Slow query: ${fieldName} (${duration}ms)`)
 * );
 * ```
 */
export const createPerformanceMiddleware = (
  slowThreshold: number,
  onSlow: (fieldName: string, duration: number) => void,
): FieldMiddleware => {
  return async (context: any, next: () => Promise<any>) => {
    const start = Date.now();
    const result = await next();
    const duration = Date.now() - start;

    if (duration > slowThreshold) {
      const { info } = context;
      onSlow(`${info.parentType.name}.${info.fieldName}`, duration);
    }

    return result;
  };
};

/**
 * 34. Creates a field middleware for caching.
 *
 * @param {number} ttl - Cache TTL in seconds
 * @param {(context: any) => string} cacheKeyFn - Cache key generator
 * @returns {FieldMiddleware} Caching middleware
 *
 * @example
 * ```typescript
 * const cacheMiddleware = createCachingMiddleware(
 *   300,
 *   (ctx) => `${ctx.info.fieldName}:${JSON.stringify(ctx.args)}`
 * );
 * ```
 */
export const createCachingMiddleware = (
  ttl: number,
  cacheKeyFn: (context: any) => string,
): FieldMiddleware => {
  const cache = new Map<string, { data: any; expires: number }>();

  return async (context: any, next: () => Promise<any>) => {
    const cacheKey = cacheKeyFn(context);
    const now = Date.now();

    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now) {
      return cached.data;
    }

    const result = await next();
    cache.set(cacheKey, {
      data: result,
      expires: now + ttl * 1000,
    });

    return result;
  };
};

/**
 * 35. Creates context enhancer for DataLoader injection.
 *
 * @param {Record<string, () => DataLoader<any, any>>} loaderFactories - Loader factories
 * @returns {Function} Context enhancer
 *
 * @example
 * ```typescript
 * const enhancer = createDataLoaderEnhancer({
 *   user: () => createModelDataLoader(User),
 *   posts: () => createOneToManyLoader(Post, 'userId')
 * });
 * ```
 */
export const createDataLoaderEnhancer = (
  loaderFactories: Record<string, () => DataLoader<any, any>>,
): Function => {
  return (context: GraphQLContext): GraphQLContext => {
    return {
      ...context,
      dataloaders: createDataLoaderMap(loaderFactories),
    };
  };
};

/**
 * 36. Creates context enhancer for user authentication.
 *
 * @param {Function} extractUserFn - Function to extract user from request
 * @returns {Function} Authentication enhancer
 *
 * @example
 * ```typescript
 * const enhancer = createAuthenticationEnhancer(
 *   async (req) => {
 *     const token = req.headers.authorization;
 *     return await verifyToken(token);
 *   }
 * );
 * ```
 */
export const createAuthenticationEnhancer = (extractUserFn: Function): Function => {
  return async (context: GraphQLContext): Promise<GraphQLContext> => {
    try {
      const user = await extractUserFn(context.req);
      return { ...context, user };
    } catch (error) {
      console.error('Authentication error:', error);
      return context;
    }
  };
};

// ============================================================================
// SECTION 6: QUERY COMPLEXITY & VALIDATION (Functions 37-42)
// ============================================================================

/**
 * 37. Calculates query complexity score.
 *
 * @param {any} query - GraphQL query AST
 * @param {Record<string, number>} fieldComplexities - Field complexity map
 * @returns {number} Total complexity score
 *
 * @example
 * ```typescript
 * const complexity = calculateQueryComplexity(queryAst, {
 *   'User.posts': 10,
 *   'Post.comments': 5
 * });
 * ```
 */
export const calculateQueryComplexity = (
  query: any,
  fieldComplexities: Record<string, number>,
): number => {
  let totalComplexity = 0;

  const calculateNode = (node: any, depth: number = 0): void => {
    if (!node) return;

    if (node.selectionSet) {
      node.selectionSet.selections.forEach((selection: any) => {
        const fieldKey = `${node.name?.value || 'Query'}.${selection.name?.value}`;
        const fieldComplexity = fieldComplexities[fieldKey] || 1;
        totalComplexity += fieldComplexity * (depth + 1);
        calculateNode(selection, depth + 1);
      });
    }
  };

  calculateNode(query);
  return totalComplexity;
};

/**
 * 38. Creates query depth validator.
 *
 * @param {number} maxDepth - Maximum allowed query depth
 * @returns {Function} Depth validation function
 *
 * @example
 * ```typescript
 * const validator = createDepthValidator(10);
 * validator(queryAst); // throws if depth > 10
 * ```
 */
export const createDepthValidator = (maxDepth: number): Function => {
  return (query: any) => {
    let currentDepth = 0;
    let maxReached = 0;

    const traverseNode = (node: any, depth: number): void => {
      if (depth > maxReached) {
        maxReached = depth;
      }

      if (node.selectionSet) {
        node.selectionSet.selections.forEach((selection: any) => {
          traverseNode(selection, depth + 1);
        });
      }
    };

    traverseNode(query, 0);

    if (maxReached > maxDepth) {
      throw new Error(`Query depth ${maxReached} exceeds maximum allowed depth ${maxDepth}`);
    }

    return true;
  };
};

/**
 * 39. Creates complexity estimator for list fields.
 *
 * @param {number} multiplier - Complexity multiplier per item
 * @returns {Function} Complexity estimator
 *
 * @example
 * ```typescript
 * const estimator = createListComplexityEstimator(10);
 * const complexity = estimator({ args: { first: 100 }, childComplexity: 5 });
 * // Result: 100 * 10 * 5 = 5000
 * ```
 */
export const createListComplexityEstimator = (multiplier: number): Function => {
  return (args: ComplexityEstimatorArgs): number => {
    const limit = args.args.first || args.args.limit || args.args.take || 10;
    return limit * multiplier * (args.childComplexity || 1);
  };
};

/**
 * 40. Validates input arguments against schema.
 *
 * @param {any} input - Input object
 * @param {Record<string, any>} schema - Validation schema
 * @returns {boolean | string} True if valid, error message otherwise
 *
 * @example
 * ```typescript
 * const isValid = validateInputArgs(
 *   { email: 'test@example.com', age: 25 },
 *   { email: { type: 'email', required: true }, age: { type: 'number', min: 18 } }
 * );
 * ```
 */
export const validateInputArgs = (
  input: any,
  schema: Record<string, any>,
): boolean | string => {
  for (const [field, rules] of Object.entries(schema)) {
    const value = input[field];

    if (rules.required && (value === undefined || value === null)) {
      return `Field '${field}' is required`;
    }

    if (value !== undefined && value !== null) {
      if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return `Field '${field}' must be a valid email`;
      }

      if (rules.type === 'number' && typeof value !== 'number') {
        return `Field '${field}' must be a number`;
      }

      if (rules.min !== undefined && value < rules.min) {
        return `Field '${field}' must be at least ${rules.min}`;
      }

      if (rules.max !== undefined && value > rules.max) {
        return `Field '${field}' must be at most ${rules.max}`;
      }

      if (rules.minLength !== undefined && value.length < rules.minLength) {
        return `Field '${field}' must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return `Field '${field}' must be at most ${rules.maxLength} characters`;
      }
    }
  }

  return true;
};

/**
 * 41. Creates query complexity plugin configuration.
 *
 * @param {number} maximumComplexity - Maximum allowed complexity
 * @param {Function} [onComplete] - Callback after complexity calculation
 * @returns {QueryComplexityConfig} Complexity plugin configuration
 *
 * @example
 * ```typescript
 * const config = createComplexityPlugin(
 *   1000,
 *   (complexity) => logger.info(`Query complexity: ${complexity}`)
 * );
 * ```
 */
export const createComplexityPlugin = (
  maximumComplexity: number,
  onComplete?: (complexity: number) => void,
): QueryComplexityConfig => {
  return {
    maximumComplexity,
    estimators: [],
    onComplete,
  };
};

/**
 * 42. Creates input sanitizer for GraphQL arguments.
 *
 * @param {string[]} [allowedFields] - Allowed field names
 * @param {boolean} [stripHtml=true] - Strip HTML tags
 * @returns {Function} Input sanitizer
 *
 * @example
 * ```typescript
 * const sanitize = createInputSanitizer(['name', 'email'], true);
 * const clean = sanitize({ name: '<script>alert(1)</script>', email: 'test@example.com' });
 * // Result: { name: 'alert(1)', email: 'test@example.com' }
 * ```
 */
export const createInputSanitizer = (
  allowedFields?: string[],
  stripHtml: boolean = true,
): Function => {
  return (input: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(input)) {
      if (allowedFields && !allowedFields.includes(key)) {
        continue;
      }

      if (typeof value === 'string') {
        let sanitizedValue = value;
        if (stripHtml) {
          sanitizedValue = sanitizedValue.replace(/<[^>]*>/g, '');
        }
        sanitizedValue = sanitizedValue.trim();
        sanitized[key] = sanitizedValue;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = createInputSanitizer(allowedFields, stripHtml)(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };
};

// ============================================================================
// SECTION 7: ERROR HANDLING & FORMATTING (Functions 43-45)
// ============================================================================

/**
 * 43. Formats GraphQL error with custom error codes.
 *
 * @param {Error} error - Original error
 * @param {string} [code='INTERNAL_SERVER_ERROR'] - Error code
 * @param {Record<string, any>} [extensions] - Additional error extensions
 * @returns {any} Formatted GraphQL error
 *
 * @example
 * ```typescript
 * const formattedError = formatGraphQLError(
 *   new Error('User not found'),
 *   'NOT_FOUND',
 *   { userId: 123 }
 * );
 * ```
 */
export const formatGraphQLError = (
  error: Error,
  code: string = 'INTERNAL_SERVER_ERROR',
  extensions?: Record<string, any>,
): any => {
  return {
    message: error.message,
    extensions: {
      code,
      timestamp: new Date().toISOString(),
      ...extensions,
    },
  };
};

/**
 * 44. Creates error formatter function for GraphQL configuration.
 *
 * @param {boolean} [includeStackTrace=false] - Include stack trace in errors
 * @param {Function} [logger] - Logger function
 * @returns {Function} Error formatter
 *
 * @example
 * ```typescript
 * const formatter = createErrorFormatter(false, console.error);
 * GraphQLModule.forRoot({ formatError: formatter });
 * ```
 */
export const createErrorFormatter = (
  includeStackTrace: boolean = false,
  logger?: Function,
): Function => {
  return (error: any) => {
    if (logger) {
      logger('GraphQL Error:', error);
    }

    const formattedError: any = {
      message: error.message,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
    };

    if (includeStackTrace && error.stack) {
      formattedError.extensions.stackTrace = error.stack.split('\n');
    }

    if (error.path) {
      formattedError.path = error.path;
    }

    if (error.locations) {
      formattedError.locations = error.locations;
    }

    return formattedError;
  };
};

/**
 * 45. Creates user-friendly error messages for common GraphQL errors.
 *
 * @param {Error} error - Original error
 * @param {Record<string, string>} [messageMap] - Custom error message mappings
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = getUserFriendlyError(
 *   new Error('UNIQUE constraint failed'),
 *   { 'UNIQUE constraint': 'This value is already in use' }
 * );
 * // Result: 'This value is already in use'
 * ```
 */
export const getUserFriendlyError = (
  error: Error,
  messageMap?: Record<string, string>,
): string => {
  const defaultMessages: Record<string, string> = {
    'UNIQUE constraint': 'This value is already in use',
    'NOT NULL constraint': 'Required field is missing',
    'FOREIGN KEY constraint': 'Referenced item does not exist',
    'Authentication required': 'Please log in to continue',
    'Insufficient permissions': 'You do not have access to this resource',
    'Validation failed': 'Invalid input data provided',
    ...messageMap,
  };

  for (const [key, message] of Object.entries(defaultMessages)) {
    if (error.message.includes(key)) {
      return message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};
