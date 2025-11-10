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
import { ExecutionContext, Type } from '@nestjs/common';
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
export declare const createConnection: <T>(nodes: T[], args: PaginationArgs, totalCount: number) => Connection<T>;
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
export declare const encodeCursor: (data: Record<string, any>) => string;
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
export declare const decodeCursor: (cursor: string) => Record<string, any>;
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
export declare const getPaginationOffset: (args: PaginationArgs, defaultLimit?: number) => {
    offset: number;
    limit: number;
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
export declare const buildFieldConfig: (fieldName: string, typeFn: () => Type<any>, options?: ResolverOptions) => Record<string, any>;
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
export declare const createUnionTypeResolver: (typeMap: Map<string, Type<any>>) => ((value: any) => Type<any> | null);
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
export declare const buildSchemaDirective: (name: string, locations: string[], args?: Record<string, any>) => SchemaDirectiveConfig;
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
export declare const mergeGraphQLSchemas: (schemas: any[]) => any;
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
export declare const createDataLoader: <K, V>(batchFn: DataLoaderBatchFunction<K, V>, cache?: boolean) => DataLoader<K, V>;
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
export declare const createModelDataLoader: <T extends Model>(model: ModelCtor<T>, keyField?: string) => DataLoader<any, T | null>;
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
export declare const createOneToManyLoader: <T extends Model>(model: ModelCtor<T>, foreignKey: string) => DataLoader<any, T[]>;
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
export declare const createManyToManyLoader: <T extends Model>(model: ModelCtor<T>, junctionTable: string, sourceKey: string, targetKey: string, sequelize: Sequelize) => DataLoader<any, T[]>;
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
export declare const createDataLoaderWithCacheKey: <K, V>(batchFn: DataLoaderBatchFunction<K, V>, cacheKeyFn: (key: K) => string) => DataLoader<K, V>;
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
export declare const primeDataLoader: <K, V>(loader: DataLoader<K, V>, items: V[], keyFn: (item: V) => K) => void;
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
export declare const clearDataLoaderCache: <K, V>(loader: DataLoader<K, V>, keys: K[]) => void;
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
export declare const createDataLoaderMap: (loaderFactories: Record<string, () => DataLoader<any, any>>) => Map<string, DataLoader<any, any>>;
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
export declare const getGraphQLContext: (context: ExecutionContext) => GraphQLContext;
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
export declare const getCurrentUser: (context: GraphQLContext) => any | null;
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
export declare const createFieldResolver: (resolverFn: Function, fieldName?: string) => Function;
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
export declare const createMutationResolver: (mutationFn: Function, validateFn?: Function, useTransaction?: boolean) => Function;
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
export declare const createBatchedResolver: (loaderName: string, keyFn: (parent: any) => any) => Function;
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
export declare const createCachedResolver: (resolverFn: Function, ttl: number, cacheKeyFn: (args: any) => string) => Function;
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
export declare const createPaginatedResolver: (fetchFn: Function) => Function;
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
export declare const createAuthorizedResolver: (resolverFn: Function, rule: AuthorizationRule) => Function;
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
export declare const createSubscriptionFilter: (filterFn: Function) => Function;
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
export declare const createAuthenticatedSubscription: (topic: string, filterFn?: Function, requireAuth?: boolean) => SubscriptionConfig;
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
export declare const createRateLimitedSubscription: (topic: string, maxEventsPerMinute: number) => SubscriptionConfig;
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
export declare const createSubscriptionTransform: (transformFn: Function) => Function;
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
export declare const createUserSubscription: (topic: string, userIdExtractor: (payload: any) => any) => SubscriptionConfig;
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
export declare const createMultiTopicSubscription: (topics: string[], filterFn?: Function) => SubscriptionConfig;
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
export declare const createContextBuilder: (baseContext: Record<string, any>, enhancers?: Function[]) => Function;
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
export declare const createFieldLoggingMiddleware: (logPrefix?: string) => FieldMiddleware;
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
export declare const createPerformanceMiddleware: (slowThreshold: number, onSlow: (fieldName: string, duration: number) => void) => FieldMiddleware;
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
export declare const createCachingMiddleware: (ttl: number, cacheKeyFn: (context: any) => string) => FieldMiddleware;
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
export declare const createDataLoaderEnhancer: (loaderFactories: Record<string, () => DataLoader<any, any>>) => Function;
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
export declare const createAuthenticationEnhancer: (extractUserFn: Function) => Function;
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
export declare const calculateQueryComplexity: (query: any, fieldComplexities: Record<string, number>) => number;
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
export declare const createDepthValidator: (maxDepth: number) => Function;
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
export declare const createListComplexityEstimator: (multiplier: number) => Function;
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
export declare const validateInputArgs: (input: any, schema: Record<string, any>) => boolean | string;
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
export declare const createComplexityPlugin: (maximumComplexity: number, onComplete?: (complexity: number) => void) => QueryComplexityConfig;
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
export declare const createInputSanitizer: (allowedFields?: string[], stripHtml?: boolean) => Function;
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
export declare const formatGraphQLError: (error: Error, code?: string, extensions?: Record<string, any>) => any;
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
export declare const createErrorFormatter: (includeStackTrace?: boolean, logger?: Function) => Function;
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
export declare const getUserFriendlyError: (error: Error, messageMap?: Record<string, string>) => string;
export {};
//# sourceMappingURL=nestjs-graphql-schema-kit.d.ts.map