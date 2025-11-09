/**
 * LOC: GQLP1234567
 * File: /reuse/graphql-pro-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - GraphQL resolvers and modules
 *   - NestJS GraphQL services
 *   - GraphQL middleware and plugins
 */
/**
 * File: /reuse/graphql-pro-kit.ts
 * Locator: WC-UTL-GQLP-001
 * Purpose: Comprehensive GraphQL Utilities - Schema builders, resolvers, DataLoader, subscriptions, complexity analysis
 *
 * Upstream: Independent utility module for GraphQL implementation
 * Downstream: ../backend/*, GraphQL resolvers, services, middleware
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/graphql, graphql, DataLoader, Sequelize
 * Exports: 40 utility functions for GraphQL schema building, resolver helpers, DataLoader, subscriptions, authorization
 *
 * LLM Context: Comprehensive GraphQL utilities for building production-ready GraphQL APIs in White Cross healthcare system.
 * Provides schema builders, type generators, resolver helpers, DataLoader implementations for N+1 prevention, subscription
 * management, query complexity analysis, field-level authorization, input validation, error formatting, cursor-based
 * pagination, Relay connections, GraphQL directives, Sequelize to GraphQL mapping, and performance monitoring.
 */
import DataLoader from 'dataloader';
import { Model, ModelCtor, WhereOptions, FindOptions } from 'sequelize';
import { GraphQLResolveInfo, GraphQLFieldResolver, GraphQLScalarType, GraphQLError } from 'graphql';
interface GraphQLContext {
    req: any;
    res: any;
    user?: any;
    dataloaders: Map<string, DataLoader<any, any>>;
    [key: string]: any;
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
interface CursorPaginationArgs {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
interface FieldAuthorizationRule {
    field: string;
    roles?: string[];
    permissions?: string[];
    customCheck?: (context: GraphQLContext, parent: any, args: any) => boolean | Promise<boolean>;
}
interface ComplexityEstimator {
    defaultComplexity: number;
    scalarCost: number;
    objectCost: number;
    listMultiplier: number;
}
interface QueryComplexityResult {
    complexity: number;
    depth: number;
    breadth: number;
    fieldCount: number;
}
interface GraphQLDirective {
    name: string;
    description: string;
    locations: string[];
    args?: Record<string, any>;
}
interface SubscriptionConfig {
    topic: string;
    filter?: (payload: any, variables: any, context: GraphQLContext) => boolean | Promise<boolean>;
    resolve?: (payload: any, args: any, context: GraphQLContext, info: GraphQLResolveInfo) => any;
}
interface DataLoaderConfig {
    batch: boolean;
    cache: boolean;
    maxBatchSize?: number;
    cacheKeyFn?: (key: any) => any;
    cacheMap?: Map<any, any>;
}
interface ResolverMetrics {
    fieldName: string;
    typeName: string;
    executionTime: number;
    timestamp: Date;
    complexity: number;
    error?: Error;
}
interface SequelizeFieldMapping {
    sequelizeType: string;
    graphqlType: string;
    nullable: boolean;
    list: boolean;
}
interface InputValidationRule {
    field: string;
    validator: (value: any) => boolean | Promise<boolean>;
    message: string;
}
/**
 * Generates GraphQL object type definition from Sequelize model.
 *
 * @param {ModelCtor<Model>} model - Sequelize model class
 * @param {string} typeName - GraphQL type name
 * @param {string[]} [excludeFields] - Fields to exclude from type
 * @returns {string} GraphQL type definition string
 *
 * @example
 * ```typescript
 * const userType = generateGraphQLTypeFromModel(
 *   UserModel,
 *   'User',
 *   ['password', 'resetToken']
 * );
 * // Result: "type User { id: ID! email: String! username: String! ... }"
 * ```
 */
export declare const generateGraphQLTypeFromModel: (model: ModelCtor<Model>, typeName: string, excludeFields?: string[]) => string;
/**
 * Maps Sequelize data type to GraphQL type.
 *
 * @param {string} sequelizeType - Sequelize data type name
 * @returns {SequelizeFieldMapping} GraphQL type mapping
 *
 * @example
 * ```typescript
 * const mapping = mapSequelizeToGraphQLType('STRING');
 * // Result: { sequelizeType: 'STRING', graphqlType: 'String', nullable: true, list: false }
 * ```
 */
export declare const mapSequelizeToGraphQLType: (sequelizeType: string) => SequelizeFieldMapping;
/**
 * Creates GraphQL input type from object type definition.
 *
 * @param {string} typeName - Base type name
 * @param {Record<string, string>} fields - Field definitions
 * @param {string[]} [requiredFields] - Required field names
 * @returns {string} GraphQL input type definition
 *
 * @example
 * ```typescript
 * const input = createInputType('CreateUser', {
 *   email: 'String',
 *   username: 'String',
 *   password: 'String'
 * }, ['email', 'password']);
 * // Result: "input CreateUserInput { email: String! username: String password: String! }"
 * ```
 */
export declare const createInputType: (typeName: string, fields: Record<string, string>, requiredFields?: string[]) => string;
/**
 * Generates GraphQL enum type from TypeScript enum or array.
 *
 * @param {string} enumName - GraphQL enum name
 * @param {string[] | Record<string, string>} values - Enum values
 * @param {string} [description] - Enum description
 * @returns {string} GraphQL enum definition
 *
 * @example
 * ```typescript
 * const roleEnum = createEnumType('UserRole', ['ADMIN', 'USER', 'MODERATOR']);
 * // Result: "enum UserRole { ADMIN USER MODERATOR }"
 * ```
 */
export declare const createEnumType: (enumName: string, values: string[] | Record<string, string>, description?: string) => string;
/**
 * Creates custom GraphQL scalar type with validation.
 *
 * @param {string} name - Scalar type name
 * @param {string} description - Scalar description
 * @param {Function} serialize - Serialization function
 * @param {Function} parseValue - Value parsing function
 * @param {Function} parseLiteral - Literal parsing function
 * @returns {GraphQLScalarType} Custom scalar type
 *
 * @example
 * ```typescript
 * const EmailScalar = createCustomScalar(
 *   'Email',
 *   'Email address scalar type',
 *   (value) => value.toLowerCase(),
 *   (value) => {
 *     if (!isValidEmail(value)) throw new Error('Invalid email');
 *     return value;
 *   }
 * );
 * ```
 */
export declare const createCustomScalar: (name: string, description: string, serialize: (value: any) => any, parseValue: (value: any) => any, parseLiteral?: (ast: any) => any) => GraphQLScalarType;
/**
 * Creates a resolver wrapper with error handling and logging.
 *
 * @param {Function} resolverFn - Resolver function
 * @param {string} fieldName - Field name for logging
 * @returns {GraphQLFieldResolver<any, any>} Wrapped resolver
 *
 * @example
 * ```typescript
 * const getUser = wrapResolver(
 *   async (parent, args, context, info) => {
 *     return await context.userService.findById(args.id);
 *   },
 *   'User.getUser'
 * );
 * ```
 */
export declare const wrapResolver: (resolverFn: GraphQLFieldResolver<any, any>, fieldName: string) => GraphQLFieldResolver<any, any>;
/**
 * Creates a batched field resolver using DataLoader.
 *
 * @param {string} loaderKey - DataLoader key in context
 * @param {Function} keyExtractor - Function to extract key from parent
 * @returns {GraphQLFieldResolver<any, any>} Batched resolver
 *
 * @example
 * ```typescript
 * const postsResolver = createBatchedResolver(
 *   'postsLoader',
 *   (user) => user.id
 * );
 * // Automatically batches requests for user posts
 * ```
 */
export declare const createBatchedResolver: (loaderKey: string, keyExtractor: (parent: any) => any) => GraphQLFieldResolver<any, any>;
/**
 * Creates a resolver that applies authorization checks.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver function
 * @param {string[]} allowedRoles - Allowed user roles
 * @param {string[]} [requiredPermissions] - Required permissions
 * @returns {GraphQLFieldResolver<any, any>} Authorized resolver
 *
 * @example
 * ```typescript
 * const deleteUser = authorizeResolver(
 *   async (parent, args, context) => {
 *     return await context.userService.delete(args.id);
 *   },
 *   ['ADMIN'],
 *   ['user.delete']
 * );
 * ```
 */
export declare const authorizeResolver: (resolver: GraphQLFieldResolver<any, any>, allowedRoles: string[], requiredPermissions?: string[]) => GraphQLFieldResolver<any, any>;
/**
 * Creates a cached resolver with TTL support.
 *
 * @param {GraphQLFieldResolver<any, any>} resolver - Base resolver
 * @param {number} ttl - Cache TTL in seconds
 * @param {Function} [keyGenerator] - Custom cache key generator
 * @returns {GraphQLFieldResolver<any, any>} Cached resolver
 *
 * @example
 * ```typescript
 * const getPopularPosts = createCachedResolver(
 *   async (parent, args, context) => {
 *     return await context.postService.getPopular(args.limit);
 *   },
 *   300, // 5 minutes
 *   (parent, args) => `popular-posts-${args.limit}`
 * );
 * ```
 */
export declare const createCachedResolver: (resolver: GraphQLFieldResolver<any, any>, ttl: number, keyGenerator?: (parent: any, args: any, context: any) => string) => GraphQLFieldResolver<any, any>;
/**
 * Creates a generic DataLoader for Sequelize models by primary key.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {DataLoaderConfig} [config] - DataLoader configuration
 * @returns {DataLoader<any, any>} Configured DataLoader
 *
 * @example
 * ```typescript
 * const userLoader = createModelLoader(UserModel, {
 *   batch: true,
 *   cache: true,
 *   maxBatchSize: 100
 * });
 * const user = await userLoader.load(userId);
 * ```
 */
export declare const createModelLoader: (model: ModelCtor<Model>, config?: Partial<DataLoaderConfig>) => DataLoader<any, any>;
/**
 * Creates a DataLoader for loading related records (one-to-many).
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key field name
 * @param {FindOptions} [options] - Additional Sequelize find options
 * @returns {DataLoader<any, any[]>} DataLoader for related records
 *
 * @example
 * ```typescript
 * const postsLoader = createRelationLoader(
 *   PostModel,
 *   'userId',
 *   { order: [['createdAt', 'DESC']] }
 * );
 * const userPosts = await postsLoader.load(userId);
 * ```
 */
export declare const createRelationLoader: (model: ModelCtor<Model>, foreignKey: string, options?: FindOptions) => DataLoader<any, any[]>;
/**
 * Creates a DataLoader for many-to-many relationships through junction table.
 *
 * @param {ModelCtor<Model>} model - Target model
 * @param {ModelCtor<Model>} junctionModel - Junction table model
 * @param {string} sourceKey - Source foreign key in junction table
 * @param {string} targetKey - Target foreign key in junction table
 * @returns {DataLoader<any, any[]>} DataLoader for many-to-many relations
 *
 * @example
 * ```typescript
 * const userRolesLoader = createManyToManyLoader(
 *   RoleModel,
 *   UserRoleModel,
 *   'userId',
 *   'roleId'
 * );
 * const roles = await userRolesLoader.load(userId);
 * ```
 */
export declare const createManyToManyLoader: (model: ModelCtor<Model>, junctionModel: ModelCtor<Model>, sourceKey: string, targetKey: string) => DataLoader<any, any[]>;
/**
 * Creates a count DataLoader for aggregation queries.
 *
 * @param {ModelCtor<Model>} model - Sequelize model
 * @param {string} foreignKey - Foreign key to count by
 * @param {WhereOptions} [additionalWhere] - Additional where conditions
 * @returns {DataLoader<any, number>} Count DataLoader
 *
 * @example
 * ```typescript
 * const postCountLoader = createCountLoader(PostModel, 'userId', { published: true });
 * const publishedPostCount = await postCountLoader.load(userId);
 * ```
 */
export declare const createCountLoader: (model: ModelCtor<Model>, foreignKey: string, additionalWhere?: WhereOptions) => DataLoader<any, number>;
/**
 * Creates a complexity analysis plugin for query cost limiting.
 *
 * @param {number} maxComplexity - Maximum allowed query complexity
 * @param {ComplexityEstimator} [estimator] - Complexity estimator config
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createComplexityPlugin(1000, {
 *   defaultComplexity: 1,
 *   scalarCost: 1,
 *   objectCost: 2,
 *   listMultiplier: 10
 * });
 * ```
 */
export declare const createComplexityPlugin: (maxComplexity: number, estimator?: Partial<ComplexityEstimator>) => any;
/**
 * Creates a query depth limiting plugin.
 *
 * @param {number} maxDepth - Maximum query depth
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createDepthLimitPlugin(5);
 * // Prevents queries deeper than 5 levels
 * ```
 */
export declare const createDepthLimitPlugin: (maxDepth: number) => any;
/**
 * Creates a performance monitoring plugin.
 *
 * @param {Function} onMetrics - Callback for metrics reporting
 * @returns {Function} GraphQL plugin function
 *
 * @example
 * ```typescript
 * const plugin = createPerformanceMonitoringPlugin((metrics) => {
 *   console.log(`Query executed in ${metrics.duration}ms`);
 * });
 * ```
 */
export declare const createPerformanceMonitoringPlugin: (onMetrics: (metrics: ResolverMetrics) => void) => any;
/**
 * Creates field-level authorization middleware.
 *
 * @param {FieldAuthorizationRule[]} rules - Authorization rules
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const authMiddleware = createFieldAuthorizationMiddleware([
 *   { field: 'User.email', roles: ['ADMIN', 'SELF'] },
 *   { field: 'User.salary', permissions: ['view.salary'] }
 * ]);
 * ```
 */
export declare const createFieldAuthorizationMiddleware: (rules: FieldAuthorizationRule[]) => any;
/**
 * Creates a subscription with filtering support.
 *
 * @param {SubscriptionConfig} config - Subscription configuration
 * @returns {Object} Subscription resolver configuration
 *
 * @example
 * ```typescript
 * const notificationSubscription = createFilteredSubscription({
 *   topic: 'NOTIFICATION_SENT',
 *   filter: (payload, variables, context) => {
 *     return payload.userId === context.user.id;
 *   }
 * });
 * ```
 */
export declare const createFilteredSubscription: (config: SubscriptionConfig) => any;
/**
 * Creates a subscription manager with cleanup.
 *
 * @param {Map<string, any>} subscriptions - Subscription storage
 * @returns {Object} Subscription manager methods
 *
 * @example
 * ```typescript
 * const manager = createSubscriptionManager(new Map());
 * manager.add('user-123', subscription);
 * manager.remove('user-123');
 * ```
 */
export declare const createSubscriptionManager: (subscriptions: Map<string, any>) => {
    add: (id: string, subscription: any) => void;
    remove: (id: string) => void;
    get: (id: string) => any;
    cleanup: () => void;
};
/**
 * Creates a PubSub message with metadata.
 *
 * @param {string} topic - Publication topic
 * @param {any} payload - Message payload
 * @param {Record<string, any>} [metadata] - Additional metadata
 * @returns {Object} Formatted message
 *
 * @example
 * ```typescript
 * const message = createPubSubMessage('USER_CREATED', user, {
 *   timestamp: Date.now(),
 *   source: 'user-service'
 * });
 * ```
 */
export declare const createPubSubMessage: (topic: string, payload: any, metadata?: Record<string, any>) => {
    topic: string;
    payload: any;
    metadata: Record<string, any>;
    timestamp: number;
};
/**
 * Calculates query complexity from GraphQL document.
 *
 * @param {any} document - GraphQL document
 * @param {ComplexityEstimator} estimator - Complexity estimator
 * @returns {QueryComplexityResult} Complexity metrics
 *
 * @example
 * ```typescript
 * const complexity = calculateQueryComplexity(document, {
 *   defaultComplexity: 1,
 *   scalarCost: 1,
 *   objectCost: 2,
 *   listMultiplier: 10
 * });
 * // Result: { complexity: 45, depth: 3, breadth: 15, fieldCount: 20 }
 * ```
 */
export declare const calculateQueryComplexity: (document: any, estimator: ComplexityEstimator) => QueryComplexityResult;
/**
 * Calculates query depth from selection set.
 *
 * @param {any} node - GraphQL selection node
 * @param {number} [currentDepth] - Current depth counter
 * @returns {number} Maximum query depth
 *
 * @example
 * ```typescript
 * const depth = calculateQueryDepth(document.definitions[0]);
 * // Result: 5
 * ```
 */
export declare const calculateQueryDepth: (node: any, currentDepth?: number) => number;
/**
 * Estimates field complexity with custom logic.
 *
 * @param {string} fieldName - Field name
 * @param {Record<string, number>} fieldCosts - Custom field costs
 * @param {any} args - Field arguments
 * @returns {number} Estimated complexity
 *
 * @example
 * ```typescript
 * const complexity = estimateFieldComplexity('users', {
 *   users: 10,
 *   posts: 5
 * }, { limit: 100 });
 * // Result: 1000 (base cost 10 * limit 100)
 * ```
 */
export declare const estimateFieldComplexity: (fieldName: string, fieldCosts: Record<string, number>, args: any) => number;
/**
 * Validates GraphQL input against rules.
 *
 * @param {any} input - Input object to validate
 * @param {InputValidationRule[]} rules - Validation rules
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateGraphQLInput(
 *   { email: 'invalid', age: -1 },
 *   [
 *     { field: 'email', validator: isEmail, message: 'Invalid email' },
 *     { field: 'age', validator: (v) => v > 0, message: 'Age must be positive' }
 *   ]
 * );
 * // Result: { valid: false, errors: ['Invalid email', 'Age must be positive'] }
 * ```
 */
export declare const validateGraphQLInput: (input: any, rules: InputValidationRule[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Transforms GraphQL input with sanitization.
 *
 * @param {any} input - Input object
 * @param {Record<string, Function>} transformers - Field transformers
 * @returns {any} Transformed input
 *
 * @example
 * ```typescript
 * const clean = transformGraphQLInput(
 *   { email: ' USER@EXAMPLE.COM ', username: 'John_Doe' },
 *   {
 *     email: (v) => v.trim().toLowerCase(),
 *     username: (v) => v.trim()
 *   }
 * );
 * // Result: { email: 'user@example.com', username: 'John_Doe' }
 * ```
 */
export declare const transformGraphQLInput: (input: any, transformers: Record<string, (value: any) => any>) => any;
/**
 * Sanitizes GraphQL input by removing null/undefined values.
 *
 * @param {any} input - Input object
 * @param {boolean} [deep] - Deep sanitization
 * @returns {any} Sanitized input
 *
 * @example
 * ```typescript
 * const clean = sanitizeGraphQLInput({ name: 'John', email: null, age: undefined });
 * // Result: { name: 'John' }
 * ```
 */
export declare const sanitizeGraphQLInput: (input: any, deep?: boolean) => any;
/**
 * Formats errors for GraphQL response with extensions.
 *
 * @param {Error} error - Original error
 * @param {Record<string, any>} [extensions] - Additional error extensions
 * @returns {GraphQLError} Formatted GraphQL error
 *
 * @example
 * ```typescript
 * const formatted = formatGraphQLError(
 *   new Error('User not found'),
 *   { code: 'USER_NOT_FOUND', userId: '123' }
 * );
 * ```
 */
export declare const formatGraphQLError: (error: Error, extensions?: Record<string, any>) => GraphQLError;
/**
 * Creates error formatter function for GraphQL config.
 *
 * @param {boolean} [includeStackTrace] - Include stack traces
 * @returns {Function} Error formatter function
 *
 * @example
 * ```typescript
 * const formatError = createErrorFormatter(process.env.NODE_ENV !== 'production');
 * // Use in GraphQL config: { formatError }
 * ```
 */
export declare const createErrorFormatter: (includeStackTrace?: boolean) => (error: GraphQLError) => any;
/**
 * Handles GraphQL errors with logging.
 *
 * @param {GraphQLError} error - GraphQL error
 * @param {Function} [logger] - Custom logger function
 * @returns {GraphQLError} Processed error
 *
 * @example
 * ```typescript
 * const handled = handleGraphQLError(error, (err) => {
 *   console.error('GraphQL Error:', err);
 * });
 * ```
 */
export declare const handleGraphQLError: (error: GraphQLError, logger?: (error: GraphQLError) => void) => GraphQLError;
/**
 * Encodes cursor from object (base64).
 *
 * @param {Record<string, any>} data - Cursor data
 * @returns {string} Encoded cursor
 *
 * @example
 * ```typescript
 * const cursor = encodeCursor({ id: 123, timestamp: '2024-01-01' });
 * // Result: 'eyJpZCI6MTIzLCJ0aW1lc3RhbXAiOiIyMDI0LTAxLTAxIn0='
 * ```
 */
export declare const encodeCursor: (data: Record<string, any>) => string;
/**
 * Decodes cursor to object.
 *
 * @param {string} cursor - Encoded cursor
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
 * Creates Relay-style connection from array of records.
 *
 * @param {T[]} records - Array of records
 * @param {CursorPaginationArgs} args - Pagination arguments
 * @param {Function} cursorExtractor - Function to extract cursor from record
 * @returns {Connection<T>} Relay connection
 *
 * @example
 * ```typescript
 * const connection = createConnection(
 *   users,
 *   { first: 10, after: 'cursor123' },
 *   (user) => encodeCursor({ id: user.id })
 * );
 * ```
 */
export declare const createConnection: <T>(records: T[], args: CursorPaginationArgs, cursorExtractor: (record: T) => string) => Connection<T>;
/**
 * Applies cursor pagination to Sequelize query.
 *
 * @param {CursorPaginationArgs} args - Pagination arguments
 * @param {string} [cursorField] - Field to use for cursor (default: 'id')
 * @returns {FindOptions} Sequelize query options
 *
 * @example
 * ```typescript
 * const options = applyCursorPagination({ first: 10, after: 'cursor123' });
 * const users = await UserModel.findAll(options);
 * ```
 */
export declare const applyCursorPagination: (args: CursorPaginationArgs, cursorField?: string) => FindOptions;
/**
 * Creates @deprecated directive implementation.
 *
 * @param {string} reason - Deprecation reason
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const deprecated = createDeprecatedDirective('Use newField instead');
 * ```
 */
export declare const createDeprecatedDirective: (reason: string) => GraphQLDirective;
/**
 * Creates @auth directive for field-level authorization.
 *
 * @param {string[]} roles - Required roles
 * @param {string[]} [permissions] - Required permissions
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const auth = createAuthDirective(['ADMIN'], ['user.delete']);
 * ```
 */
export declare const createAuthDirective: (roles: string[], permissions?: string[]) => GraphQLDirective;
/**
 * Creates @rateLimit directive for query rate limiting.
 *
 * @param {number} limit - Max requests
 * @param {number} window - Time window in seconds
 * @returns {GraphQLDirective} Directive definition
 *
 * @example
 * ```typescript
 * const rateLimit = createRateLimitDirective(100, 60); // 100 requests per minute
 * ```
 */
export declare const createRateLimitDirective: (limit: number, window: number) => GraphQLDirective;
/**
 * Tracks resolver execution metrics.
 *
 * @param {ResolverMetrics[]} metrics - Metrics array
 * @returns {Object} Aggregated metrics
 *
 * @example
 * ```typescript
 * const stats = trackResolverMetrics(context.metrics);
 * // Result: { totalTime: 245ms, slowestResolver: 'User.posts', avgTime: 12ms }
 * ```
 */
export declare const trackResolverMetrics: (metrics: ResolverMetrics[]) => {
    totalTime: number;
    avgTime: number;
    slowestResolver: string;
    fastestResolver: string;
    errorCount: number;
};
/**
 * Extracts requested fields from GraphQL info object.
 *
 * @param {GraphQLResolveInfo} info - GraphQL resolve info
 * @param {number} [maxDepth] - Maximum depth to extract
 * @returns {string[]} Requested field paths
 *
 * @example
 * ```typescript
 * const fields = extractRequestedFields(info);
 * // Result: ['id', 'email', 'posts.id', 'posts.title']
 * ```
 */
export declare const extractRequestedFields: (info: GraphQLResolveInfo, maxDepth?: number) => string[];
/**
 * Creates query performance report.
 *
 * @param {GraphQLResolveInfo} info - GraphQL resolve info
 * @param {ResolverMetrics[]} metrics - Resolver metrics
 * @returns {Object} Performance report
 *
 * @example
 * ```typescript
 * const report = createQueryPerformanceReport(info, context.metrics);
 * console.log(report);
 * ```
 */
export declare const createQueryPerformanceReport: (info: GraphQLResolveInfo, metrics: ResolverMetrics[]) => {
    operationName: string;
    fieldCount: number;
    resolverCount: number;
    totalTime: number;
    avgResolverTime: number;
    slowestResolvers: ResolverMetrics[];
    errors: number;
};
export {};
//# sourceMappingURL=graphql-pro-kit.d.ts.map